import { visionClient } from "./api/VisionClient"
import { getProperties } from "../properties"
import { OCRRequest, OCRResult } from "./api/VisionClient.types"

export const doOCR = (
  imageUrls: OCRRequest["imageUrls"]
): OCRResult | undefined => {
  if (imageUrls.length === 0) {
    console.warn("[ocr.ts]: The argument has zero imageUrls.")
    return
  }
  const apiKey = getProperties().CLOUD_VISION_API_KEY
  const result = visionClient.getTextByOCR({
    apiKey,
    imageUrls,
  })
  if ("error" in result) {
    return
  }
  return result
}
