import { ErrorResponse, OCRRequest, OCRResponse } from "./VisionClient.types"

const BASE_URL = "https://vision.googleapis.com"

class VisionClient {
  private _api: Api

  constructor(api: Api) {
    this._api = api
  }

  getTextByOCR(req: OCRRequest) {
    return this._api.do<OCRResponse>(`/v1/images:annotate?key=${req.apiKey}`, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        requests: req.imageUrls.map((imageUrl) => ({
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
          features: [{ type: "TEXT_DETECTION" }],
        })),
      }),
    })
  }
}

class Api {
  private static _api: Api
  private static _visionClient: VisionClient

  private get api(): Api {
    if (!Api._api) {
      Api._api = new Api()
    }

    return Api._api
  }

  get visionClient(): VisionClient {
    if (!Api._visionClient) {
      Api._visionClient = new VisionClient(this.api)
    }

    return Api._visionClient
  }

  do<T>(
    path: string,
    options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {}
  ): T | ErrorResponse {
    const url = `${BASE_URL}${path}`
    const response = UrlFetchApp.fetch(url, options)
    const responseCode = response.getResponseCode()
    const result = JSON.parse(response.getContentText())
    console.log(`Response: ${responseCode}`, JSON.stringify(result))
    return result
  }
}

export const visionClient = new Api().visionClient
