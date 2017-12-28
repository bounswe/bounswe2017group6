from .models import *
from rest_framework import serializers

class AnnotationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Annotation
        fields = ('uri', 'data',)
