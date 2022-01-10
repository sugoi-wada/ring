import { OCRFirstText } from "./lib/api/VisionClient.types"
import { FitnessStat } from "./types"

export type ParseResult = ParseSuccess | ParseError

export type ParseSuccess = {
  ok: true
  fitnessStat: Omit<FitnessStat, "date">
}

export type ParseError = {
  ok: false
  error: {
    message: string
  }
}

export const parseText = (text: OCRFirstText): ParseResult => {
  const textLines = text.description.split("\n")
  textLines.splice(0, 2) // 最初の2配列は決まりの不要な文字列が入っているので Drop する

  // 合計活動時間を抽出
  const totalFitnessDurationIndex =
    textLines.findIndex((textLine) => textLine.includes("合計活動時間")) - 1
  const totalFitnessDuration = textLines[totalFitnessDurationIndex].match(
    /(?<min>\d{0,3})[^\d]+(?<sec>\d{1,2})[^\d]*/u
  )?.groups

  // 肩書き（あれば）と名前を抽出
  const titleIndex = totalFitnessDurationIndex - 2
  const title = titleIndex >= 0 ? textLines[titleIndex] : undefined
  const name = textLines[totalFitnessDurationIndex - 1]

  // 合計消費カロリーと合計走行距離を抽出するための準備
  const nextTextLines = textLines
    .slice(totalFitnessDurationIndex + 2)
    .filter((textLine) => textLine.match(/(合計)|(次へ)/g) == null)
    .filter((textLine) => textLine != "")

  // 合計消費カロリーを抽出
  const kcalUnitIndex = nextTextLines.findIndex((l) => l.includes("kcal"))
  const totalBurnedCalories = nextTextLines
    .slice(0, kcalUnitIndex + 1)
    .join("")
    .match(/(?<int_part>\d{0,3})[^\d]+(?<decimal_part>\d{1,2})[^\d]*/u)?.groups

  // 合計走行距離を抽出（走っていないときは存在しない）
  const kmUnitIndex = nextTextLines.findIndex((l) => l.includes("km"))
  const totalRunnningDistance =
    kmUnitIndex >= 0
      ? nextTextLines
          .slice(kcalUnitIndex + 1, kmUnitIndex + 1)
          .join("")
          .match(/(?<int_part>\d{0,3})[^\d]+(?<decimal_part>\d{1,2})[^\d]*/u)
          ?.groups
      : undefined

  console.log(
    `parse result: ${JSON.stringify({
      title,
      name,
      totalFitnessDuration,
      totalBurnedCalories,
      totalRunnningDistance,
    })}`
  )

  return {
    ok: true,
    fitnessStat: {
      title,
      name,
      totalFitnessDuration: {
        // TODO: Currently hours not supported
        hours: toNumberOrZero("0"),
        minutes: toNumberOrZero(totalFitnessDuration?.min),
        seconds: toNumberOrZero(totalFitnessDuration?.sec),
      },
      totalBurnedCalories: toNumberOrZero(
        `${totalBurnedCalories?.int_part}.${totalBurnedCalories?.decimal_part}`
      ),
      totalRunnningDistance: toNumberOrZero(
        `${totalRunnningDistance?.int_part}.${totalRunnningDistance?.decimal_part}`
      ),
    },
  }
}

const toNumberOrZero = (ele: string | undefined) =>
  isNaN(Number(ele)) ? 0 : Number(ele)
