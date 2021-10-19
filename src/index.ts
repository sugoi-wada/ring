import { hello, ringFitAdventure } from "./main"
import { clearPreferences, setProperties } from "./properties"

declare const global: {
  [x: string]: unknown
}

global.hello = hello
global.setProperties = setProperties
global.clearPreferences = clearPreferences
global.ringFitAdventure = ringFitAdventure
