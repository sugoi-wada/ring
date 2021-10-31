import dayjs from "dayjs"
import { isPresent } from "ts-is-present"
import { OCRFirstText } from "./lib/api/VisionClient.types"
import { doOCR } from "./lib/ocr"
import { slackPost } from "./lib/slack"
import { getTweetsWithMediaUrl, TweetWithMediaUrl } from "./lib/twitter"
import { createMessage } from "./message"
import { parseText } from "./parser"
import { getProperties, setProperties } from "./properties"
import { doRecording } from "./recorder"
import { FitnessStat } from "./types"

export const hello = () => {
  console.log(`Hello World！`)
}

const properties = getProperties()

export const ringFitAdventure = (mode: "dev" | "prod") => {
  const now = dayjs()
  // Timeline からリングフィットのツイート一覧を取得
  const tweets = getTweetsWithMediaUrl(properties.TW_TARGET_IDS.split(","), {
    start_time: mode === "dev" ? undefined : properties.LAST_RUN_AT,
    end_time: now.toISOString(),
  })?.sort((a, b) => {
    if (a.created_at < b.created_at) return -1
    if (a.created_at > b.created_at) return 1
    return 0
  })
  if (mode !== "dev") setProperties({ LAST_RUN_AT: now.toISOString() })
  if (!tweets) return
  const results = parseTweetImages(
    tweets.map((t) => ({ id: t.id, ...t.attachments[0] }))
  )
  if (!results) return
  const stats = results
    .map((result) => {
      const tweet = tweets.find((t) => t.id === result.tweetId)
      if (!tweet) return
      return {
        date: dayjs(tweet.created_at).format("YYYY/MM/DD"),
        ...result.fitnessStat,
      }
    })
    .filter(isPresent)
  doRecording(properties.SHEET_ID, stats)
  slackPost(createMessage(stats))
}

/** ツイート内の画像をOCRして名前・活動時間・消費カロリー・走行距離を取得 */
const parseTweetImages = (
  tweetImages: (Pick<TweetWithMediaUrl, "id"> &
    Pick<TweetWithMediaUrl["attachments"][number], "type" | "url">)[]
):
  | { tweetId: TweetWithMediaUrl["id"]; fitnessStat: FitnessStat }[]
  | undefined => {
  const ocrResult = doOCR(tweetImages.map((t) => t.url))
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
        tweetId: tweetImages[i].id,
        fitnessStat: parseResult.fitnessStat,
      }
    })
    .filter(isPresent)
  return texts
}
