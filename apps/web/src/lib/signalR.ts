import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr"
import { BASE_URL } from "./apiClient"

let connection: HubConnection | null = null
let startPromise: Promise<void> | null = null

type EventHandler = (...args: unknown[]) => void
const handlers: Map<string, Set<EventHandler>> = new Map()

function getHubUrl(): string {
  const base = BASE_URL.endsWith("/api") ? BASE_URL.slice(0, -4) : BASE_URL
  return `${base}/hub/notificaciones`
}

export function getConnection(): HubConnection | null {
  return connection
}

export function getConnectionState(): HubConnectionState | null {
  return connection?.state ?? null
}

export async function startConnection(): Promise<void> {
  if (connection?.state === HubConnectionState.Connected) {
    return
  }

  if (startPromise) {
    return startPromise
  }

  if (connection) {
    await stopConnection()
  }

  startPromise = (async () => {
    connection = new HubConnectionBuilder()
      .withUrl(getHubUrl(), {
        withCredentials: true,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build()

    connection.onreconnecting(() => {
      console.warn("[SignalR] Reconectando...")
    })

    connection.onreconnected(() => {
      console.info("[SignalR] Reconectado")
    })

    connection.onclose(() => {
      console.info("[SignalR] Conexión cerrada")
    })

    for (const [event, eventHandlers] of handlers) {
      for (const handler of eventHandlers) {
        connection.on(event, handler)
      }
    }

    try {
      await connection.start()
      console.info("[SignalR] Conectado al hub de notificaciones")
    } catch (err) {
      console.error("[SignalR] Error al conectar:", err)
      connection = null
      throw err
    } finally {
      startPromise = null
    }
  })()

  return startPromise
}

export async function stopConnection(): Promise<void> {
  if (connection) {
    const conn = connection
    connection = null

    for (const [event, eventHandlers] of handlers) {
      for (const handler of eventHandlers) {
        conn.off(event, handler)
      }
    }

    try {
      await conn.stop()
      console.info("[SignalR] Desconectado del hub")
    } catch {
    }
  }
}

export function on(event: string, handler: EventHandler): () => void {
  if (!handlers.has(event)) {
    handlers.set(event, new Set())
  }
  handlers.get(event)!.add(handler)

  if (connection) {
    connection.on(event, handler)
  }

  return () => {
    handlers.get(event)?.delete(handler)
    connection?.off(event, handler)
  }
}

export function off(event: string, handler: EventHandler): void {
  handlers.get(event)?.delete(handler)
  connection?.off(event, handler)
}
