import { OCRFirstText } from "./lib/api/VisionClient.types"
import { doOCR } from "./lib/ocr"
import { parseText } from "./parser"
import { getProperties } from "./properties"
import { doRecording } from "./recorder"
import { getTargetTweets } from "./lib/twitter"

export const hello = () => {
  console.log(`Hello World！`)
}

const properties = getProperties()

export const ringFitAdventure = () => {
  // Timeline からリングフィットのツイート一覧を取得
  const tweets = getTargetTweets(properties.TW_TARGET_IDS.split(","))
  if (!tweets) return
  // ツイート内の画像をOCRして名前・活動時間・消費カロリー・走行距離を取得
  const ocrResult = doOCR(tweets.map((t) => t.attachments[0].url))
  if (!ocrResult) return
  // Sheet の行に日付とOCRの結果レコードを追加
  const texts = ocrResult.responses.map(
    (res) => res.textAnnotations[0] as OCRFirstText
  )
  doRecording(
    properties.SHEET_ID,
    texts.map(parseText).map((s) => ({
      // TODO: use twitter posted date
      date: Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd"),
      ...s,
    }))
  )
}
