export function date (value) {
  if (!value) return null
  return value.toLocaleString()
}

export function parseIso8601 (value) {
  if (!value) return null
  return new Date(value)
}

export function calculateAge (value) {
  if (!value) return null
  return new Date().getYear() - value.getYear() - 1
}
