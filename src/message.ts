import { isPresent } from "ts-is-present"
import { MessageBlock } from "./lib/api/SlackClient.types"
import { FitnessStat } from "./types"

export const createMessage = (stats: FitnessStat[]): MessageBlock[] => {
  return stats.flatMap((s) => [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `๐ช ${s.name}ใใใใ็ฒใๆง๏ผ ๐`,
        emoji: true,
      },
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*ๆฅๆ:*\n${s.date}`,
        },
        {
          type: "mrkdwn",
          text: `*ๅ่จๆดปๅๆ้:*\n${fotmatDuration(s.totalFitnessDuration)}`,
        },
        {
          type: "mrkdwn",
          text: `*ๅ่จๆถ่ฒปใซใญใชใผ:*\n${s.totalBurnedCalories}kcal`,
        },
        {
          type: "mrkdwn",
          text: `*ๅ่จ่ตฐ่ก่ท้ข:*\n${s.totalRunnningDistance}km`,
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
      alt_text: "ไปๅใฎใชใถใซใ",
    },
  ])
}

const fotmatDuration = (d: FitnessStat["totalFitnessDuration"]) => {
  const h = d.hours > 0 ? `${d.hours}ๆ้` : null
  const m = d.minutes > 0 ? `${d.minutes}ๅ` : null
  const s = d.seconds > 0 ? `${d.seconds}็ง` : null
  return [h, m, s].filter(isPresent).join("")
}
