## リレーション先取得した値をsortする方法

```python:view.py
from django.db.models import Prefetch

    def get_queryset(self):
        parent_user = self.get_parent_user()
        queryset = Groups.objects.filter(parent_user=parent_user).prefetch_related(
            Prefetch('appuser_set', queryset=AppUser.objects.order_by('hira_last_name')))
        return queryset
```
