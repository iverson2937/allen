from __future__ import unicode_literals

from django.db import models

class Account(models.Model):
    name=models.CharField(max_length=255)
    description=models.CharField(max_length=255,blank=True)

class Project(models.Model):
    name=models.CharField(max_length=255)
    description=models.CharField(max_length=255,blank=True)
    owners=models.ManyToManyField(Account,through='Projects')

class Projects(models.Model):
    name=models.CharField(max_length=255)
    description=models.CharField(max_length=255,blank=True)
    owners=models.ForeignKey(Account)
    project=models.ForeignKey(Project)



