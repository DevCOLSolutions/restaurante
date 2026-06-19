import { useState, useEffect, useRef } from "react"
import { BASE_URL } from "@/lib/apiClient"
import { ENDPOINTS } from "@/lib/endpoints"
import type { ApiResponse } from "@/types/api"

export type UsernameStatus = "idle" | "checking" | "available" | "unavailable" | "error"

export function useUsernameAvailability(username: string, minLength = 3) {
  const [status, setStatus] = useState<UsernameStatus>("idle")
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const idleReturned = useRef(false)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (abortRef.current) abortRef.current.abort()

    const trimmed = username.trim()

    if (!trimmed || trimmed.length < minLength) {
      idleReturned.current = true
      return
    }
    idleReturned.current = false

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("checking")

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch(
          `${BASE_URL}${ENDPOINTS.USERS.CHECK_USERNAME}?username=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal, credentials: "include" },
        )

        if (controller.signal.aborted) return

        const json: ApiResponse<{ available: boolean }> = await res.json()

        if (idleReturned.current) return
      if (json.data?.available) {
          setStatus("available")
        } else {
          setStatus("unavailable")
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return
        setStatus("error")
      }
      }, 500)
  }, [username, minLength])

  return {
    status,
    isChecking: status === "checking",
    isAvailable: status === "available" ? true : status === "unavailable" ? false : null,
  }
}
