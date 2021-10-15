import { hello, twtest } from "./main"
import { setProperties } from "./properties"

declare const global: {
  [x: string]: unknown
}

global.hello = hello
global.setProperties = setProperties
global.twtest = twtest
