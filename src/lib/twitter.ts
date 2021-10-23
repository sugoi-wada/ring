import { isPresent } from "ts-is-present"
import { twitterClient } from "./api/TwitterClient"
import { TwitterTimelineRequest } from "./api/TwitterClient.types"

export const getTweetsWithMediaUrl = (
  twitterIds: string[],
  options: Partial<TwitterTimelineRequest["payload"]> = {}
) => {
  if (twitterIds.length === 0) {
    console.warn("[twitter.ts]: The argument has zero twitterIds.")
    return
  }

  // TODO support multiple ids
  const userId = twitterIds[0]
  const result = twitterClient.getTweets({ userId, payload: options })
  if ("errors" in result) {
    return
  }
  // TODO 余計なツイートはフィルタリングして省く
  const tweets = result.data?.map((d) => ({
    ...d,
    attachments: d.attachments.media_keys
      .map((media_key) =>
        result.includes.media.find((m) => m.media_key === media_key)
      )
      .filter(isPresent),
  }))
  return tweets
}
