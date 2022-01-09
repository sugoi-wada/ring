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
        totalFitnessDuration: {
          hours: 0,
          minutes: 10,
          seconds: 50,
        },
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
        totalFitnessDuration: {
          hours: 0,
          minutes: 18,
          seconds: 18,
        },
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
        totalFitnessDuration: {
          hours: 0,
          minutes: 18,
          seconds: 18,
        },
        totalBurnedCalories: 44.45,
        totalRunnningDistance: 0,
      },
    },
    {
      desc: "活動時間のOCRミス",
      target: {
        locale: "ja",
        description:
          "R 画面を撮影する\n本日の運動結果\nなまえ\n12 4»\n合計活動時間\n44.45kcal\n合計消費力ロリー\n合計走行距離\n次へ\n",
      },
      expect: {
        name: "なまえ",
        totalFitnessDuration: {
          hours: 0,
          minutes: 12,
          seconds: 4,
        },
        totalBurnedCalories: 44.45,
        totalRunnningDistance: 0,
      },
    },
    {
      desc: "活動時間のOCRミス その2",
      target: {
        locale: "ja",
        description:
          "R 画面を撮影する\n本日の運動結果\nなまえ\n25 10\n合計活動時間\n121.39kcal\n合計消費力ロリー\n2. 01 km\n合計走行距離\n次へ\n",
      },
      expect: {
        name: "なまえ",
        totalFitnessDuration: {
          hours: 0,
          minutes: 25,
          seconds: 10,
        },
        totalBurnedCalories: 121.39,
        totalRunnningDistance: 2.01,
      },
    },
    {
      desc: "活動時間のOCRミス その3 数値5がsになり、0がOになってしまい、さらにカロリーが分割されたパターン",
      target: {
        locale: "ja",
        description:
          "本日の運動結果\nR 画面を撮影する\nなまえ\n11分12秒\n合計活動時間\n43.s\n合計消費力ロリー\n57kcal\nО.37km\n合計走行距離\n次へ\n",
      },
      expect: {
        name: "なまえ",
        totalFitnessDuration: {
          hours: 0,
          minutes: 11,
          seconds: 12,
        },
        totalBurnedCalories: 43.57,
        totalRunnningDistance: 0.37,
      },
    },
  ]

testData.forEach((t) => {
  test(t.desc, () => {
    expect(parseText(t.target)).toEqual({ ok: true, fitnessStat: t.expect })
  })
})
