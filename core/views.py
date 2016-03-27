from datetime import date
from core.forms import ArticleForm,ArticleFormSet
from core.models import *
from django.db.models import QuerySet, Count
from django.shortcuts import render

# Create your views here.
from django.views.generic import FormView, TemplateView, CreateView


class MyView(TemplateView):
    template_name = 'test.html'

    def get_context_data(self, **kwargs):
        context=super(MyView, self).get_context_data(**kwargs)

        Book.objects.values('author').annotate(dcount=Count('author'))


