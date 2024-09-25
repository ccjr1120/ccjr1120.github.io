export function separatedCase(name: string, separator: string = '-') {
  return name.replace(/([a-z])([A-Z])/g, `$1${separator}$2`).toLowerCase()
}

export function firstUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
