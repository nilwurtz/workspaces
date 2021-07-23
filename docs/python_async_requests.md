# pythonで非同期リクエスト

Pythonでの非同期リクエストには、asyncioモジュールを用います。  
requestsパッケージを用いて、APIを非同期で叩くコードを作成してみます。

## 環境
- Python 3.7.4

## API

`time.sleep()`を用いてもよかったのですが、今回はより実践よりにAPIを取得するパターンを想定してみます。  
モックサーバーとして、`JSONPlaceholder`を使用しました。

[JSONPlaceholder](https://jsonplaceholder.typicode.com/)

一覧を取得するAPI(以下の6つ)を同期・非同期でリクエストし、  
それぞれの結果を一つのリストにした結果を返すコードを書きます。

https://jsonplaceholder.typicode.com/posts  
https://jsonplaceholder.typicode.com/comments  
https://jsonplaceholder.typicode.com/albums  
https://jsonplaceholder.typicode.com/photos  
https://jsonplaceholder.typicode.com/todos  
https://jsonplaceholder.typicode.com/users  

## 同期リクエスト

まずは同期処理でのリクエストを行ってみます。
普段のPythonコード通りに書くと、以下のようになります。

```python
import time
import requests

BASE_URL = "https://jsonplaceholder.typicode.com/"


def calc_time(fn):
    """関数の実行時間を計測するデコレータ"""
    def wrapper(*args, **kwargs):
        start = time.time()
        fn(*args, **kwargs)
        end = time.time()
        print(f"[{fn.__name__}] elapsed time: {end - start}")
        return
    return wrapper


def get_sync(path: str) -> dict:
    print(f"/{path} request")
    res = requests.get(BASE_URL + path)
    print(f"/{path} request done")
    return res.json()


@calc_time
def main_sync():
    data_ls = []
    paths = [
        "posts",
        "comments",
        "albums",
        "photos",
        "todos",
        "users",
    ]
    for path in paths:
        data_ls.append(get_sync(path))
    return data_ls

if __name__ == "__main__":
    main_sync()
```

実行すると、以下のような出力が得られます。

リクエスト1 -> リクエスト1完了
リクエスト2 -> リクエスト2完了
リクエスト3 -> リクエスト3完了...

と実行されていることがわかります。

```bash
/posts request
/posts request done
/comments request
/comments request done
/albums request
/albums request done
/photos request
/photos request done
/todos request
/todos request done
/users request
/users request done
[main_sync] elapsed time: 1.157785415649414
```


## 非同期リクエスト

次に非同期リクエストを行います。  

非同期で行うタスクはイベントループ内で実行されます。  
イベントループを取得するには、`asyncio.get_event_loop()`を用います。  

`loop.run_until_complete`は、その名前の通りそれぞれのタスクが実行され終わるまでイベントループが実行されるメソッドです。このメソッドの返り値は、それぞれの非同期実行タスクの返り値が入ったリストです。  

実行される順番は保障されていないのですが、返り値は引数に渡した順番で返ってくるので、順番が重要な場合も利用できます。

`async def`で宣言される`get_async`はコルーチン関数と呼ばれます。  
コルーチン関数内での`await`式は、コルーチン関数の実行を返り値が戻るまで一時停止されます。

```python
import asyncio

# コルーチン関数
async def get_async(path: str) -> dict:
    print(f"/{path} async request")
    url = BASE_URL + path
    loop = asyncio.get_event_loop()
    # イベントループで実行
    res = await loop.run_in_executor(None, requests.get, url)
    print(f"/{path} async request done")
    return res.json()


@calc_time
def main_async():
    # イベントループを取得
    loop = asyncio.get_event_loop()
    # 非同期実行タスクを一つのFutureオブジェクトに
    tasks = asyncio.gather(
        get_async("posts"),
        get_async("comments"),
        get_async("albums"),
        get_async("photos"),
        get_async("todos"),
        get_async("users"),
    )
    # 非同期実行、それぞれが終わるまで
    results = loop.run_until_complete(tasks)
    return results


if __name__ == "__main__":
    main_async()
```

出力は以下のようになります。

リクエスト1 リクエスト2 リクエスト3...  
リクエスト1完了 リクエスト2完了 リクエスト3完了...

と処理されていることがわかります。
また実行時間もかなり短縮されていることがわかります。

```bash
/posts async request
/comments async request
/albums async request
/photos async request
/todos async request
/users async request
/users async request done
/todos async request done
/posts async request done
/albums async request done
/comments async request done
/photos async request done
[main_async] elapsed time: 0.17921733856201172
```