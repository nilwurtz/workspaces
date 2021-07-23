# 【Django】開発に便利なスクリプト

Djangoの開発ではcliを叩くことが多くなりがちですが、
オプションとか覚えてられないかつ面倒なので、よく`Pipenv`等のタスクランナー機能を用います。
私は`poetry`派なのでpoetry scriptsをよく使います。(poetryはタスクランナー機能という名目でscripts機能を実装していないことに留意)

また、`django_extensions`を用いれば、欲しい機能もすでに使用可能なことが多いです。

今回は自分のプロジェクトで使っているスクリプトを紹介します。

## 環境

- Python 3.7.4
- poetry 1.0.5
- django-extensions 2.2.8

## django-extensions

django-extensionsは、Django開発用のアプリケーションで、様々な便利機能を用意してくれるパッケージです。`
django-extensionsをインストールし、INSTALLED_APPSに追加しておきます。

```bash
$ pip install django-extensions
```

```python
INSTALLED_APPS = [
    ...
    'django_extensions', # 追加
]
```

## scripts

私はパッケージ管理にPoetryを使用しているので、poetry scriptsを使用しています。
poetry scriptsを利用する利点として、仮想環境外で実行しても、一度仮想環境内に入り、仮想環境内でタスクを実行してくれる点があります。
テストだけ確認したい、URLだけ一覧表示したいという時や、仮想環境に関して理解がない人も一行のコマンドで実行出来るのは侮れません。

過去の投稿でも、runserverを行うスクリプトを紹介しました。
[【Poetry】Poetry script で Django の runserver を起動 - Qiita](https://qiita.com/ragnar1904/items/6c8fe71f0525051276cb)

この投稿と同じく、subprocessパッケージを利用してコマンド実行を行います。

### shell_plus

django-extensionsといえばの機能で、shell_plusという機能があります。
Django shellを拡張しており、補完や事前インポート等を行ってくれ、かなり便利です。

```python
def shell_plus():
    cmd = ["python", "manage.py", "shell_plus"]
    subprocess.run(cmd)
```

### URLを表示

django-extensionsには、DjangoアプリケーションのすべてのURLを出力をする機能があります。
APIドキュメントの作成時などかなり重宝します。
`--format`オプションでは、出力形式を変更出来ます。

```python
def url():
    cmd = ["python", "manage.py", "show_urls", "--format", "aligned", "--force-color"]
    subprocess.run(cmd)
```


### ソース内のTODOを表示

django-extensionsのnotes機能を用いれば、
pyファイルとHTMLファイル内の`TODO, FIXME, BUG, HACK, WARNING, NOTE`などを抽出し、一覧表示してくれます。
これが地味に便利で、一日の始めのTODO確認をCLIでできるのが良いです。
ファイルへのPathも表示されるので、VSCodeであれば`Ctrl + クリック`でそのまま開けます。

```python
def todo():
    cmd = ["python", "manage.py", "notes"]
    subprocess.run(cmd)
```

- 出力

```bash
$ python manage.py notes
/home/user/workspace/app/web/views.py:
  * [ 18] TODO  sort filter

/home/user/workspace/app/web/models.py:
  * [ 11] TODO  例外処理

/home/user/workspace/app/web/forms.py:
  * [ 32] TODO  バリデーション追加
```

### テストを実行

Djangoのテスト機能には、並列実行機能があります。
勿論その実行数にはCPUのコア数が関わってくるのですが、コア数は環境によって異なります。
`multiprocessing.cpu_count()`を用い、動的にコア数を取得してテストの並列実行を行います。
`-v`はverboseです。

```python
import multiprocessing

def test():
    core_num = multiprocessing.cpu_count()
    # core_numとすると、subprocessが一つの実行プロセスとなるため、テストが上手く動かない。
    cmd = ["python", "manage.py", "test", "--force-color", "-v", "2", "--parallel", f"{core_num - 1}"]
    subprocess.run(cmd)
```

### マイグレーションファイルを削除

データベースリセット時には、マイグレーションファイルをすべて消去します。
開発初期にはそこそこの頻度で行うので、削除スクリプトを作成しておくのが楽です。

```python
import os
import glob

BASE_DIR = os.path.dirname(os.path.dirname(__file__)) # このファイルの場所によって変更

def clean_migration():
    migration_files = glob.iglob('**/migrations/[0-9][0-9][0-9][0-9]*.py', recursive=True)
    for migration_file in migration_files:
        os.remove(os.path.join(BASE_DIR, migration_file))
        print(f"Deleted {migration_file}")
```

### データベースのリセット

データベースの削除と再作成を1コマンドで行う機能が、django-extensionsに用意されています。

```python
def reset_db():
    cmd = ["python", "manage.py", "reset_db"]
    subprocess.run(cmd)
```

### ER図の生成

django-extensionsの機能を用いると、ER図をmodel定義から自動生成してくれます。
この機能を用いるには、`Graphviz`およびPython用アダプタ`pygraphviz`が必要ですが、
1コマンドで最新のER図を作成してくれるのは最高です。

```python
def graph():
    cmd = ["python", "manage.py", "graph_models", "-a", "-g", "-o",  "--arrow-shape", "normal", "graph.png"]
    subprocess.run(cmd)
```

## models.pyのあるアプリ名表示

`models.py`の存在するアプリ名を表示します。
大したコードではないですが、makemigrationsを行う際チェックする時に役立ちます。
`python manage.py startapp app`としているディレクトリ構成で、モデルを記述しないアプリは`models.py`を削除する必要があります。

```python
import glob

def main():
    model_files = glob.iglob('**/models.py', recursive=True)

    for model_file in model_files:
        path_split = model_file.split("/")
        print(path_split[-2])
```

---

これらに加え、django runserverを強化する`runserver_plus`、admin.pyを自動生成してくれる`admin_generator`等がありますが、自分自身使用したことがないため一覧にはありません。
