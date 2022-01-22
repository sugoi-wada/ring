import { getService } from "../auth/TwitterService"
import { makeQueryString } from "./helper"
import {
  ErrorResponse,
  TwitterTimeline,
  TwitterTimelineRequest,
  TwitterTimelineResponse,
} from "./TwitterClient.types"

const BASE_URL = "https://api.twitter.com"

class TwitterClient {
  private _api: Api

  constructor(api: Api) {
    this._api = api
  }

  /** Get user's timeline.
   * cf. https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets
   */
  getTweets(req: TwitterTimelineRequest): TwitterTimelineResponse {
    const query = makeQueryString({
      expansions: "attachments.media_keys",
      "media.fields": "url",
      "tweet.fields": "created_at",
      ...req.payload,
    })

    return this._api.do<TwitterTimeline>(
      `/2/users/${req.userId}/tweets?${query}`
    )
  }
}

class Api {
  private static _api: Api
  private static _twitterClient: TwitterClient

  private get api(): Api {
    if (!Api._api) {
      Api._api = new Api()
    }

    return Api._api
  }

  get twitterInstance(): TwitterClient {
    if (!Api._twitterClient) {
      Api._twitterClient = new TwitterClient(this.api)
    }

    return Api._twitterClient
  }

  do<T>(
    path: string,
    options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {}
  ): T | ErrorResponse {
    const service = getService()
    if (service.hasAccess()) {
      const url = `${BASE_URL}${path}`
      const response = UrlFetchApp.fetch(url, {
        headers: {
          Authorization: "Bearer " + service.getAccessToken(),
        },
        ...options,
      })
      const responseCode = response.getResponseCode()
      const result = JSON.parse(response.getContentText())
      if (responseCode !== 200) {
        return {
          errors: {
            message: `Twitter Request failed. Response: ${responseCode} ${JSON.stringify(
              result
            )}`,
          },
        }
      }
      return result
    } else {
      const error = service.getLastError()
      console.error(error)
      return {
        errors: {
          message: "Twitter OAuth failed. Please check logs for more details.",
          ...error,
        },
      }
    }
  }
}

export const twitterClient = new Api().twitterInstance
