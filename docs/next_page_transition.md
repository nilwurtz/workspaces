# Next.jsでページ遷移時に表示するコンポーネント

Next.jsでページ遷移時に表示するコンポーネント。

- next 9.3.0
- typescript 3.7.5

## useRouter
nextでは、useRouterを用いてReact.FCコンポーネント内でルータを触れる。
ページ遷移する場合、`router.events`が発火される。

- router events
引数に渡されるURLは遷移先のURL。

|  event  |  説明  |
| ---- | ---- |
|  `routeChangeStart(url)`  |  ルートが変更され始めると起動する。  |
|  `routeChangeComplete(url)`  |  ルートが完全に変更されたときに起動する。  |
|  `routeChangeError(err, url)`  |  ルートの変更時にエラーが発生した場合、またはルートのロードがキャンセルされた場合に起動。  |

## component

router.eventで内部stateを入れ替える。
`return loading && <PageTransition>{"Rendering..."}</PageTransition>;`としているので、
`loading===true`時のみ`<PageTransition>Rendering</PageTransition>`が表示される。
クラス書き換え等でフェードインフェードアウトも可能。

router.eventsは、URLに関係なくリンクを押された時に発火するので、handle関数内でURLが現在のURLかどうかを判定する必要がある。

```tsx
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export const Loading: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = url => {
    if (url !== router.pathname) {
      setLoading(true);
    }
  };
  const handleComplete = url => {
    if (url !== router.pathname) {
      setLoading(false);
    }
  };
  useEffect(() => {
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return loading && <PageTransition>{"Rendering..."}</PageTransition>;
};
```