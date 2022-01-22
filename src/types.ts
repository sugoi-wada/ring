export type FitnessStat = {
  /** 実施日時 */
  date: string
  /** データ元 */
  source: { url: string; imageUrl: string }
} & FitnessContent

export type FitnessContent = {
  /** 肩書き */
  title?: string
  /** 名前 */
  name: string
  /** 合計活動時間 */
  totalFitnessDuration: {
    hours: number
    minutes: number
    seconds: number
  }
  /** 合計消費カロリー（kcal） */
  totalBurnedCalories: number
  /** 合計走行距離（km） */
  totalRunnningDistance: number
}
