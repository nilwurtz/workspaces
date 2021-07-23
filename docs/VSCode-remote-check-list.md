# 【VSCode】Remote-sshで鍵の設定を行ったのにパスワードを聞かれる

VSCodeにはRemote-sshという拡張機能があり、  
リモート先のファイルを普段と同じ環境で編集することが出来ます。

接続方式では鍵認証も行えるのですが、たまに鍵認証を設定してもパスワードを聞かれることがあるので、その時に確認する事柄を共有します。

## 環境

- Visual Studio Code 1.43.2
- Remote-SSH 0.51.0
- OpenSSH 7.4p1
- OpenSSL 1.0.2

## リモート先サーバーの権限

リモート先サーバーがlinux系の場合、sshの権限は決められており、正しく設定する必要があります。

```bash
# リモート先サーバにて
$ chmod 600 ~/.ssh/authorized_keys
$ chmod 700 ~/.ssh
```

## .ssh/configの確認

.ssh/configに正しい形式で記述します。  
VSCodeの拡張とは言え、コンソールからSSHできないと起動出来ません。

```
Host remote_server
    HostName 192.168.11.1
    User user
    IdentitiesOnly yes
    IdentityFile ~/.ssh/key_rsa
```

コンソールから、鍵で入れるかを試します。  
正しい設定がされている場合、ssh (Host)だけでリモート先に接続出来ます。

identytyFileとtypoした例。

```bash
$ ssh remote_server
C:\\Users\\ragnar/.ssh/config: line 14: Bad configuration option: identytyFile
C:\\Users\\ragnar/.ssh/config: terminating, 1 bad configuration options
```

## authorized_keysの権限

クライアントがUnix系の場合、クライアント側のauthorized_keysの権限も設定する必要があります。

```bash
$ chmod 700 ~/.ssh/authorized_keys
```

## .ssh/configのHost名変更

ここまでの流れでコンソールからはSSHできるが、VSCodeではパスワードが聞かれる場合、  
configのHostの名前を変更すると上手く行く場合がある。

`user@hostname`とHostを設定している場合、拡張機能側でhostとuserを解釈されるようで、うまく動かなかった。
また、スペースも使用しないほうが良いようだ。

```bash
# NG
Host user@hoge
    HostName 192.168.11.1
    ...
# NG
Host user hoge server
    HostName 192.168.11.1
    ...
# OK
Host remote_server
    HostName 192.168.11.1
    ...
```