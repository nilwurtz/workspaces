# ModelSerializerにAPIで認証したユーザーインスタンスを渡す

若干詰まったのでメモ。

## 環境
- Python 3.7.4
- Django 3.0.3
- django-rest-framework 3.11.0

## ModelSerializerについて
django-rest-framework(以降 DRF)では、ModelSerializerというオブジェクトを介して、Json-model間の変換を行う。
APIで受け取った値を編集して登録したり、テーブルに存在しないレコードを返したり、データの加工を行ってJson化する場合。Serializerにメソッドを追加する場合が多い。

DRFではトークン認証を行った場合、requestオブジェクトにuserインスタンスが格納される。
Serializerにuserインスタンスを渡すと、リレーション先の値を自動で入れられるので、利用シーンは多い。


## model

前提となるVisitorモデルは以下。

```python
import uuid
from django.db import models
from api.models import AppUser
from web.models import AdminUser


class Visitor(models.Model):
    class Meta:
        db_table = "visitor"
        verbose_name_plural = '訪問者'

    uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent_user = models.ForeignKey(AdminUser,
                                    on_delete=models.CASCADE,
                                    related_name='visitor')
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=255, null=True, blank=True)
    company = models.CharField(max_length=50, blank=True, null=True)
    memo = models.TextField(blank=True, null=True, max_length=300)
    visit_count = models.PositiveIntegerField(default=0)
    created_by = models.ForeignKey(AppUser,
                                   on_delete=models.SET_NULL,
                                   null=True, blank=True,
                                   related_name='visitor')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

```

## serializer

serializerはモデルと結び付いたfieldsを生成する。値を任意に変更するには、`SerializerMethodField()`でオーバーライドする。
`SerializerMethodField()`で定義したfieldは`get_<field名>`というメソッドを呼び出し、その返り値を格納する。

`get_<field名>`のメソッドは引数に`instance`を持つ。
そのため、API認証を行った際ここに渡されると思っていたのだが、ここはCreate時に作成されたインスタンスそのものが渡されるようだ。
(これを利用すれば、リレーション先のデータを自動作成も出来る。)

```python
from rest_framework.serializers import ModelSerializer, SerializerMethodField

class VisitorCreateSerializer(ModelSerializer):
    created_by = SerializerMethodField()
    parent_user = SerializerMethodField()

    class Meta:
        model = Visitor
        read_only_fields = (
            'pk',
            'created_at',
            'created_by',
        )
        fields = (
            'pk',
            'parent_user',
            'created_at',
            'name',
            'email',
            'company',
            'memo',
            'updated_at',
        )

    def get_created_by(self, instance):
        """送信したユーザーがcreated_byに格納される"""
        return str(instance.pk)

    def get_parent_user(self, instance):
        """parent_userを自動的に格納する"""
        return str(instance.parent_user.pk)
```

## ViewSet

Viewにおいて、Serializerをインスタンス化する部分があるので、ここでinstanceにuserを渡せばOK.
今回はcreateだけserializerを分けたかったのでcreateメソッドをオーバーライドして、Serializerを指定している。

```python
# DRF
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import VisitorSerializer, VisitorCreateSerializer
from .models import Visitor
from utils.auth.authentication import APIAuthentication
from rest_framework.response import Response


class VisitorViewSet(viewsets.ModelViewSet):
    serializer_class = VisitorSerializer # create以外に使用するserializer
    queryset = Visitor.objects.all()

    authentication_classes = (APIAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # API認証した場合,userインスタンスはrequest.userに格納される。
        admin = self.request.user.parent_user
        qs = Visitor.objects.filter(parent_user=admin)
        return qs

    # createメソッドをオーバーライド
    def create(self, request, *args, **kwargs):
        # Serializerにrequest.userを渡すと、get_<field名>メソッドにinstanceが渡る
        serializer = VisitorCreateSerializer(instance=request.user, data=request.data)
        # ここから下はそのまま
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
```
