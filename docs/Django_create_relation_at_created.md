# 【Django】レコードを作成したら関連するレコードを追加するパターン

サイトでのレコード登録や、APIでのレコード追加時に、紐づくレコードを作成したいというケースは良くあります。  
今回はDjangoのいろんなパターンでそれを実現するコードをまとめてみました。ここに上げた例は自分が実装した事のあるもののみなので、それ以外にもいろいろな方法で実装できることに注意してください。

django-rest-framework(以下 DRF)での実装もあります。

- Python 3.7.4
- Django 3.0.3
- django-rest-framework 3.11.0

---

## シグナルを利用

一番単純かつ汎用的なパターンとして、シグナルを利用します。
Djangoでは特定のアクションが生じた場合、それに応じたシグナルが発され、特定の処理を行うことが出来ます。

```python
from django.contrib.auth.models import AbstractBaseUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.crypto import get_random_string

class User(AbstractBaseUser):
    pass


class Token(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='token')
    token = models.CharField("トークン", max_length=40)


@receiver(post_save, sender=User)
def create_token(sender, **kwargs):
    """ユーザー作成時にトークンを生成"""
    if kwargs['created']:
        # 例なのでハッシュではなくget_random_string
        Token.objects.create(user=kwargs['instance'],
                             token=get_random_string(length=40))
```

レコードがセーブされる場合のシグナルなので、`post_save`というシグナルを受け取ります。
シグナルを受け取る関数には、@receiverというデコレータを用います。

作成時には`kwargs['created'] = True`になります。
作成されるインスタンスは`kwargs['instance']`に格納されているので、これを利用して関連のレコードを作成出来ます。

### 利点

シグナルを利用する利点は、管理サイトからのレコード追加でも関連レコードを生成出来ます。
管理サイト、shell、Form、APIなどどんな作成方法でも実行されるので、いろいろなパターンで使用出来ます。
逆にいうと、どんな状況でもレコードが作成されてしまうという事でもあります。

---

## 作成用メソッドに追加

Djangoの設計では、ModelManagerを操作してレコードを操作するのが推奨されます。
ModelManagerにレコード作成用のメソッドを作成し、そのメソッド内で関連オブジェクトを作成します。

```python
from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):

    use_in_migrations = True

    def create_user_and_token(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The given username must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        # 関連オブジェクトの作成
        Token.objects.create(user=user,
                             token=get_random_string(length=40))
        return user

class User(AbstractBaseUser):
    objects = UserManager()

```

### 利点

`create_user_and_token`のようなわかりやすい名前にしておけば、  
関連オブジェクトも作成するメソッドだということを認識できるのが良い点です。

また引数を渡すことも出来、関連先オブジェクトの構造が変化しても、  
このメソッドのみ変更すればいいので、保守性が高いです。

---

## form_validを利用する

`generics.CreateView`であれば、form_validをすこし書けば実現出来ます。

```python
from django.views.generic import CreateView
from django.contrib import messages

class View(CreateView):
   form_class = UserModelFormClass # modelForm

    def form_valid(self, form):
        self.object = form.save()
        # 関連オブジェクトの作成
        token = Token.objects.create(user=self.object,
                                     token=get_random_string(length=40))
        messages.success(self.request, f"トークンも作成しました: {token.token}")
        return HttpResponseRedirect(self.get_success_url())
```

### 利点

比較的少ない記述量で済むのが利点でしょう。レコードの作成にはCreateViewを使うことが多いので、選択肢の一つになります。

また、作成したオブジェクトを利用してメッセージを表示するのであれば、ここに記述するのがよさそうです。


# Django REST Framework
## serializers.SerializerMethodField()を利用

DRFではserializerに`SerializerMethodField`というフィールドを定義出来ます。  
このフィールドで定義された値は、`get_<field_name>`というメソッドの返り値を返します。


```python
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'pk',
            'email',
            'name',
            'password',
            'profile',
            'token',
        )

    def get_token(self, instance):
        # instanceには作成されたインスタンスが入っている
        return APIToken.object.create(instance).token
```

### 利点


APIでデータを作成しつつ、同時に作成した関連する値を返却する時はシンプルに書けるのが良い点です。`ViewSet`の`create`をオーバーライドしたりするとViewが長くなりがちです。
