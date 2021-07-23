# 【Django】Viewを簡潔に書くためのショートカット

DjangoではViewファイル内でリクエストを受け取り、処理し、レスポンスを返すロジックを記述します。  
そのため、他のファイルに比べて記述量が多くなりがちです。  

Django側で利用されている便利メソッドや方法を用い、Viewファイルの記述量を減らしてみましょう。

django-rest-frameworkに関しての事柄も含まれます。


## 環境

- Django 3.0.3
- django-rest-framework
- Python 3.11.0

## shortcutを利用する

`Django.shortcuts`には、多くのショートカットメソッドが用意されています。  

その中でも、`get_object_or_404`および`get_list_or_404`は利用することが多いです。   
Djangoのチュートリアルで紹介されているので、利用されている事は多いと思います。

### 例

User詳細のView。Profileが作成されていなかった場合、404。

```python
from .models import Profile
from django.shortcuts import get_object_or_404
from django.views.generic import TemplateView


class UserDetailView(TemplateView):
    template_name = "user_detail.html"

    def get(self, request, *args, **kwargs):
        profile = get_object_or_404(Profile, user=request.user)
        context = self.get_context_data(**kwargs)
        context["profile"] = profile
        return self.render_to_response(context)
```

### やっていること

このメソッドが行っていることは、`queryset.get`を行い、例外を受け取ったらraiseしているだけです。

```python
from django.http import Http404


def get_object_or_404(klass, *args, **kwargs):
    """
    Use get() to return an object, or raise a Http404 exception if the object
    does not exist.

    klass may be a Model, Manager, or QuerySet object. All other passed
    arguments and keyword arguments are used in the get() query.

    Like with QuerySet.get(), MultipleObjectsReturned is raised if more than
    one object is found.
    """
    queryset = _get_queryset(klass)
    if not hasattr(queryset, 'get'):
        klass__name = klass.__name__ if isinstance(klass, type) else klass.__class__.__name__
        raise ValueError(
            "First argument to get_object_or_404() must be a Model, Manager, "
            "or QuerySet, not '%s'." % klass__name
        )
    try:
        return queryset.get(*args, **kwargs)
    except queryset.model.DoesNotExist:
        raise Http404('No %s matches the given query.' % queryset.model._meta.object_name)
```

そう、実はView関数の中でraiseすると、それをレスポンスにしてくれるのです。  
おそらく`django.core.handlers.exception`内で例外がキャッチされているのだと思います。(詳しい方教えていただければ幸いです。)

## shortcutを作成する

前項でView関数内でraiseするとレスポンスを返してくれる機構は、django-rest-frameworkにも存在します。  
これを利用して、View関数でよくやる、【リクエストパラメータを確認し、なければ400を返す処理】をショートカット化した、  
`get_data_or_400`のようなショートカットメソッドを作成します。

### before

スケジュールを取得する`rest_framework.APIView`の例。パラメータをチェックして、パラメータのエラーをキャッチして・・・  
そんな処理を繰り返す事に可読性の低いコードになってしまう。

```python
from datetime import datetime
from rest_framework.response import Response
from rest_framework import status, generics

class UserScheduleListAPI(generics.ListAPIView):
    # serializer_class等は省略

    def get(self, request, *args, **kwargs):
        param = request.query_params
        # startとendのパラメータは必須とする
        if "start" in param and "end" in param:
            try:
                start = datetime.fromisoformat(param["start"])
                end = datetime.fromisoformat(param["end"])
                if start > end:
                    raise AssertionError
                return super().get(request, *args, **kwargs)
            except AssertionError:
                data = {"message": "start date larger than end."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                data = {"message": "Invalid datetime format."}
                return Response(data, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                data = {"message": f"{type(e)}:{str(e)}"}
                return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            data = {"message": "start and end parameter is required."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
```

### after

requestパラメータから値を取得し、取得できなかったら`rest_framework.exceptions.ParseError`をraiseするショートカットを記述。

```python
from typing import Union, List, Any
from rest_framework.exceptions import ParseError
from rest_framework.request import Request

def _get_data(request: Request, keys: List[str]) -> Union[List[Any], Any]:
    """query paramからデータを取得"""
    ls: list = []

    for key_str in keys:
        try:
            ls.append(request.query_params[key_str])
        except KeyError:
            raise KeyError

    return ls if len(ls) > 1 else ls[0]

def make_error_text(keys: List[str]) -> str:
    return f'{" and ".join(keys)} is required in request parameter.'

def get_params_or_400(request: Request, keys: List[str]) -> Union[List[Any], Any]:
    """
    リクエストから指定したパラメータが存在するかを確認し、
    ない場合はParseError、ある場合はそのデータを取得する関数
    keyで渡した順番にデータが返る
    """
    try:
        data = _get_data(request, keys)
        return data
    except KeyError:
        response_data = {
            'message': make_error_text(keys)
        }
        raise ParseError(response_data) # response_dataはresponse_bodyに入る
```

実際のコードはクラス化し、いろんなメソッドに対応したりしているが、やっていることはこんな感じ。  
これを書いておくと、ネストを浅くできる。

```python
from datetime import datetime
from rest_framework.response import Response
from rest_framework import status, generics
from .shortcuts import get_params_or_400

class UserScheduleListAPI(generics.ListAPIView):

    def get(self, request, *args, **kwargs):
        start, end = get_params_or_400(request, ["start", "end"])
        try:
            start = datetime.fromisoformat(param["start"])
            end = datetime.fromisoformat(param["end"])
            if start > end:
                raise AssertionError
            return super().get(request, *args, **kwargs)
        except AssertionError:
            data = {"message": "start date larger than end."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            data = {"message": "Invalid datetime format."}
            return Response(data, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            data = {"message": f"{type(e)}:{str(e)}"}
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

## raiseで記述量を減らす

まだごちゃごちゃしている印象を受けるが、例外をraiseしていけばさらにすっきり出来る。  
`rest_framework.exceptions`に例外クラスが記述されている。

`ParseError`は400、`APIException`は500に対応している。

```python
from datetime import datetime
from rest_framework.response import Response
from rest_framework.exceptions import ParseError, APIException
from rest_framework import status, generics
from .shortcuts import get_params_or_400

class UserScheduleListAPI(generics.ListAPIView):

    def get(self, request, *args, **kwargs):
        start, end = get_params_or_400(request, ["start", "end"])
        try:
            start = datetime.fromisoformat(start)
            end = datetime.fromisoformat(end)
            if not start < end:
                raise ParseError({"message": "start date larger than end."})
            return super().get(request, *args, **kwargs)
        except ValueError:
            raise ParseError({"message": "Invalid datetime format."})
        except Exception as e:
            raise APIException({"message": f"{type(e)}:{str(e)}"})
```

最初に比べればかなり簡潔に記述出来る。


## 注意

`rest_framework.exceptions`には401に対応する`AuthenticationFailed`および`NotAuthenticated`例外が存在するが、  
auth_headerが存在しない時は403レスポンスに変換されるので注意。

`rest_framework.views.APIView.handle_exception`で確認できる。

```python

    def handle_exception(self, exc):
        """
        Handle any exception that occurs, by returning an appropriate response,
        or re-raising the error.
        """
        if isinstance(exc, (exceptions.NotAuthenticated,
                            exceptions.AuthenticationFailed)):
            # WWW-Authenticate header for 401 responses, else coerce to 403
            # (訳) WWW-Authenticate ヘッダを 401 レスポンスに対して認証し、そうでなければ 403 に強制する。
            auth_header = self.get_authenticate_header(self.request)

            if auth_header:
                exc.auth_header = auth_header
            else:
                exc.status_code = status.HTTP_403_FORBIDDEN

        exception_handler = self.get_exception_handler()

        context = self.get_exception_handler_context()
        response = exception_handler(exc, context)

        if response is None:
            self.raise_uncaught_exception(exc)

        response.exception = True
        return response
```