import { hello, ringFitAdventure } from "./main"
import { clearPreferences, getProperties, setProperties } from "./properties"

declare const global: {
  [x: string]: unknown
}

global.hello = hello
global.setProperties = setProperties
global.getProperties = getProperties
global.clearPreferences = clearPreferences
global.ringFitAdventure = () => ringFitAdventure("prod")
global.ringFitAdventure_dev = () => ringFitAdventure("dev")
