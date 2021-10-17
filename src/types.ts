export type FitnessStat = {
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

export type FitnessStatWithDate = FitnessStat & {
  date: string
}
