# 【VSCode】PythonのlanguageServerが起動しなくなった

ある日突然VSCode拡張、PythonのLanguageServerのダウンロードが途中で停止してしまうようになった。
タスクバーの下に以下のような表示が出たまま、進まず。
`Downloading Microsoft Python Language Server... 31634 of 32423 KB(98%)`

【出力】パネルの`Python Language Server`タブには、

```bash
Downloading https://pvsc.azureedge.net/python-language-server-stable/Python-Language-Server-linux-x64.0.5.31.nupkg...
```
と表示されており、これ以上は進まない状況。

再起動やPython拡張の別バージョンをインストールしてみたりしたが、上手くいかず。
手動でソースをunzipし、起動できるようにしたので、手順を示す。

## 環境

- Visual Studio Code 1.43.1
- Remote - SSH 0.50.1
- Python Extension 2020.3.69010
- CentOS 7

Windows 10のVScodeから、CentOS7にリモート接続している。PythonLanguageServerが起動しなかったのはCentOS上。

2020/03/23時点の環境なので、参考にする場合は注意。

## 拡張機能の削除

Python拡張機能の本体は、`~/.vscode-server/extensions/ms-python.python-YYYY.m.XXXXX`の中にある。
この中の`languageServer.0.XX.X`がlanguageServer本体。

languageServerを手動で配置するので、languageServerを削除する。
配置する用のディレクトリを作成しておく。名前は`languageServer`で始まる名前であれば良いようだ(未確認)。

```bash
$ rm -rf languageServer.0.XX.X/
$ mkdir languageServer/
```

## 拡張機能のDL

パネルに表示されていたURLから、languageServerをDL。
`.nupkg`を`.zip`にリネームする。

```bash
~$ wget https://pvsc.azureedge.net/python-language-server-stable/Python-Language-Server-linux-x64.0.5.31.nupkg
~$ mv Python-Language-Server-linux-x64.0.5.31.nupkg Python-Language-Server-linux-x64.0.5.31.zip
```

## 展開、配置

unzipする。

```bash
~$ unzip Python-Language-Server-linux-x64.0.5.31.zip -d ~/.vscode-server/extensions/ms-python.python-2020.3.69010/languageServer/
```

これで展開はできたのだが、このまま起動すると権限の関係でエラーが出る。
実行ファイルである`languageServer/Microsoft.Python.LanguageServer`に実行権限を与えておく。

```bash
~$ sudo chmod 775 ~/.vscode-server/extensions/ms-python.python-2020.3.69010/languageServer/Microsoft.Python.LanguageServer
```

## 起動

この時点で起動できる気がするのだが、起動してみると

```bash
[Error - 16:29:06] Starting client failed
Launching server using command dotnet failed.
```
という表示が。dotnetをインストールすればいいのだが、自分で配置するとdotnetが必要になるのはよくわからない。。。

## .NETインストール

### 依存ライブラリ

```bash
$ yum install -y libunwind libicu
```
### リポジトリ追加

```bash
$ rpm --import https://packages.microsoft.com/keys/microsoft.asc
$ vi /etc/yum.repos.d/dotnetdev.repo
```

```toml
[packages-microsoft-com-prod]
name=packages-microsoft-com-prod
baseurl=https://packages.microsoft.com/yumrepos/microsoft-rhel7.3-prod
enabled=1
gpgcheck=1
gpgkey=https://packages.microsoft.com/keys/microsoft.asc
```

### インストール

```bash
$ yum list | grep dotnet
$ yum -y install dotnet-sdk-3.1.200
```

### 確認

```bash
$ dotnet --version
3.1.200
```

## 起動成功

自分の環境では、これでlanguageServerが起動した。
正直なところ意味があるのかはわからないが、`settings.json`に以下を追記するとのこと。

```json
{
    "python.downloadLanguageServer": false,
    "python.jediEnabled": false,
}
```

## 参考

[Can the language server be installed manually_ · Issue #1698 · microsoft_python-language-server](https://github.com/microsoft/python-language-server/issues/1698)

[Downloading Python-Language-Server too slowly in China_ · Issue #1916 · microsoft_python-language-server](https://github.com/microsoft/python-language-server/issues/1916)