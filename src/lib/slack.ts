import { getProperties } from "../properties"
import { slackClient } from "./api/SlackClient"
import { PostMessagesRequest } from "./api/SlackClient.types"

export const slackPost = (text: PostMessagesRequest["text"]): boolean => {
  const webhookUrl = getProperties().SLACK_WEBHOOK_URL
  const result = slackClient.postMessages({
    webhookUrl,
    text,
  })
  return result === "ok"
}
