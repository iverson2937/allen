#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from core.models import *
from django.contrib import admin
class AuthorAdmin(admin.ModelAdmin):
    list_display=('name', 'age', 'sex')   #指定要显示的字段
    search_fields=('name',)               #指定要搜索的字段，将会出现一个搜索框让管理员搜索关键词
    list_filter = ('publication_date',)   #指定列表过滤器，右边将会出现一个快捷的日期过滤选项，
                      #以方便开发人员快速地定位到想要的数据，同样你也可以指定非日期型类型的字段


    date_hierarchy = 'birth'              #日期型字段进行层次划分。
    ordering = ('-birth','age')           #对出生日期降序排列，对年级升序
    # fields = ('name','sex','age','birth','type')    #自定义编辑表单，在编辑表单的时候 显示哪些字段，显示的属性
    # # 分组表单
    # fieldsets = (
    #     ('基本信息', {'fields': ('title', 'content', 'excerpt', 'publish_date','status', 'user', 'categories')}),
    #     ('Meta Data', {'fields': ('alias', 'keywords', 'description')}),
    # )
admin.site.register(Person,AuthorAdmin)

admin.site.register(Book)



