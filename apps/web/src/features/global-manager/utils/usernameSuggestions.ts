export function generateSuggestions(fullName: string): string[] {
  const parts = fullName.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return []
  const first = parts[0]
  const last = parts.length > 1 ? parts[parts.length - 1] : ""
  const initial = last ? last[0] : ""
  const rand = () => String(Math.floor(Math.random() * 90) + 10)
  const s: string[] = []
  s.push(first)
  if (last) s.push(`${first}.${last}`)
  if (last) s.push(`${first}_${last}`)
  if (initial) s.push(`${first}${initial}`)
  if (last) s.push(`${first}${last}`)
  s.push(`${first}${rand()}`)
  if (last) s.push(`${first}.${last}${rand()}`)
  return [...new Set(s)]
}
