import { FitnessStat, FitnessStatWithDate } from "./types"

/** Sheet の行に日付と運動の結果レコードを追加 */
export const doRecording = (sheetId: string, stats: FitnessStatWithDate[]) => {
  if (stats.length < 1) return
  const spreadSheet = SpreadsheetApp.openById(sheetId)
  const sheet = spreadSheet.getActiveSheet()
  const values = stats.map((s) => [
    s.date,
    s.title ?? "",
    s.name,
    formatDuration(s.totalFitnessDuration),
    s.totalBurnedCalories,
    s.totalRunnningDistance,
  ])
  sheet
    .getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length)
    .setValues(values)
}

/** hours と min と sec を hh:mm:ss に変換する */
const formatDuration = (d: FitnessStat["totalFitnessDuration"]) =>
  [d.hours, d.minutes, d.seconds]
    .map((d) => d.toString().padStart(2, "0"))
    .join(":")
