import { isPresent } from "ts-is-present"
import { OCRFirstText } from "./lib/api/VisionClient.types"
import { FitnessStat } from "./types"

export const parseText = (text: OCRFirstText): FitnessStat => {
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
