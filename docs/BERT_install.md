# set up running BERT on Centos7

## 環境

- CentOS 7.6.1810
- Python 3.7.4

## install juman

### gcc

```bash
 yum -y install gcc gcc-c++
```

### cpu コア確認

```bash
cat /proc/cpuinfo
```

**コマンドで出た processor の数を次の-j 〇オプションに適用**

### Boost C++

```bash
cd /usr/local/src
wget https://dl.bintray.com/boostorg/release/1.69.0/source/boost_1_69_0.tar.gz
tar xzvf boost_1_69_0.tar.gz
cd boost_1_69_0/
./bootstrap.sh
./b2 install -j4 #(プロセッサ数)
```

### juman

```bash
cd /usr/local/src
wget 'http://nlp.ist.i.kyoto-u.ac.jp/DLcounter/lime.cgi?down=http://lotus.kuee.kyoto-u.ac.jp/nl-resource/jumanpp/jumanpp-1.02.tar.xz&name=jumanpp-1.02.tar.xz' -O jumanpp-1.02.tar.xz
tar Jxfv jumanpp-1.02.tar.xz
cd jumanpp-1.02/
./configure
make
make install
```

# BERT

## BERT 本体コード

```bash
git clone https://github.com/google-research/bert
```

## 日本語 Pretrained モデル

- BERT 日本語 Pretrained モデル - KUROHASHI-KAWAHARA LAB  
  http://nlp.ist.i.kyoto-u.ac.jp/index.php?BERT%E6%97%A5%E6%9C%AC%E8%AA%9EPretrained%E3%83%A2%E3%83%87%E3%83%AB#k1aa6ee3

Whole Word Masking 版: Japanese_L-12_H-768_A-12_E-30_BPE_WWM.zip (1.6G; 19/11/15 公開)をダウンロード

##### コマンドラインから DL

```bash
wget http://nlp.ist.i.kyoto-u.ac.jp/DLcounter/lime.cgi?down=http://nlp.ist.i.kyoto-u.ac.jp/nl-resource/JapaneseBertPretrainedModel/Japanese_L-12_H-768_A-12_E-30_BPE_WWM.zip&name=Japanese_L-12_H-768_A-12_E-30_BPE_WWM.zip -O Japanese_L-12_H-768_A-12_E-30_BPE_WWM.zip
```

1.6G なので結構時間かかります。

## 参考

- CentOS7 の Python3 で JUMAN++のインストールと利用 - デベロッパー・コラボ
  https://developer-collaboration.com/2019/01/29/centos7-python3-juman/

- メモ帳という名の備忘録\_ Python3 から JUMAN++を使う@CentOS7
  https://umiushizn.blogspot.com/2017/09/python3jumancentos7_9.html
