import { isPresent } from "ts-is-present"
import { OCRFirstText } from "./lib/api/VisionClient.types"
import { FitnessStat } from "./types"

export type ParseResult = ParseSuccess | ParseError

export type ParseSuccess = {
  ok: true
  fitnessStat: FitnessStat
}

export type ParseError = {
  ok: false
  error: {
    message: string
  }
}

export const parseText = (text: OCRFirstText): ParseResult => {
  const groups = text.description.match(regex)?.groups ?? {}

  for (const k of requireKeys) {
    if (!(k in groups)) {
      console.log(
        `Parse failure. The '${k}' not found in ${JSON.stringify(groups)}.`
      )
      return {
        ok: false,
        error: {
          message: `Parse failure. The '${k}' not found.`,
        },
      }
    }
  }

  console.log(`parse regex result: ${JSON.stringify(groups)}`)
  return {
    ok: true,
    fitnessStat: {
      title: groups["title"],
      name: groups["name"],
      totalFitnessDuration: formatDuration(groups["min"], groups["sec"]),
      totalBurnedCalories: Number(groups["kcal"]),
      // 走らずに終了した場合にパースできない
      totalRunnningDistance: isNaN(Number(groups["km"]))
        ? 0
        : Number(groups["km"]),
    },
  }
}

/** min と sec を hh:mm:ss に変換する */
const formatDuration = (min: string, sec: string) =>
  "00:" +
  [min, sec]
    .map((d) => (isNaN(Number(d)) || d === "" ? undefined : d.padStart(2, "0")))
    .filter(isPresent)
    .join(":")

const regex =
  /[^\n]+\n[^\n]+\n(?:(?<title>[^\n]+)\n)?(?<name>[^\n]+)\n(?<min>\d{0,3})[^\d](?<sec>\d{1,2})[^\d]\n[^\n]+\n(?<kcal>[\d]{1,4}\.?[\d]{0,2})kcal\n[^\n]+\n(?<km>[\d]{1,4}\.?[\d]{0,2})?/u

/** 正規表現内で最低限見つけ出さなければならない要素のキー */
const requireKeys = ["name", "min", "sec", "kcal"]
