export function playSound(url: string) {
  try {
    const audio = new Audio(url)
    audio.volume = 0.5
    audio.play().catch(() => {})
  } catch {
    // audio not supported
  }
}
