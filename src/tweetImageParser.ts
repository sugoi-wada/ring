import { isPresent } from "ts-is-present"
import { OCRFirstText } from "./lib/api/VisionClient.types"
import { doOCR } from "./lib/ocr"
import { TweetWithMediaUrl } from "./lib/twitter"
import { parseText } from "./parser"

/** ツイート内の画像をOCRして名前・活動時間・消費カロリー・走行距離を取得 */
export const parseTweetImages = (
  tweets: {
    id: TweetWithMediaUrl["id"]
    image: Pick<TweetWithMediaUrl["attachments"][number], "type" | "url">
  }[]
) => {
  const ocrResult = doOCR(tweets.map((t) => t.image.url))
  if (!ocrResult) return
  const texts = ocrResult.responses
    .map((res, i) => {
      const ocrText = res.textAnnotations[0] as OCRFirstText
      const parseResult = parseText(ocrText)
      if (!parseResult.ok) {
        console.error(`Parse failed. ${ocrText.locale} ${ocrText.description}`)
        return
      }

      return {
        sourceTweet: tweets[i],
        fitnessStat: parseResult.fitnessStat,
      }
    })
    .filter(isPresent)
  return texts
}
