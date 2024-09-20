export function separatedCase(name: string, separator: string = '-') {
  return name.replace(/([a-z])([A-Z])/g, `$1${separator}$2`).toLowerCase()
}
