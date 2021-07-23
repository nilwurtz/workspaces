# Apollo-client のネットワークエラーを表示する

Apollo-client では 400 エラー等を受け取った際、デフォルトではエラーメッセージが表示されない。
Apollo-Client 内部でエラー処理され、エラーステータスに沿ったメッセージが`error.message`に格納される。

- 400 エラーの例

```bash
Error: Network error: Response not successful: Received status code 400
```

## 環境

```json
{
  "dependencies": {
    "@apollo/react-hooks": "^3.1.3",
    "apollo-cache-inmemory": "^1.6.5",
    "apollo-client": "^2.6.8",
    "apollo-link-error": "^1.1.12",
    "apollo-link-http": "^1.5.16"
  }
}
```

## apollo-link-error

apollo-client では、link という仕組みがあり、単純に言えばミドルウェアのような働きをします。

> 簡単に言うと、Apollo Links は連鎖可能な「ユニット」であり、これを組み合わせることで、各 GraphQL リクエストが GraphQL クライアントでどのように処理されるかを定義することができます。GraphQL リクエストを実行すると、各リンクの機能が次々と適用されます。これにより、アプリケーションに適した方法でリクエストのライフサイクルを制御することができます。例えば、リンクはリトライ、ポーリング、バッチ処理などを提供することができます。

[Composable networking for GraphQL - Apollo Link - Apollo GraphQL Docs](https://www.apollographql.com/docs/link/)

エラー文表示にはエラーハンドリングのための link である apollo-link-error を使用します。

```bash
$ yarn add apollo-link-error
```

## client に link を追加

- before

```ts
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";

const link = new HttpLink({
  uri: "https://sample.com/graphql/",
  fetch: fetch
});
const cache = new InMemoryCache();
const client = new ApolloClient({ link, cache });
```

- after

```ts
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";

const httpLink = new HttpLink({
  uri: "https://sample.com/graphql/",
  fetch: fetch
});
const cache = new InMemoryCache();
// errorLink
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});
const link = ApolloLink.from([errorLink, httpLink]);
const client = new ApolloClient({ link, cache });
```

errorLink を作成し、onError 関数を定義します。
ApolloLink.from で link を連結し、ApolloClient に渡します。

**注意**
ApolloLink.from でリンクを連結する際、順番には気を付ける必要があります。

```ts
// error
const link = ApolloLink.from([httpLink, errorLink]);
```

自分の環境では、以下のようなエラーメッセージが出ました。

```bash
Error: You are calling concat on a terminating link, which will have no effect
```
