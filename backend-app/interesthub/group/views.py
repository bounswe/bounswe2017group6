from django.shortcuts import render
from .models import InterestGroup
from .serializers import *
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from content.serializers import ContentSerializer, ContentTypeSerializer
from content.models import *
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import status
from content.utils import retrieve_content_set, create_content
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from interesthub.permissions import canSeeGroup, CanSeeUser, IsAdminOf
from urllib.parse import urlparse
from urllib.request import urlopen, urlretrieve, URLopener

# Create your views here.
class InterestGroupViewSet(ModelViewSet):
    queryset = InterestGroup.objects.all()
    serializer_class = InterestGroupSerializer

class GroupContentList(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, canSeeGroup)
    def get(self, request, pk, format=None):
        try:
            igroup = InterestGroup.objects.get(pk=pk)
            print(igroup)
            serializer = ContentSerializer(igroup.contents.all(), many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, pk, format=None):
        try:
            igroup = InterestGroup.objects.get(pk=pk)
            serializer = ContentSerializer(igroup.contents, many=False, data=request.data, context={"request": request})
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            content = serializer.create(serializer.validated_data)
            igroup.contents.add(content)

            for tag in content.tags.all():
                igroup.content_tags.add(tag)

            igroup.save()
            
            return Response(ContentSerializer(content,context={'request':request}).data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        try:
            igroup = InterestGroup.objects.get(pk=pk)
            data = request.data
            content = Content.objects.get(pk=data["id"])
            if content in igroup.contents.all():
                igroup.contents.remove(content)
                return Response({"message": "content is removed from the group."})
            else:
                return Response({"error": "content does not exist in this group."})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GroupContentTypeList(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, canSeeGroup)
    def get(self, request, pk, format=None):
        try:
            igroup = InterestGroup.objects.get(pk=pk)
            serializer = ContentTypeSerializer(igroup.content_types, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, pk, format=None):
        try:
            igroup = InterestGroup.objects.get(pk=pk)
            serializer = ContentTypeSerializer(igroup.content_types, many=False, data=request.data, context={"request": request})
            if serializer.is_valid():
                s = serializer.create(request.data)
                igroup.content_types.add(s)
                return Response(ContentTypeSerializer(s, many=False, context={"request": request}).data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk, format=None):
        try:
            igroup = InterestGroup.objects.get(pk=pk)
            data = request.data
            content = ContentType.objects.get(pk=data["id"])
            if content in igroup.content_types.all():
                igroup.content_types.remove(content)
                return Response({"message": "content type is removed from the group."})
            else:
                return Response({"error": "content type does not exist in this group."})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GroupMembersList(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, canSeeGroup)
    def get(self, request, pk, format=None):
        try:
            igroup = InterestGroup.objects.get(pk=pk)
            serializer = UserSerializer(igroup.members, many=True, context={'request': request})
            print(serializer.data)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    def post(self, request, pk, format=None):
        igroup = None
        try:
            igroup = InterestGroup.objects.get(pk=pk)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        if igroup.is_public:
            if request.user not in igroup.members.all():
                igroup.members.add(request.user)
                igroup.save()
                return Response({"message":"user is joined this group."})
            else:
                return Response({"message":"user has already joined this group."})
        else:
            if request.user not in igroup.waitings.all():
                igroup.waitings.add(request.user)
                igroup.save()
                return Response({"message":"join request is sent."})
            else:
                return Response({"message":"user has already sent a join request to this group."})
        
    def delete(self, request, pk, format=None):
        try:
            igroup = InterestGroup.objects.get(pk=pk)
            if request.user in igroup.members.all():
                igroup.members.remove(request.user)
                igroup.save()
                return Response({"message":" user is removed from this group."})
            elif request.user in igroup.waitings.all():
                igroup.waitings.remove(request.user)
                igroup.save()
                return Response({"message": "join request is removed."})
            else:
                return Response({"message": "there is no relation to remove."})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GroupWaitingsList(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, IsAdminOf)
    def get(self, request, pk, format=None):
        try:
            igroup = InterestGroup.objects.get(pk=pk)
            serializer = UserSerializer(igroup.waitings, many=True, context={'request': request})
            print(serializer.data)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    def post(self, request, pk, format=None):
        data = request.data
        igroup = None
        print(data, 'id' in data)
        try:
            igroup = InterestGroup.objects.get(pk=pk)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        if 'id' in data:
            try:
                joined_user = User.objects.get(pk=data["id"])
                if joined_user in igroup.waitings.all():
                    igroup.waitings.remove(joined_user)
                    igroup.members.add(joined_user)
                    igroup.save()
                    return Response({"message":"join request is approved."})
                else:
                    return Response({"error":"no such join request."})
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error":"you should specify an id to approve request"}, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk, format=None):
        data = request.data
        igroup = None
        try:
            igroup = InterestGroup.objects.get(pk=pk)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        if 'id' in data:
            try:
                removed_user = User.objects.get(pk=data["id"])
                if removed_user in igroup.waitings.all():
                    igroup.waitings.remove(removed_user)
                    igroup.save()
                    return Response({"message":"join request is removed."})
                else:
                    return Response({"error":"no such join request."})
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error":"you should specify an id to approve request"}, status=status.HTTP_400_BAD_REQUEST)

class UserGroupList(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated,)
    def get(self, request, pk, format=None):
        # groups = InterestGroup.objects.all()
        user = request.user
        groups = user.interest_groups.all()
        serializer = InterestGroupSerializer(groups, many=True, context={'request': request})
        print(serializer.data)
        return Response(serializer.data)

class GroupLogo(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, IsAdminOf)
    def post(self, request, pk, format=None):
        group = None
        try:
            group = InterestGroup.objects.get(pk=pk)
            print(group)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        if 'file' in request.data:
            print("FILE")
            try:
                file = request.data['file']
                file._set_name("logo_%s_%s"%(str(group.id),file._get_name()))
                group.logo_img = file
                group.save()
                return Response({"status": "OK"})
            except KeyError:
                return Response({"error": "Request has no resource file attached"}, status=status.HTTP_400_BAD_REQUEST)

        elif 'url' in request.data:
            print("URK")
            try:
                url = request.data['url']
                name = "logo_%s_%s"%(str(group.id),urlparse(url).path.split('/')[-1])
                content = urlopen(url)
                group.logo_img.save(name, content, save=True)
                return Response({"status": "OK"})
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "url or file field does not exist"})

class GroupCover(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, IsAdminOf)
    def post(self, request, pk, format=None):
        group = None
        try:
            group = InterestGroup.objects.get(pk=pk)
            print(group)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        if 'file' in request.data:
            try:
                file = request.data['file']
                file._set_name("cover_%s_%s"%(str(group.id),file._get_name()))
                group.cover_img = file
                group.save()
                return Response({"status": "OK"})
            except KeyError:
                return Response({"error": "Request has no resource file attached"}, status=status.HTTP_400_BAD_REQUEST)
        elif 'url' in request.data:
            print("URK")
            try:
                url = request.data['url']
                name = "logo_%s_%s"%(str(group.id),urlparse(url).path.split('/')[-1])
                content = urlopen(url)
                group.cover_img.save(name, content, save=True)
                return Response({"status": "OK"})
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "url or file field does not exist"})
