export type Key = "TW_CLIENT_ID" | "TW_CLIENT_SECRET" | "TW_TARGET_IDS" | "CLOUD_VISION_API_KEY"

/**
 * apps script の script property に値をセットするために使うメソッド
 * e.g. clasp run 'setProperties' -p '[{"foo": "bar"}]'
 * cf. https://github.com/google/clasp/issues/569
 * */
export const setProperties = (properties: Record<Key, string>) => {
  PropertiesService.getScriptProperties().setProperties(properties, false)
}

export const getProperties = (): Record<Key, string> => {
  return PropertiesService.getScriptProperties().getProperties() as Record<
    Key,
    string
  >
}
