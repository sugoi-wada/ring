import { isPresent } from "ts-is-present"
import { twitterClient } from "./api/TwitterClient"
import {
  TwitterEmptyTimeline,
  TwitterTimeline,
  TwitterTimelineRequest,
} from "./api/TwitterClient.types"

export type TweetWithMediaUrl = Omit<
  TwitterTimeline["data"][number],
  "attachments"
> & {
  attachments: {
    media_key: string
    type: string
    url: string
  }[]
}

export const getTweetsWithMediaUrl = (
  twitterIds: string[],
  options: Partial<TwitterTimelineRequest["payload"]> = {}
): TweetWithMediaUrl[] | undefined => {
  if (twitterIds.length === 0) {
    console.warn("[twitter.ts]: The argument has zero twitterIds.")
    return
  }

  // TODO support multiple ids
  const userId = twitterIds[0]
  const result = twitterClient.getTweets({ userId, payload: options })
  if ("errors" in result || !hasAnyTweets(result)) {
    return
  }

  console.log(`[twitter.ts]: New tweet found. ${JSON.stringify(result)}`)
  // TODO 余計なツイートはフィルタリングして省く
  const tweets: TweetWithMediaUrl[] = result.data.map((d) => ({
    ...d,
    attachments: d.attachments.media_keys
      .map((media_key) =>
        result.includes.media.find((m) => m.media_key === media_key)
      )
      .filter(isPresent),
  }))
  return tweets
}

function hasAnyTweets(
  timeline: TwitterTimeline | TwitterEmptyTimeline
): timeline is TwitterTimeline {
  return timeline.meta.result_count > 0
}
