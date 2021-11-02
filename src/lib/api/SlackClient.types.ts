export type IncomingWebhookRequest = {
  webhookUrl: string
}

export type PostMessagesRequest = IncomingWebhookRequest &
  (
    | {
        text: string
      }
    | {
        blocks: MessageBlock[]
      }
  )

export type MessageBlock = SectionField | HeaderField

export type SectionField =
  | {
      type: "section"
      text: TextField
    }
  | {
      type: "section"
      fields: TextField[]
    }

export type TextField = {
  type: "mrkdwn" | "plain_text"
  text: string
  emoji?: boolean
}

export type HeaderField = {
  type: "header"
  text: TextField
}
