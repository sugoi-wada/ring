import { visionClient } from "./api/VisionClient"
import { getProperties } from "../properties"

export const doOCR = (imageUrls: string[]) => {
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
