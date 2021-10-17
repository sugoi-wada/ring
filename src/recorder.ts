import { FitnessStatWithDate } from "./types"

export const doRecording = (sheetId: string, stats: FitnessStatWithDate[]) => {
  if (stats.length < 1) return
  const spreadSheet = SpreadsheetApp.openById(sheetId)
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
