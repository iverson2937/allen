from __future__ import unicode_literals
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from django.db import models

class Person(models.Model):
    name = models.CharField(max_length=128,verbose_name="NAME1")
    sex=models.CharField(max_length=128,null=True,blank=True)
    age= models.IntegerField(max_length=128,null=True,blank=True)
    birth=models.DateField(blank=True,null=True)
    publication_date=models.DateField(blank=True,null=True)
    def __str__(self):              # __unicode__ on Python 2
        return self.name

class Group(models.Model):
    name = models.CharField(max_length=128)
    members = models.ManyToManyField(Person, through='Membership')

    def __str__(self):              # __unicode__ on Python 2
        return self.name

class Membership(models.Model):
    person = models.ForeignKey(Person)
    group = models.ForeignKey(Group)
    date_joined = models.DateField()
    invite_reason = models.CharField(max_length=64)

class Comment(models.Model):
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    content = models.CharField(max_length=1000)


from django.db import models

class Post(models.Model):
  title = models.CharField(max_length=100)
  pub_date = models.DateTimeField(auto_now_add=True)
  content = models.TextField()

class Url(models.Model):
  title = models.CharField(max_length=100)
  pub_date = models.DateTimeField(auto_now_add=True)
  url = models.URLField(blank=True)



from django.db import models

class Publisher(models.Model):
    name = models.CharField(max_length=30)
    address = models.CharField(max_length=50)
    city = models.CharField(max_length=60)
    state_province = models.CharField(max_length=30)
    country = models.CharField(max_length=50)
    website = models.URLField()

    def __unicode__(self):
        return self.name

class Author(models.Model):
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=40)
    email = models.EmailField()

    def __unicode__(self):
        return u'%s %s' % (self.first_name, self.last_name)

class Book(models.Model):
   name = models.CharField(u'name',max_length=255,db_index = True)
   author = models.CharField(u'author',max_length=255)
   remark = models.CharField(u'remark',max_length=255)
   pub_date = models.DateTimeField(u'time',auto_now_add = True)



from django.db.models.signals import pre_save
from django.db import models
import logging
import signals
# Create your models here.

class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    is_public = models.BooleanField(default=True, blank=True)
def delete(self):
 #self.is_public = False
    signals.delete_done.send(sender=Article, obj=self)

def __unicode__(self):
    return self.title

def zhutao(sender, kwargs):
    logging.debug(kwargs)
    if"obj"in kwargs:
        obj = kwargs.get("obj")
        logging.debug(obj.is_public)
        obj.is_public = False
        obj.save()
        logging.debug("signal recieved! zhutao is called.")
        logging.debug(obj.is_public)
signals.delete_done.connect(zhutao, sender=Article)


