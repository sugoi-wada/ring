import { PostMessagesRequest } from "./SlackClient.types"

class SlackClient {
  private _api: Api

  constructor(api: Api) {
    this._api = api
  }

  postMessages(req: PostMessagesRequest) {
    const { webhookUrl, ...payload } = req
    return this._api.do(webhookUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
    })
  }
}

class Api {
  private static _api: Api
  private static _slackClient: SlackClient

  private get api(): Api {
    if (!Api._api) {
      Api._api = new Api()
    }

    return Api._api
  }

  get slackClient(): SlackClient {
    if (!Api._slackClient) {
      Api._slackClient = new SlackClient(this.api)
    }

    return Api._slackClient
  }

  do(
    url: string,
    options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {}
  ): string {
    const response = UrlFetchApp.fetch(url, options)
    const responseCode = response.getResponseCode()
    const result = response.getContentText()
    console.log(`Response: ${responseCode}`, JSON.stringify(result))
    return result
  }
}

export const slackClient = new Api().slackClient
