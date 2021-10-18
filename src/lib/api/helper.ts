import { isPresent } from "ts-is-present"

export const makeQueryString = <T>(obj: T, encode: boolean = true): string => {
  return (
    Object.entries(obj)
      // eslint-disable-next-line no-unused-vars
      .filter(([_, v]) => isPresent(v))
      .map(([key, value]) => {
        if (encode) {
          return `${key}=${encodeURIComponent(value)}`
        } else {
          return `${key}=${value}`
        }
      })
      .join("&")
  )
}
