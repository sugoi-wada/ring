import { twitterClient } from "./lib/api/TwitterClient"
import { getProperties } from "./properties"

export const hello = () => {
  console.log(`Hello World！`)
}

export const ringFitAdventure = () => {
  // Timeline からリングフィットのツイート一覧を取得
  const tweets = getTargetTweets()
  if (!tweets) return
  // ツイート内の画像を一件ずつOCRして名前・活動時間・消費カロリー・走行距離を取得
  // Sheet の行に日付とOCRの結果レコードを追加
}

const getTargetTweets = () => {
  // TODO support multiple ids
  const userId = getProperties().TW_TARGET_IDS.split(",")[0]
  // TODO 前回取得した時点の日時以降のデータのみを取得する
  const result = twitterClient.getTweets({ userId })
  if ("errors" in result) {
    return
  }
  // TODO 余計なツイートはフィルタリングして省く
  const tweets = result.data.map((d) => ({
    ...d,
    attachments: d.attachments.media_keys.map((media_key) =>
      result.includes.media.find((m) => m.media_key === media_key)
    ),
  }))
  return tweets
}
