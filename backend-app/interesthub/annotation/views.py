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
        uri = request.data.pop("uri")
        data = request.data
        annot = Annotation.objects.create(data=data, uri=uri)
        serializer = AnnotationSerializer(annot)
        
        resp = {}
        resp["uri"] = serializer.data["uri"]
        resp.update(serializer.data["data"])

        return Response(resp)

class AnnotationUpdate(APIView):
    def dispatch(self, request, pk, foramt=None):
        print(request.data, pk)
        try:
            uri = request.data.pop("uri")
            data = request.data
            annot = Annotation.objects.get(pk = pk)
            annot.data = data
            annot.uri = uri
            annot.save()

            serializer = AnnotationSerializer(annot)
            
            resp = {}
            resp["uri"] = serializer.data["uri"]
            resp.update(serializer.data["data"])

            return Response(resp)
        except Exception as e:
            return Response({})

    
    def delete(self, request, pk, format=None):
        try:
            annot = Annotation.objects.get(pk = pk)
            annot.delete()
            return Response({})
        except Exception as e:
            return Response({})

class AnnotationSearch(APIView):
    def get(self, request, format=None):
        uri = self.request.query_params.get('uri', None)
        limit = self.request.query_params.get('limit', None)
        annots = Annotation.objects.filter(uri = uri)[:int(limit)]
        resps = []
        for annot in annots:
            serializer = AnnotationSerializer(annot)
            resp = {}
            resp["uri"] = serializer.data["uri"]
            resp.update(serializer.data["data"])
            resps.append(resp)
        return Response(resps)