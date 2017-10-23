from django.contrib.auth.models import User, Group
from .models import DummyText
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'id', 'username', 'email', 'groups')

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'id', 'name')

class DummyTextSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DummyText
        fields = ('id', 'text')
