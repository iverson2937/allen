from core import views

__author__ = 'allen'
#!/usr/bin/env python
# -*- coding: UTF-8 -*-
from django.conf.urls import url

urlpatterns = [
    url(r'^test/$', views.MyView.as_view(),
        name='goldcap_chart_action'),


]
