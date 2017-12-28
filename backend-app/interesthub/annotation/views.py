from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.views import APIView

# # Create your views here.
# class AnnotationViewSet(viewsets.ModelViewSet):
#     queryset = Annotation.objects.all()
#     serializer_class = AnnotationSerializer

class AnnotationCreate(APIView):
    def post(self, request, format=None):
        print(request.data)
        return Response(request.data)

class AnnotationUpdate(APIView):
    def update(self, request, pk, foramt=None):
        print(request.data)
        return Response(request.data)
    
    def delete(self, request, pk, format=None):
        print(pk)
        return Response({"message":"ok"})

class AnnotationSearch(APIView):
    def get(self, request, format=None):
        print(request.data)
        return Response(request.data)