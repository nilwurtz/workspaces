# お天気取得フリー API を使用する。

## OpenWeatherMap

https://openweathermap.org/

無料アカウントなら

- 60calls/1min

取得できる

- 都市名、都市 ID、座標、郵便番号
- 現在の天気を取得可能
- 3 時間おき 5 日分の天気が取得可能
- お天気アイコンが使用可能
- 紫外線指数が取得可能
- お天気アラートサービスが使用可能(触ってません)
- 一応日本語化可能、ケルビン摂氏華氏切り替え可能

## 現在の天気

```python
# 都市名で
"http://api.openweathermap.org/data/2.5/weather?q={city name}"
```
