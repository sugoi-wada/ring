import { FitnessStat } from "./types"
import { parseText } from "./parser"
import { OCRFirstText } from "./lib/api/VisionClient.types"

const testData: { desc: string; target: OCRFirstText; expect: FitnessStat }[] =
  [
    {
      desc: "肩書きなし",
      target: {
        locale: "ja",
        description:
          "R 画面を撮影する\n本日の運動結果\nなまえ\n10分50秒\n合計活動時間\n30.30kcal\n合計消費力ロリー\n0.12km\n合計走行距離\n次へ\n",
      },
      expect: {
        name: "なまえ",
        totalFitnessDuraion: "00:10:50",
        totalBurnedCalories: 30.3,
        totalRunnningDistance: 0.12,
      },
    },
    {
      desc: "肩書きあり",
      target: {
        locale: "ja",
        description:
          "R 画面を撮影する\n本日の運動結果\nかたがき\nなまえ\n18分18秒\n合計活動時間\n55.55kcal\n合計消費力ロリー\n0.40km\n合計走行距離\n次へ\n",
      },
      expect: {
        title: "かたがき",
        name: "なまえ",
        totalFitnessDuraion: "00:18:18",
        totalBurnedCalories: 55.55,
        totalRunnningDistance: 0.4,
      },
    },
    {
      desc: "合計走行距離なし",
      target: {
        locale: "ja",
        description:
          "R 画面を撮影する\n本日の運動結果\nなまえ\n18分18秒\n合計活動時間\n44.45kcal\n合計消費力ロリー\n合計走行距離\n次へ\n",
      },
      expect: {
        name: "なまえ",
        totalFitnessDuraion: "00:18:18",
        totalBurnedCalories: 44.45,
        totalRunnningDistance: 0,
      },
    },
  ]

testData.forEach((t) => {
  test(t.desc, () => {
    expect(parseText(t.target)).toEqual(t.expect)
  })
})
