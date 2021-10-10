import { hello } from "./main"

declare const global: {
  [x: string]: unknown
}

global.hello = hello
