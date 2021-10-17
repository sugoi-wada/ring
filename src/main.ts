import { isPresent } from "ts-is-present"
import { twitterClient } from "./lib/api/TwitterClient"
import { visionClient } from "./lib/api/VisionClient"
import { OCRFirstText } from "./lib/api/VisionClient.types"
import { getProperties } from "./properties"

export const hello = () => {
  console.log(`Hello World！`)
}

const properties = getProperties()

export const ringFitAdventure = () => {
  // Timeline からリングフィットのツイート一覧を取得
  const tweets = getTargetTweets()
  if (!tweets) return
  // ツイート内の画像をOCRして名前・活動時間・消費カロリー・走行距離を取得
  const ocrResult = doOCR(tweets.map((t) => t.attachments[0].url))
  if (!ocrResult) return
  // Sheet の行に日付とOCRの結果レコードを追加
  const texts = ocrResult.responses.map(
    (res) => res.textAnnotations[0] as OCRFirstText
  )
}

const getTargetTweets = () => {
  // TODO support multiple ids
  const userId = properties.TW_TARGET_IDS.split(",")[0]
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

const doOCR = (imageUrls: string[]) => {
  const apiKey = properties.CLOUD_VISION_API_KEY
  const result = visionClient.getTextByOCR({
    apiKey,
    imageUrls,
  })
  if ("error" in result) {
    return
  }
  return result
}
