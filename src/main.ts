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
  doRecording(
    texts.map(parseText).map((s) => ({
      // TODO: use twitter posted date
      date: Utilities.formatDate(new Date(), "JST", "yyyy/MM/dd"),
      ...s,
    }))
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

type FitnessStat = {
  /** 肩書き */
  title?: string
  /** 名前 */
  name: string
  /** 合計活動時間（hh:mm:ss） */
  totalFitnessDuraion: string
  /** 合計消費カロリー（kcal） */
  totalBurnedCalories: number
  /** 合計走行距離（km） */
  totalRunnningDistance: number
}

type FitnessStatWithDate = FitnessStat & {
  date: string
}

const doRecording = (stats: FitnessStatWithDate[]) => {
  if (stats.length < 1) return
  const spreadSheet = SpreadsheetApp.openById(properties.SHEET_ID)
  const sheet = spreadSheet.getActiveSheet()
  const values = stats.map((s) => [
    s.date,
    s.title ?? "",
    s.name,
    s.totalFitnessDuraion,
    s.totalBurnedCalories,
    s.totalRunnningDistance,
  ])
  sheet
    .getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length)
    .setValues(values)
}

const parseText = (text: OCRFirstText): FitnessStat => {
  const texts = text.description.split("\n")

  if (texts.length === 12) {
    return {
      title: texts[2],
      name: texts[3],
      totalFitnessDuraion: formatDuration(texts[4]),
      totalBurnedCalories: formatCalorie(texts[6]),
      totalRunnningDistance: formatDistance(texts[8]),
    }
  } else {
    return {
      name: texts[2],
      totalFitnessDuraion: formatDuration(texts[3]),
      totalBurnedCalories: formatCalorie(texts[5]),
      totalRunnningDistance: formatDistance(texts[7]),
    }
  }
}

const formatCalorie = (calorie: string) => Number(calorie.replace("kcal", ""))
const formatDistance = (distance: string) => Number(distance.replace("km", ""))

/** mm分ss秒をhh:mm:ssに変換する */
const formatDuration = (duration: string) =>
  "00:" +
  duration
    .split(/(分|秒)/)
    .map((d) => (isNaN(Number(d)) || d === "" ? undefined : d.padStart(2, "0")))
    .filter(isPresent)
    .join(":")
