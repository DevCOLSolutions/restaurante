export function useGreeting() {
  const hora = new Date().getHours()

  const opciones = {
    manana: {
      saludos: ["¡Buenos días!", "¡Arriba ese ánimo!", "Feliz mañana,", "¿Un cafecito? ☕"],
      frases: ["¿Qué se teje para hoy?", "A romperla desde temprano.", "¿Listo para un nuevo día?"],
    },
    tarde: {
      saludos: ["Buenas tardes,", "¡Hola, hola!", "¿Qué tal va la tarde?", "Buenas, buenas,"],
      frases: ["¿Cómo va el día?", "A mantener el ritmo.", "¿Qué hay de nuevo por aquí?"],
    },
    noche: {
      saludos: ["Buenas noches,", "¡Hola!", "Descansando un poco,", "¿Tarde productiva?"],
      frases: ["¿Qué se cuenta por acá?", "Cerrando el día con toda.", "Un último empujón."],
    },
  }

  let momento: "manana" | "tarde" | "noche" = "noche"
  if (hora >= 6 && hora < 12) momento = "manana"
  else if (hora >= 12 && hora < 18) momento = "tarde"

  const obtenerAleatorio = <T,>(arr: T[]) =>
    arr[Math.floor(Math.random() * arr.length)]

  const saludo = obtenerAleatorio(opciones[momento].saludos)
  const frase = obtenerAleatorio(opciones[momento].frases)

  return { saludo, frase }
}
