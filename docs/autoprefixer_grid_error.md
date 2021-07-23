# autoprefixerでAutoplacement does not workエラー

IE対応には欠かせないautoprefixerを使用してみたのですが、詰まったところがあったので共有。

## autoprefixer

autoprefixerとは、-ms等のprefixを自動で付けてくれるツールです。  
それだけではなく、IE11では未対応の`grid-template-areas`を解釈して正しいところに配置してくれる機能まであります。これが神。

cliからは、postcssから起動します。

```bash
$ yarn add -D autoprefixer postcss-cli
```

起動。

```bash
$ postcss static/css/style.css -c postcss.config.js -d static/css
```

postcss.config.jsには、gridを置き換える設定を書いておく。

```js
const autoprefixer = require("autoprefixer");

module.exports = {
  plugins: [autoprefixer({ grid: "autoplace" })],
};
```

## プロパティに注意

実行時に、以下のようなエラーに遭遇。

```bash
84:4    ⚠  Autoplacement does not work without grid-template-rows property [autoprefixer]
105:4   ⚠  Autoplacement does not work without grid-template-rows property [autoprefixer]
87:2    ⚠  Autoplacement does not work without grid-template-columns property [autoprefixer]
109:2   ⚠  Autoplacement does not work without grid-template-rows property [autoprefixer]
115:4   ⚠  Autoplacement does not work without grid-template-rows property [autoprefixer]
```

`display: grid`を使用する場合、`grid-template-columns`と`grid-template-rows`の両方を設定する必要があります。
これを指定しない場合、autoprefixerが利かず、実行時エラーが表示されます。

```scss
// NG
.sample {
    display: grid
    grid-template-columns: auto auto;
    grid-template-area: "left right"
}
// OK
.sample {
    display: grid
    grid-template-columns: 50vw 50vw;
    grid-template-rows: auto;
    grid-template-area: "left right"
}
```

また、ネストした場合も両方のプロパティが必要になります。

```scss
.sample {
    display: grid
    grid-template-columns: 50vw 50vw;
    grid-template-rows: auto;
    grid-template-area: "left right";
    // NG
    &.small {
        grid-template-columns: 10vw 10vw;
    }
    // OK
    &.small {
        grid-template-columns: 10vw 10vw;
        grid-template-rows: auto;
    }
}

```

これでIEを倒しましょう。