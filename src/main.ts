import dayjs from "dayjs"
import { isPresent } from "ts-is-present"
import { slackPost } from "./lib/slack"
import { getTweetsWithMediaUrl } from "./lib/twitter"
import { createMessage } from "./message"
import { getProperties, setProperties } from "./properties"
import { doRecording } from "./recorder"
import { parseTweetImages } from "./tweetImageParser"

export const hello = () => {
  console.log(`Hello World！`)
}

const properties = getProperties()

export const ringFitAdventure = () => {
  const isProduction = properties.ENV === "production"
  const now = dayjs()
  // Timeline からリングフィットのツイート一覧を取得
  const tweets = getTweetsWithMediaUrl(properties.TW_TARGET_IDS.split(","), {
    start_time: properties.LAST_RUN_AT,
    end_time: now.toISOString(),
  })?.sort((a, b) => {
    if (a.created_at < b.created_at) return -1
    if (a.created_at > b.created_at) return 1
    return 0
  })
  if (isProduction) setProperties({ LAST_RUN_AT: now.toISOString() })
  if (!tweets) return
  const parseResults = parseTweetImages(
    tweets.map((t) => ({ id: t.id, image: { ...t.attachments[0] } }))
  )
  if (!parseResults) return
  const stats = parseResults
    .map((parseResult) => {
      const tweet = tweets.find((t) => t.id === parseResult.sourceTweet.id)
      if (!tweet) return
      return {
        date: dayjs(tweet.created_at).format("YYYY/MM/DD HH:mm:ss"),
        tweet,
        ...parseResult.fitnessStat,
      }
    })
    .filter(isPresent)

  if (isProduction) {
    doRecording(properties.SHEET_ID, stats)
    slackPost(createMessage(stats))
  } else {
    console.log(`Here's FitnessStats. ${JSON.stringify(stats)}`)
  }
}
