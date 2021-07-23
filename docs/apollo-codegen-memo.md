# apollo の型定義生成メモ

## apollo install

```bash
$ yarn add apollo
```

## apollo.config.js

includes には、Query を書いているファイルを glob で指定する。

### Apollo schema registry を使用する場合

```js
module.exports = {
  client: {
    includes: ["./src/**/*.tsx", "./src/**/*.ts"],
    service: "my-apollo-service"
  }
};
```

### エンドポイントからスキーマをリンクする場合

```js
module.exports = {
  client: {
    includes: ["./src/**/*.tsx", "./src/**/*.ts"],
    service: {
      name: "service-name",
      url: "https://sample.com/graphql/"
    }
  }
};
```

### ローカルファイルからスキーマをリンクする場合

```js
module.exports = {
  client: {
    includes: ["./src/**/*.tsx", "./src/**/*.ts"],
    service: {
      name: "service-name",
      localSchemaFile: "./path/to/schema.graphql"
    }
  }
};
```

## コマンド実行

```json
{
  "scripts": {
    "codegen": "apollo client:codegen src/types/api.d.ts --useReadOnlyTypes --addTypename --target=typescript --outputFlat"
  }
}
```

```bash
yarn run codegen
```

## 参考

[Configuring Apollo projects - Apollo Basics - Apollo GraphQL Docs](https://www.apollographql.com/docs/devtools/apollo-config/)
