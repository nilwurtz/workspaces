# DRFでbasic認証+テストコード

django-rest-frameworkでBasic認証を実装、そのテストコードを記述する。

- python 3.7.4
- django 3.0.3
- django-rest-framework 3.11.0

## basic認証の実装

`genericView`でも、`views.APIView`でも`authentication_classes`および`permission_classes`を指定すれば、認証を行ってくれる。
認証が通るとrequest.userに認証したユーザーインスタンスを、失敗すると401レスポンスを返してくれる。

```python
# DRF
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import BasicAuthentication
from rest_framework.response import Response
from rest_framework import status


class UserInfoAPI(APIView):
    """ユーザー情報取得API"""
    authentication_classes = (BasicAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        # 認証情報は、request.userに格納される
        user = request.user
        data = {
            "message": "Token valid.",
            "full_name": user.full_name,
            "profile": user.profile if user.profile else None
        }
        response = Response(data, status=status.HTTP_200_OK)
        return response
```

## test

テストユーザー作成時にトークンを作成しておく。
`self.client.credentials`にHTTP_AUTHORIZATIONという引数でヘッダー文字列を渡す。
メールとパスワードの平文をエンコード、その文字列をbase64でエンコード、最後にそれをデコードしてやる。

```python
import base64
from rest_framework import HTTP_HEADER_ENCODING
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from app.models import User

class TestAuthAPI(APITestCase):
    def setUp(self):
        mail = "test@sample.com"
        password = "testPass"
        self.user = User.objects.create(email=mail,
                                        password=password)
        self.credentials = base64.b64encode(
                f'{email}:{password}'.encode(HTTP_HEADER_ENCODING)).decode(HTTP_HEADER_ENCODING)
        self.url = reverse("app:auth")

    def test_success(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Basic {self.credential}')
        request = self.client.get(self.url)
        self.assertEqual(request.status_code, 200)
        self.assertEqual(request.json()["full_name"], self.user.full_name)
```

## UserModelについて

認証するUserモデルは、AbstractBaseUserを継承していなくてはならない。
`BasicAuthentication`クラスは、`User.is_active`というプロパティを参照するようになっている。
またusernameではなくEmail+Passwordを使用する場合、`USERNAME_FIELD="email"`と設定しておく。
`BasicAuthentication`クラスがUSERNAME_FIELDを参照し、ユーザーを特定するからである。

以下がBasicAuthenticationクラスである。

```python:rest-framework/authentication.py
class BasicAuthentication(BaseAuthentication):
    """
    HTTP Basic authentication against username/password.
    """
    www_authenticate_realm = 'api'

    def authenticate(self, request):
        # ヘッダーから文字列を取り出す処理・・・
        return self.authenticate_credentials(userid, password, request)

    def authenticate_credentials(self, userid, password, request=None):
        """
        Authenticate the userid and password against username and password
        with optional request for context.
        """
        credentials = {
            get_user_model().USERNAME_FIELD: userid, # USERNAME_FIELDを参照する
            'password': password
        }
        user = authenticate(request=request, **credentials)

        if user is None:
            raise exceptions.AuthenticationFailed(_('Invalid username/password.'))

        if not user.is_active:
            raise exceptions.AuthenticationFailed(_('User inactive or deleted.'))

        return (user, None)

    def authenticate_header(self, request):
        return 'Basic realm="%s"' % self.www_authenticate_realm
```