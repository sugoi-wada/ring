import { OCRFirstText } from "./lib/api/VisionClient.types"
import { doOCR } from "./lib/ocr"
import { ParseSuccess, parseText } from "./parser"
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
  })?.sort((a, b) => {
    if (a.created_at < b.created_at) return -1
    if (a.created_at > b.created_at) return 1
    return 0
  })
  if (!tweets) return
  // ツイート内の画像をOCRして名前・活動時間・消費カロリー・走行距離を取得
  const ocrResult = doOCR(tweets.map((t) => t.attachments[0].url))
  if (!ocrResult) return
  const texts = ocrResult.responses.map(
    (res) => res.textAnnotations[0] as OCRFirstText
  )
  // For DEBUG
  texts.map((t) => console.log("OCR description: ", t.description))
  // Sheet の行に日付とOCRの結果レコードを追加
  doRecording(
    properties.SHEET_ID,
    texts
      .map(parseText)
      .filter((r) => r.ok)
      .map((s, i) => ({
        date: dayjs(tweets[i].created_at).format("YYYY/MM/DD"),
        ...(s as ParseSuccess).fitnessStat,
      }))
  )
  setProperties({ LAST_RUN_AT: now.toISOString() })
}
