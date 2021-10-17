import { getProperties } from "../../properties"

/**
 * Reset the authorization state, so that it can be re-tested.
 */
export const reset = () => {
  getService().reset()
}

/**
 * Configures the service.
 */
export const getService = () => {
  const props = getProperties()

  return OAuth2.createService("Twitter App Only")
    .setTokenUrl("https://api.twitter.com/oauth2/token")
    .setClientId(props.TW_CLIENT_ID)
    .setClientSecret(props.TW_CLIENT_SECRET)
    .setGrantType("client_credentials")
    .setPropertyStore(PropertiesService.getUserProperties())
}
