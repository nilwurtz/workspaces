# 導入する
<プロジェクトフォルダ>/<アプリケーションフォルダ>/内に`templatetags`ディレクトリを作成  
このアプリケーションは`settings.py`のINSTALLED_APPに記述する必要がある。

<任意の名前>.pyのファイルを作成
ここでの<任意の名前>はtemplate内で{% load <任意の名前> %}とするので注意

# フィルタを作成
今回は、datetime型の値を受け取って、それが直近一週間かどうかを判定するフィルタを作成する。  
このフィルタを用いてif文を分岐させるので、返り値はboolにする。

```python:..templatetags/sample_filter.py
"""
dateが直近一週間かどうか判別するテンプレートタグ
"""
import datetime

from django import template
from django.utils import timezone

register = template.Library()


@register.filter(expects_localtime=True)
def is_new(dt: datetime.datetime):
    # newかどうかの基準日
    criteria_date = timezone.now() - datetime.timedelta(weeks=1)
    return dt >= criteria_date
```
- `expects_localtime=True`について  
公式Docより

> If you write a custom filter that operates on datetime objects, you'll usually register it with the expects_localtime flag set to True:
>> 日時オブジェクトを操作するカスタムフィルターを作成する場合、通常は、expects_localtimeフラグをTrueに設定して登録します。

> When this flag is set, if the first argument to your filter is a time zone aware datetime, Django will convert it to the current time zone before passing it to your filter when appropriate, according to rules for time zones conversions in templates.
>> このフラグが設定されている場合、フィルターの最初の引数がタイムゾーン対応の日時である場合、Djangoはテンプレートのタイムゾーン変換の規則に従って、適切なときにフィルターに渡す前に現在のタイムゾーンに変換します。

https://docs.djangoproject.com/ja/2.2/howto/custom-template-tags/

- `@register.filter(name='foo')`としてやると、template内ではfooという名前でフィルタが利用出来る。  
name引数を渡さない場合、関数名をそのままフィルタで使用する。

# template
template内では以下のように利用する。  
お知らせ一覧を表示し、一週間以内であればnew!バッジをつける例。bootstrapを使用している。  
contextにnewかどうかを判断したboolを渡すより、かなりすっきりする。

```html
{% load sample_filter %}
    ...
    {% for news in news_list %}
    <a href="{% url 'news:detail' news.pk %}" class="list-group-item list-group-item-action">
    <span>{{ news.publish_time |date:"Y年m月d日 H:i" }}</span>
    <span class="badge badge-primary">{{ news.category }}</span>
    {{ news.subject }}
    {% if news.publish_time|is_new %}
    <span class="badge badge-info badge-new">new!</span>
    {% endif %}
    </a>
    {% empty %}
    <p>お知らせはありません。</p>
    {% endfor %}
    ...
```

## 他
上のコード中で利用しているdateフィルタのように、フィルタは引数をとることもできる。

公式Docの引用になるが、

```python
def cut(value, arg):
    """Removes all values of arg from the given string"""
    return value.replace(arg, '')
```

```html
{{ somevariable|cut:"0" }}
```

として使える。get_context_dataなどが肥大化していく際は、テンプレートフィルタを利用するのも一つの手だろう。
