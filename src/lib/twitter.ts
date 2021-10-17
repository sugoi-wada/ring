import { isPresent } from "ts-is-present"
import { twitterClient } from "./api/TwitterClient"

export const getTargetTweets = (twitterIds: string[]) => {
  // TODO support multiple ids
  const userId = twitterIds[0]
  // TODO 前回取得した時点の日時以降のデータのみを取得する
  const result = twitterClient.getTweets({ userId })
  if ("errors" in result) {
    return
  }
  // TODO 余計なツイートはフィルタリングして省く
  const tweets = result.data.map((d) => ({
    ...d,
    attachments: d.attachments.media_keys
      .map((media_key) =>
        result.includes.media.find((m) => m.media_key === media_key)
      )
      .filter(isPresent),
  }))
  return tweets.slice(0, 2)
}
