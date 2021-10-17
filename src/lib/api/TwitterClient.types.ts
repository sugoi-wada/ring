export type ErrorResponse = {
  errors: any
}

export type TwitterTimelineRequest = {
  userId: string
}

export type TwitterTimeline = {
  data: {
    id: string
    text: string
    created_at: string
    attachments: {
      media_keys: string[]
    }
  }[]
  includes: {
    media: {
      media_key: string
      type: "photo" | string
      url: string
    }[]
  }
  meta: {
    oldest_id: string
    newest_id: string
    result_count: number
    next_token: string
  }
}

export type TwitterTimelineResponse = TwitterTimeline | ErrorResponse
