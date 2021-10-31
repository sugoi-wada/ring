import { isPresent } from "ts-is-present"
import { FitnessStat, FitnessStatWithDate } from "./types"

export const createMessage = (stats: FitnessStatWithDate[]): string => {
  return stats
    .map(
      (s) => `${s.name}さん、お疲れ様！
  - 合計消費カロリー: ${s.totalBurnedCalories}kcal
  - 合計活動時間: ${fotmatDuration(s.totalFitnessDuration)}
  - 合計走行距離: ${s.totalRunnningDistance}km`
    )
    .join("\n\n")
}

const fotmatDuration = (d: FitnessStat["totalFitnessDuration"]) => {
  const h = d.hours > 0 ? `${d.hours}時間` : null
  const m = d.minutes > 0 ? `${d.minutes}分` : null
  const s = d.seconds > 0 ? `${d.seconds}秒` : null
  return [h, m, s].filter(isPresent)
}
