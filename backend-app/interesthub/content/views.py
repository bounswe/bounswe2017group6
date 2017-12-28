from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .utils import *
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from interesthub.permissions import canSeeContent

class ContentTypeViewSet(viewsets.ModelViewSet):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated,)
    queryset = ContentType.objects.all()
    serializer_class = ContentTypeSerializer

class ContentViewSet(viewsets.ModelViewSet):
    # authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, canSeeContent)
    queryset = Content.objects.order_by('created_date')
    serializer_class = ContentSerializer

class ContentCommentList(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, canSeeContent)
    def get(self, request, pk, format=None):
        try:
            content = Content.objects.get(pk=pk)
            serializer = CommentSerializer(content.comments.all(), many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, pk, format=None):
        try:
            content = Content.objects.get(pk=pk)
            data = request.data
            data["content_id"] = pk
            serializer = CommentSerializer(data=data, context={"request": request})
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            comment = serializer.create(serializer.validated_data)
            content.comments.add(comment)
            content.save()
            return Response(CommentSerializer(comment,context={'request':request}).data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ContentVoteList(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, canSeeContent)
    def get(self, request, pk, format=None):
        try:
            content = Content.objects.get(pk=pk)
            serializer = UpDownSerializer(content.votes.all(), many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, pk, format=None):
        try:
            content = Content.objects.get(pk=pk)
            data = request.data
            data["content_id"] = pk

            vote = UpDown.objects.filter(owner=request.user, content_id=pk)
            if vote.exists():
                vote = vote.first()
                serializer = UpDownSerializer(vote, data=data, context={"request": request})
                if serializer.is_valid():
                    print("validd")
                    serializer.update(vote, serializer.validated_data)
                    return Response(UpDownSerializer(vote,context={'request':request}).data)
                else:
                    print("not validd")
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)        

            serializer = UpDownSerializer(data=data, context={"request": request})
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            vote = serializer.create(serializer.validated_data)
            content.votes.add(vote)
            content.save()
            return Response(UpDownSerializer(vote,context={'request':request}).data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class UpDownViewSet(viewsets.ModelViewSet):
    queryset = UpDown.objects.all()
    serializer_class = UpDownSerializer
