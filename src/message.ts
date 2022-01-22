import { isPresent } from "ts-is-present"
import { MessageBlock } from "./lib/api/SlackClient.types"
import { FitnessStat } from "./types"

export const createMessage = (stats: FitnessStat[]): MessageBlock[] => {
  return stats.flatMap((s) => [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `💪 ${s.name}さん、お疲れ様！ 🎉`,
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*日時:*\n${s.date}`,
        },
        {
          type: "mrkdwn",
          text: `*合計活動時間:*\n${fotmatDuration(s.totalFitnessDuration)}`,
        },
        {
          type: "mrkdwn",
          text: `*合計消費カロリー:*\n${s.totalBurnedCalories}kcal`,
        },
        {
          type: "mrkdwn",
          text: `*合計走行距離:*\n${s.totalRunnningDistance}km`,
        },
        {
          type: "mrkdwn",
          text: s.source.url,
        },
      ],
    },
    {
      type: "image",
      image_url: s.source.imageUrl,
      alt_text: "今回のリザルト",
    },
  ])
}

const fotmatDuration = (d: FitnessStat["totalFitnessDuration"]) => {
  const h = d.hours > 0 ? `${d.hours}時間` : null
  const m = d.minutes > 0 ? `${d.minutes}分` : null
  const s = d.seconds > 0 ? `${d.seconds}秒` : null
  return [h, m, s].filter(isPresent).join("")
}
