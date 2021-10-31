export type IncomingWebhookRequest = {
  webhookUrl: string
}

export type PostMessagesRequest = IncomingWebhookRequest & {
  text: string
}
