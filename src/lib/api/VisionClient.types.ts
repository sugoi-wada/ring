export type ErrorResponse = {
  error: any
}

export type AuthRequest = {
  apiKey: string
}

export type OCRRequest = AuthRequest & {
  imageUrls: string[]
}

export type OCRText = {
  description: string
}

export type OCRFirstText = OCRText & {
  locale: "ja" | string
}

export type OCRResult = {
  responses: {
    textAnnotations: (OCRFirstText | OCRText)[]
  }[]
}

export type OCRResponse = OCRResult | ErrorResponse
