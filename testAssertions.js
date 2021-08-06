export function assertTrue(value, message) {
  if (!value) {
    throw message
  }
}
