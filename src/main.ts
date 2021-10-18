import { OCRFirstText } from "./lib/api/VisionClient.types"
import { doOCR } from "./lib/ocr"
import { parseText } from "./parser"
import { getProperties, setProperties } from "./properties"
import { doRecording } from "./recorder"
import { getTweetsWithMediaUrl } from "./lib/twitter"
import dayjs from "dayjs"

export const hello = () => {
  console.log(`Hello World！`)
}

const properties = getProperties()

export const ringFitAdventure = () => {
  const now = dayjs()
  // Timeline からリングフィットのツイート一覧を取得
  const tweets = getTweetsWithMediaUrl(properties.TW_TARGET_IDS.split(","), {
    start_time: properties.LAST_RUN_AT,
    end_time: now.toISOString(),
  })
  if (!tweets) return
  // ツイート内の画像をOCRして名前・活動時間・消費カロリー・走行距離を取得
  const ocrResult = doOCR(tweets.map((t) => t.attachments[0].url))
  if (!ocrResult) return
  // Sheet の行に日付とOCRの結果レコードを追加
  const texts = ocrResult.responses.map(
    (res) => res.textAnnotations[0] as OCRFirstText
  )
  // For DEBUG
  texts.map((t) => console.log("OCR Compact Text: ", t.description))
  doRecording(
    properties.SHEET_ID,
    texts.map(parseText).map((s, i) => ({
      date: dayjs(tweets[i].created_at).format("YYYY/MM/DD"),
      ...s,
    }))
  )
  setProperties({ LAST_RUN_AT: now.toISOString() })
}
