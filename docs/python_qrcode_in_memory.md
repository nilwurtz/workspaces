# PythonでQRコードをインメモリに生成

QRコードを生成しAPI等で返したり、メール送信する時、
一度ファイルにセーブし、それを読み出ししたりする処理が入ります。
この処理の場合、I/Oでの速度的問題や、並列処理時に問題が生じます。

`BytesIO`モジュールを使えば、一度ファイルに吐き出すことなく、インメモリで画像インスタンスを生成出来ます。


## 環境

- Python 3.7.4
- qrcode 6.1
- Pillow 7.0.0

qrcodeおよびPillowライブラリが必要です。

## 生成


```python
from io import BytesIO
import base64
import qrcode


class QRImage():

    @staticmethod
    def to_bytes(text: str) -> bytes:
        fp = BytesIO()
        img = qrcode.make(text)
        img.save(fp, "PNG")
        fp.seek(0)
        byte_img = fp.read()
        fp.close()
        return byte_img

    @classmethod
    def to_b64(cls, text: str) -> bytes:
        stream = cls.to_bytes(text)
        return base64.b64encode(stream).decode("utf-8")

if __name__ == "__main__":
    binary = QRImage.to_bytes(text="some_text")
    base64_encoded = QRImage.to_b64(text="some_text")
```

`BytesIO()`でバイナリストリームを生成でき、ファイルストリームのようにmakeやread、saveを行うだけです。


StringIO等も存在し、stringを格納することが出来ます。
また、with構文もサポートしています。

```python
from io import StringIO

def main():
    with StringIO() as fp:
        fp.write("Hello")
        print(fp.closed)     # True
        print(fp.getvalue()) # Hello
    print(fp.closed)         # False

main()
```


これで中間ファイルとはおさらばしましょう。