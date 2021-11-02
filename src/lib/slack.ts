import { getProperties } from "../properties"
import { slackClient } from "./api/SlackClient"
import { MessageBlock } from "./api/SlackClient.types"

export const slackPost = (message: string | MessageBlock[]): boolean => {
  const webhookUrl = getProperties().SLACK_WEBHOOK_URL
  const result = slackClient.postMessages({
    webhookUrl,
    ...(typeof message === "string" ? { text: message } : { blocks: message }),
  })
  return result === "ok"
}
