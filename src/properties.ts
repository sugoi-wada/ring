export type EnvKey =
  | "TW_CLIENT_ID"
  | "TW_CLIENT_SECRET"
  | "TW_TARGET_IDS"
  | "CLOUD_VISION_API_KEY"
  | "SHEET_ID"

export type PreferenceKey = "LAST_RUN_AT"

export type Key = EnvKey | PreferenceKey

/**
 * apps script の script property に値をセットするために使うメソッド
 * e.g. clasp run 'setProperties' -p '[{"foo": "bar"}]'
 * cf. https://github.com/google/clasp/issues/569
 * */
export const setProperties = (properties: Partial<Properties>) => {
  PropertiesService.getScriptProperties().setProperties(properties, false)
}

export type Properties = Record<EnvKey, string> &
  Record<PreferenceKey, string | undefined>

export const getProperties = (): Properties => {
  return PropertiesService.getScriptProperties().getProperties() as Properties
}
