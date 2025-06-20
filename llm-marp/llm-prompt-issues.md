---
marp: true
theme: default
paginate: true
size: 16:9
style: |
  @import url("https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@200;400;700&family=Noto+Serif+JP:wght@200;400;700&display=swap");
  @import url('https://fonts.googleapis.com/css2?family=BIZ+UDGothic:wght@400;700&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
  * {
    font-family: "Noto Sans JP", sans-serif;
    color: #333333;
  }
  .center {
    text-align: center;
  }
  .center-block {
    text-align: center;
    margin: 0 auto;
    display: block;
  }

  section {
    font-size: 26px;
    line-height: 1.4;
    background-color: #f6f6ea;
  }
  h1 {
    color: #7F55B1;
    font-size: 44px;
  }
  h2 {
    color: #9B7EBD;
    font-size: 32px;
  }
  h3 {
    color: #F49BAB;
    font-size: 28px;
  }
  .highlight {
    background-color: #FFE1E0;
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0;
    font-size: 24px;
  }
  .problem {
    background-color: #F8E8E9;
    padding: 12px;
    border-left: 4px solid #F49BAB;
    margin: 12px 0;
    font-size: 22px;
  }
  .solution {
    background-color: #F0EBFF;
    padding: 12px;
    border-left: 4px solid #9B7EBD;
    margin: 12px 0;
    font-size: 22px;
  }
  .code-small {
    font-size: 18px;
  }
  pre {
    font-size: 20px;
    font-family: "JetBrains Mono", monospace;
  }
  code * {
    font-family: "JetBrains Mono", monospace;
  }
  small {
    font-size: 20px;
  }
  .engineer-focus {
    background-color: #E8F5F3;
    padding: 12px;
    border-left: 4px solid #4A9B8A;
    margin: 12px 0;
    font-size: 22px;
  }
  .ref {
    font-size: .6em;
    color: #666;
    display: block;
    text-align: center;
    margin-top: .3em;
  }
  .center-image {
    text-align: center;
  }
  .center-image img {
    display: block;
    margin: 0 auto;
  }
---

# なぜLLMアプリケーションへの指示は失敗するのか？

## ソフトウェアエンジニアが知るべきLLMの特性

<div class="highlight">
📊 目標：LLMを理解して「これはうまくいきそう感」を得る<br>
🔍 目標：失敗の原因をプロファイルしやすくする
</div>

---

## tl;dr

**全員読もう**

<div class="center-image">

![w:400](./images/40113_prompt_engineering_for_llms_cvr.jpg)

</div>


---

## 今日のアジェンダ

1. **LLMの基本** - 知能はないテキスト補完エンジン
2. **LLMの制約** - なぜ期待通りに動かないのか
3. **LLMアプリケーション** - AIエージェントの仕組み
4. **LLMアプリケーションとの付き合い方**
5. **まとめ**

---

# 1. LLMの基本

## 知能はない。考えてもいない。テキストを補完しているだけ。

---

## LLMとは何か？

### 大規模言語モデル（Large Language Model）

- **本質**: 次の単語を予測するタスクを繰り返す **テキスト補完エンジン**
- **学習**: 大量のテキストデータから言語のパターンや構造を学習

<div class="center-image">

![w:600 h:300 cover](./images/04-gpt3-generate-tokens-output.gif)

</div>

<span class="ref">ref: https://jalammar.github.io/how-gpt3-works-visualizations-animations/
</span>

---

**次の単語に何を選ぶと一番それっぽいでしょう？クイズ**をひたすらに答え続けている
```
["Shohei", "Ohtani", "is", "a"] -> "baseball"? "pitcher"? "great"?...

↓ "baseball"

["Shohei", "Ohtani", "is", "a", "baseball"] -> "player"? "pitcher"? "star"?...

↓ "player"

["Shohei", "Ohtani", "is", "a", "baseball", "player"] -> "who"? "that"? "from"?...
```


---

### 実際には「次のトークン」を予測している
- **例**
"strange new worlds" -> [str][ange][ new][ worlds]

<div class="engineer-focus">
特に単語というわけではない。
</div>

- **大文字・小文字で全く扱いが変わる**
"STRANGE NEW WORLDS" -> [STR][ANGE][ NEW][ WOR][L][DS]


---

## Q: 補完エンジンにすぎないLLMはなぜ「Chat」できるのか？

でも私たち「対話」してるよね・・？

---



### LLMはなぜ「Chat」できるのか？

A.対話データを学習しているから

```yaml
# 学習データに含まれる対話形式の例 (これはちょっと古いらしい)

system: "あなたは親切なプログラミングアシスタントです"
user: "Pythonでリストをソートする方法は？"
assistant: "Pythonでリストをソートする方法をいくつか紹介します..."
user: "逆順にソートするには？"
assistant: "逆順にソートするには..."
```

<div class="engineer-focus">
💻 LLMは「アシスタントらしい応答」を学習しているだけ<br>
実際に理解しているわけではなく、パターンを模倣している
</div>


---

### LLMの応用性の高さ

LLMの実態は「テキスト補完エンジン」だが、
学習データの中身によって対話・質問応答・コード生成など多様なタスクに対応可能

<div class="engineer-focus">
✅ 自然言語の持つ柔軟性と自由度によって Tool呼び出し・タスク実行型AI Agentが実現
</div>

### 例

```
# タスク実行のための学習データのイメージ

system: "あなたは優秀なプログラミングアシスタントです"
user: "差分をCommitしてPushして"
assistant: "<call git commit> <call git push>"
```
→ LLMの応答で、<code><call git commit></code> の部分が来たらそれをtool呼び出しとして実行する

---

# 2. LLMの制約

## なぜ期待通りに動かないのか？

---

## 制約1: 自己回帰モデル

### 一方向性：未来を見ることができない

**LLMは「左から右へ」の一方向処理のみ可能**

- **後方参照のみ**: 過去のトークンしか参照できない
- **未来予測不可**: 後続の内容を事前に知ることはできない
- **層間制約**: 上位層の情報を下位層に戻せない

<div class="engineer-focus">

・各レイヤーは前段の出力のみを入力として受け取るだけ
</div>

**この制約により「読み返し」「見直し」が根本的に不可能**

---

### どういうことか？


![](./images/pefl_0215.png)

<div class="ref">
ref: LLMのプロンプトエンジニアリング
</div>

---

### 制約の具体的な影響

<div class="problem">
❌ <strong>文字数カウント</strong>: "strawberryに含まれるRの数は？"<br>
→ すでに処理済みの文字列を「遡って」解析できない
</div>

<div class="problem">
❌ <strong>文字列逆転</strong>: "hello を逆順にして"<br>
→ トークン化＋一方向性により困難
</div>


<div class="problem">
❌ <strong>立ち止まれない</strong>: "このAPIの仕様は..." → 誤った情報を出力開始<br>
→ 途中で間違いに気づいても修正せず継続<br>
→ 一貫して間違った結論に到達
</div>

<div class="solution">
✅ <strong>前向き処理</strong>: "これから書く文章の文字数を数えながら書いて"<br>
→ 生成しながら同時にカウント可能（ただし精度は低い）
</div>

---

## 制約2: トークンベースの処理 に起因する認識の限界

### トークン化による文字レベル情報の損失

```python
# トークン化の例（GPT系モデル）
"ghost"     → ["ghost"]           # 1トークン
"gohst"     → ["g", "oh", "st"]   # 3トークン（別物として認識）
"GitHub"    → ["Git", "Hub"]      # 2トークン
"github"    → ["github"]          # 1トークン（大小文字で異なる）
```

#### 一方向処理との組み合わせ効果

<div class="problem">
❌ <strong>誤字検出の困難さ</strong><br>
・"gohst"を見たとき、一方向処理により"ghost"との関連性を認識しにくい<br>
・どんなトークンも文脈から推測するしかない
</div>

<div class="engineer-focus">
💻 <strong>実用的影響</strong><br>
・変数名の typo、API名の微細な違い、ファイルパスの大小文字違いなどを正確に扱えない
</div>

---

### トークン化の実用的な問題(具体例)

<div class="problem">
❌ <strong>厳密な文字列処理</strong><br>
・正規表現パターンの生成・検証<br>
・ASCIIアート、図表の生成<br>
・コードの行数指定<br>
・変数名のスペルチェック
</div>

<div class="solution">
✅ <strong>トークンレベルで処理しやすいタスク</strong><br>
・自然言語の生成・要約<br>
・意味的類似性の判断<br>
・構造化されたコード生成<br>
・API仕様の理解・説明
</div>

---

## 制約3: 情報順序への依存性

### 「Lost in the Middle」現象

<div class="problem">
❌ <strong>プロンプト順序の影響</strong><br>
・冒頭と末尾の情報は記憶されやすい<br>
・中間部分の情報は活用されにくい<br>
・指示の位置により出力品質が大きく変動
</div>

*コンテキストが大きい場合その問題は顕著。*
<div class="solution">
✅ <strong>対策</strong><br>
・重要な情報は冒頭・末尾に配置<br>
・長過ぎる会話、逐一指示を与えるのは避ける<br>
・「本題の質問」をリマインドする。「リフォーカス」
</div>

---



<div class="center-image">

![w:800](./images/pefl_0601.png)
</div>

<div class="ref">
ref: LLMのプロンプトエンジニアリング
</div>

---


## 制約4: 思考時間の欠如

### LLMは「独り言」ができない

<div class="problem">
❌ <strong>即時応答の制約</strong><br>
・「考える時間」が存在しない<br>
・複雑な推論の段階的構築が困難
</div>

<div class="solution">
✅ <strong>Chain of Thought (CoT) による対策</strong><br>
・思考プロセスの外部化を強制<br>
・「ステップバイステップで考えて」指示<br>
・中間推論の明示的出力により品質向上
</div>

<div class="engineer-focus">
💻 LLMに「考えさせる」には思考を出力として表現させる（書かせる）必要がある
</div>

---

## 制約5: ハルシネーションと真実バイアス

### ハルシネーション

<div class="problem">
❌ <strong>「トレーニングデータを模倣するマシン」の残念な副作用</strong><br>
・もっともらしい情報をモデルが「自信を持って」生成してしまう<br>
→「勝手に作り話をしないで」といったプロンプト指示はほとんど効果がない
</div>

<div class="solution">
✅ <strong>対策</strong><br>
・モデルに検証可能な背景情報を提供させる<br>
→ ユーザーが検証する
</div>

<div class="engineer-focus">
裏を返せば、仮説的な状況や反事実的なシナリオを語らせるのは容易。<br>
「2031年、最初のネアンデルタール人が復活してから1年が経過しました」...
</div>

---

## 制約5: ハルシネーションと真実バイアス

### 真実バイアス

<div class="problem">
❌ <strong>プロンプトの情報を「正しい」と過信</strong><br>
・間違ったプロンプトによってハルシネーションが誘発される<br>
・それを途中で訂正するケースはごくまれ
</div>

<div class="engineer-focus">
💻 <strong>実用的影響</strong><br>
・良かれと思って与えた情報が、モデルの誤った推論を誘発する可能性がある<br>
・間違ったファイルを開きながらPrompt指示を行って、意図しないコンテキストを提供してしまう
</div>


---

### チェーホフの銃の誤謬(ごびゅう)

**与えられたのなら、意味があるはずだ**

> 意味のある文章のスニペット（断片）を取得できれば、それは素晴らしいコンテキストとなりますが、無関係な情報を取得してしまうと、他のより有用なコンテキストが埋もれてしまう可能性があります。
~中略~
最悪の場合、モデルは**与えられた情報を必ず活用しようとする傾向がある**ため、完全に無関係なコンテキストまでも深読みしてしまうかもしれません。私たちはこれを「**チェーホフの銃の誤謬**」と呼んでいます。劇作家のアントン・チェーホフは不要な要素を排除することを提唱しており、「第一幕で壁に銃を掛けるのであれば、次の幕でそれを撃たなければならない。もしそうでないのなら、最初からそこに掛けるべきではない」と述べています。

<div class="ref">
ref:LLMのプロンプトエンジニアリング
</div>

---

### 改めて：人間の思考とLLMの処理の違い

人間の言葉は**現実**を反映するが、モデルの言葉は**学習データと与えられた言葉**を反映する
モデルに渡す言葉とその応答に対するメンタルモデルは、人間のものと異なることを認識する


![](./images/pefl_0203.png)

<div class="ref">
ref: LLMのプロンプトエンジニアリング
</div>

---

# 3. LLMアプリケーション

## AIエージェントの仕組み

---

<div class="center-block">

**「xxを実装してください」って言ったらやってくれた！すごい！魔法！**
**もうエンジニアいらない！**
</div>

---

<div class="center-block">

Claude Code
Github Copilot Agent
Junie
Devin
Cursor
etc...

なんかすごい！やばい！

</div>

---
## 「魔法」の正体

<div class="highlight">

**実際は「コンテキスト収集 + プロンプト生成 + LLM呼び出し」の組み合わせと制御**

</div>


これらは「知能」を持つわけではない。
エンジニアのスキルっぽい文章を大量学習したLLM + エンジニアが実装したアプリケーションと制御フロー で実現されている


```
アプリケーションは、コンテキストを収集し、良い断片を選び、プロンプトを生成し、LLMに送信する
↓
LLMはそのプロンプトに基づいて応答を生成
↓
アプリケーションがその応答を解釈して次の実行...(以下ループ)
```
<div class="engineer-focus">
今回の発表では、このコンテキスト収集 → LLM呼び出しのアプリケーション部分を<br>
「<strong>LLMアプリケーション</strong>」と呼ぶことにします
</div>

---

## LLM アプリケーション実装の一般的な流れ

複雑な問題をワークフローの要素に分割。
タスク処理やワークフローは決定論的なものも含まれる

<div class="engineer-focus">
<strong>NewsPicks Agentの場合</strong><br>
ゴール：ユーザー行動から示唆を得る(仮)<br>
タスク：ユーザー情報の特定/ユーザー閲覧情報の収集/ニュース記事の要約/読んだニュースの要約<br>
</div>

<div class="center-image">

![w:900](./images/pefl_0904.png)
</div>

<div class="ref">
ref: LLMのプロンプトエンジニアリング
</div>

---

## LLM アプリケーション実装の一般的な流れ

高度なものでは、ワークフローもLLMがドライブする。
ゴールが多岐にわたるため、これらのタスクの分割と順序付け自体をLLMが行うことが求められる。

→ **我々が仲良くなりたいのはだいたいこっち**

<div class="engineer-focus">
<strong>コーディングエージェントの場合</strong><br>
ゴール1：ユーザー指示に従って実装を行う<br>
タスク：ユーザー指示の理解/既存実装の発見/関連実装の発見/実装の生成/検証<br>
<br>
ゴール2：ユーザー指示に従ってデバッグを行う<br>
タスク：ユーザー指示の理解/エラー文の理解/エラー箇所の特定/公式ドキュメントの参照/ソースコードの理解<br>
</div>



---

# 4. LLMアプリケーションとの付き合い方



---


## LLMアプリケーションは「テキスト補完エンジン」がバックエンド

<div class="highlight">
LLMは、テキストを受け取ってテキストを生成するだけの「テキスト補完エンジン」<br>
そのため、どの情報も必ず一つのテキストとして渡され、返答もまたテキストとして返される
</div>

LLMアプリケーションにおいて、どのような情報を収集し、どのようにプロンプトを生成する（してもらう）かが、<strong>モデル性能と同等かそれ以上に重要</strong>になる



---


### Q.高度なLLMアプリケーションはどのようなときにプロンプトを構成するだろうか？


A.大体これ全部

- ゴールを理解
- タスクを理解
- タスクを実行
- タスクを順序立てる


<div class="center-image">

![w:800](./images/pefl_0904.png)
</div>

<div class="ref">
ref: LLMのプロンプトエンジニアリング
</div>

---


### これがわかるような指示になっているだろうか？

- **ゴールを理解してもらう**
  - 新規実装？削除？変更？
- **タスクを理解してもらう**
  - この関数は何をするか？
  - どのファイルが参考になるのか？
- **タスクを実行してもらう**
  - 公式ドキュメントを参照するならURLを付与しているか？
- **タスクを順序立ててもらう**
  - どれを先にやったらスムーズか？


---

<div class="center-block">

<strong>とはいえ面倒🤔</strong>

</div>

---


### いろんなLLMアプリケーションの手触り感を掴む

以下のどれが得意・不得意か？


- **ゴールを理解してもらう**
- **タスクを理解してもらう**
- **タスクを実行してもらう**
- **タスクを順序立ててもらう**


<div class="solution">

→ どこが強いか？を把握してユーザー指示をサボる
→ どこで失敗してそうか？を考えてユーザー指示に反映する

</div>
<div class="engineer-focus">
💻 <strong>「手触り感」の例</strong><br>
- Copilot Chat Agentは「<code>#problems</code>」指示でVSCodeで検出された問題を理解できる<br>
- Claude CodeはTODOを出力しそれをもとにするので「順序立てて実行」能力が高い
</div>

---
<div class="center-block">

### 自分のイメージ

迷いそう・落ちそうなところを厚くサポート
</div>

<div class="center-image">

![w:600](./images/mario-image.png)
</div>


---

## うまく使うために

---


## うまく使うために（1/3）

### 1. アプリケーションの傾向を理解する

<div class="engineer-focus">
💻 <strong>Copilot Chat Agentの例</strong><br>
・どのファイルがContextに含まれるか<br>
・カスタム指示はどれくらいの効果があるか<br>
・見てほしいファイルにどれくらい到達するか<br>
・どれくらい会話を続けられるか
</div>

**利用者としてできることの一例**:
- 関連ファイルを適切に配置・命名
  - LLMはパターンに強い。パターン化された配置を徹底
- プロジェクト構造を標準的な形に整理
  - LLMの基礎知識を活かす
- 空の関数定義・コメントによる文脈情報の提供
  - タスクを理解しやすく

---

## うまく使うために（2/3）

### 2. 無関係なコンテキストを排除する

<div class="engineer-focus">
💻 <strong>振り返り</strong><br>
・LLMはハルシネーションを起こす<br>
・間違ったものを「真実」と信じ込むバイアスがある<br>
・与えられたものを最大限に活かそうとする(チェーホフの銃の誤謬)
</div>

**利用者としてできることの一例**:
- カスタム指示やプロンプトは絞る
- 古いコードなどはファイル単位で分ける
- 見てほしくないコードなどにはPrompt内で触れない


---

## うまく使うために（3/3）

### 3. ユーザー指示プロンプトの工夫と分析

<div class="engineer-focus">
💻 <strong>振り返り</strong><br>
・LLMの「Lost in the Middle」現象<br>
・プロンプト順も大きな影響がある（LLMの一方向な視野）<br>
</div>

**利用者としてできることの一例**:
- 頭から順に重要な情報を配置
- 構造化されたプロンプトを使用（Markdown等）
- 長過ぎるやり取りに注意
  - 中間のやり取りは重要視されなくなっていく
  - コンテキスト長の限界があるので、どこかで要約されコンテキストがコンパクトにされる


---

## 一般的なプロンプトエンジニアリングについてさらっと

### LLMの特性を考えて、なぜこれが効くのかを想像してください

---

## 手法1: 構造化プロンプト

**プロンプトを明確に構造化して、モデルに期待する出力を明示する手法**

```yaml
## 役割
あなたは経験豊富なPythonエンジニアです

## タスク
以下のコードの性能を改善してください

## 制約条件
- Python 3.9以上を使用
- 外部ライブラリは numpy, pandas のみ使用可
- メモリ使用量を重視

## 入力コード
[コードをここに]

## 期待する出力
- 改善されたコード
- 変更点の説明
- 性能向上の見積もり
```

---


## 手法2: Few-Shot Prompting

**いくつかの例を提示して質問をする手法**

パターンを理解させ、一貫した出力を得られる。

```yaml
# 例示
以下は、果物とその説明です。
メロン「果肉が甘く、香り高いのが特徴」
みかん「皮がむきやすい柑橘類、ビタミンC豊富」

# 質問
りんごに関する説明を書いてください。
```

<div class="engineer-focus">
<strong>注意</strong><br>
コーディングエージェントへの良いコードの例示も一定の効果あり。<br>
が、何でもかんでも例を含めた指示を与えると、LLMは混乱する
</div>

---

## 手法3: Chain of Thought (CoT)

**思考プロセスを段階的に外部化させる手法**

LLMには「考える時間」がないため、思考プロセスを出力として表現させることで、より深い推論を促す

```yaml
## タスク
以下のアルゴリズムの時間計算量を分析してください

## 分析手順
1. まず、アルゴリズムの各ステップを特定する
2. 各ステップの実行回数を計算する
3. 最も時間のかかる操作を特定する
4. 全体の時間計算量を導出する
5. 改善可能な点があれば提案する

各ステップで思考プロセスを明示してください。

[コードをここに]
```

---


## 手法4: Tree-of-Thought (ToT)

**複数の解決方法を比較検討して最適解を選ぶ手法**

複雑な意思決定や戦略的思考が必要なタスクに有効

```yaml
新しいモバイルアプリの機能設計について、以下の3つのアプローチを比較検討し、最適解を選んでください：
1. ユーザビリティ重視
2. 機能豊富性重視
3. パフォーマンス重視
```

---

# 5. まとめ


---

## まとめ

### LLMは「テキスト補完エンジン」であり、知能はない
- LLMは次の単語を予測するだけのモデルで、制約もたくさんある
  - 一方向処理、トークン化、ハルシネーションなど
- 自然言語の柔軟性を活かして、様々なタスクに対応可能


### 高度なLLMアプリケーションは「テキスト補完エンジン」がバックエンド
- タスク実行やワークフローの制御もLLMが行う
  - これを判断できる情報が渡される必要がある
  - アプリケーションがLLMに渡す情報を意識する
- それぞれの手触り感を掴んで、適切な指示を与える
  - アプリケーションの弱い部分を補ってあげる
- プロンプトエンジニアリングは、LLMの特性を補うための技術
  - 頭に入れておくと、LLMアプリケーションをうまく使える

---

<div class="center-block">
Arigato! 🙏
</div>
