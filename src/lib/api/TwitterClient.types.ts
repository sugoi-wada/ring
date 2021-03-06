export type ErrorResponse = {
  errors: any
}

export type TwitterTimelineRequest = {
  userId: string
  payload: {
    start_time?: string
    end_time?: string
  }
}

export type TwitterTweetData = {
  id: string
  text: string
  created_at: string
  attachments: {
    media_keys: string[]
  }
  entities: {
    urls: [
      {
        start: number
        end: number
        url: string
        display_url: string
        expanded_url: string
      }
    ]
    hashtags: {
      start: number
      end: number
      tag: string
    }[]
  }
}

export type TwitterTweetIncludes = {
  media: {
    media_key: string
    type: "photo" | string
    url: string
  }[]
}

export type TwitterTimeline = {
  data: TwitterTweetData[]
  includes: TwitterTweetIncludes
  meta: {
    oldest_id?: string
    newest_id?: string
    result_count: number
    next_token?: string
  }
}

export type TwitterEmptyTimeline = {
  meta: {
    result_count: number
  }
}

export type TwitterTimelineResponse =
  | (TwitterEmptyTimeline | TwitterTimeline)
  | ErrorResponse
