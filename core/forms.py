#!/usr/bin/env python
from django.forms import formset_factory
from core.models import Person

__author__ = 'allen'

from django import forms
class ArticleForm(forms.ModelForm):

    name = forms.CharField()
    class Meta:
        model = Person
        fields=['name',]

ArticleFormSet = formset_factory(ArticleForm, extra=2)