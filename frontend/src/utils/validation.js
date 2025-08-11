// Basic URL validation (same as backend regex)
export function isValidUrl(url) {
  return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(url);
}

export function isPositiveInteger(n) {
  return String(Number(n)) === String(n) && Number(n) > 0 && Number.isInteger(Number(n));
}

export function isValidShortcode(code) {
  // Alphanumeric, 4-10 chars
  return code === "" || /^[a-zA-Z0-9]{4,10}$/.test(code);
}
