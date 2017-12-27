from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import render
from rest_framework import status
from rest_framework import viewsets, mixins
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User, Group
from content.serializers import ContentSerializer
from interesthub.permissions import CanSeeUser, IsOwner
from urllib.parse import urlparse
from urllib.request import urlopen, urlretrieve, URLopener

class UserViewSet(mixins.RetrieveModelMixin,mixins.UpdateModelMixin,viewsets.GenericViewSet):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, CanSeeUser)
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializerFull

class GroupViewSet(viewsets.ModelViewSet):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated,)
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class UserRegisterView(APIView):
    def post(self, request, format=None):
        data = request.data
        password = data.get("password", None)
        serializer = UserSerializerFull(data=data)
        if password is None:
            return Response({"error":"no given password"}, status=status.HTTP_400_BAD_REQUEST)    
        if serializer.is_valid():
            user = serializer.create(serializer.validated_data)
            user.set_password(password)
            user.save()
            print(type(user))
            serializer = UserSerializerFull(user, context={'request': request})
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FollowerView(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated,)
    def get(self, request, foramt=None):
        user = request.user
        serializer = UserSerializer(user.profile.followers.all(), many=True)
        serializer2 = UserSerializer(user.profile.follower_requests.all(), many=True)
        response = OrderedDict()
        response["followers"] = serializer.data
        response["requests"] = serializer2.data
        return Response(response)
    
    def post(self, request, format=None):
        # approve follow request
        data = request.data
        if "id" not in data:
            return Response({"error":"you should specify and id to approve follow request"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.get(pk=data["id"])
        if user in request.user.profile.follower_requests.all():
            request.user.profile.follower_requests.remove(user)
            request.user.profile.followers.add(user)
            user.profile.followings.add(request.user)
            return Response({"message": "follow request is approved."})
        return Response({"error": "no such follow request."})
        
    
    def delete(self, request, format=None):
        # remove follow request
        data = request.data
        user = request.user
        print("DELETEEE")
        if "id" not in data:
            return Response({"error":"you should specify and id to remove follow request"}, status=status.HTTP_400_BAD_REQUEST)
        
        print("DELETEEE")
        followed_user = User.objects.get(pk=data["id"])
        if followed_user in user.profile.follower_requests.all():
            user.profile.follower_requests.remove(followed_user)
            user.profile.save()
            return Response({"message": "specified user is removed from waiting follower list."})
        return Response({"error": "no such follow request."})
        

class FollowingView(APIView):
    def get(self, request, format=None):
        user = request.user
        serializer = UserSerializer(user.profile.followings, many=True)
        return Response(serializer.data)
    def post(self, request, format=None):
        #follow someone
        user = request.user
        data = request.data
        if 'id' in data:
            try:
                followed_user = User.objects.get(pk=data["id"])
                if followed_user.profile.is_public:
                    user.followings.add(followed_user.profile)
                    user.profile.followings.add(followed_user)
                    serializer = UserSerializer(followed_user)
                    return Response({"followed_user":serializer.data})
                else:
                    user.following_requests.add(followed_user.profile)
                    return Response({"message": "follow request is sent"})
            except Exception as e:
                return Response({"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"error":"you should specify and id to follow"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        # unfollow someone
        user = request.user
        data = request.data
        if 'id' in data:
            try:
                followed_user = User.objects.get(pk=data["id"])
                if followed_user.profile in user.followings.all():
                    user.followings.remove(followed_user.profile)
                    user.profile.followings.remove(followed_user)
                    user.profile.save()
                    user.save()
                    serializer = UserSerializer(followed_user)
                    return Response({"unfollowed_user":serializer.data})
                else:
                    return Response({"message": "user is not in following list."})
            except Exception as e:
                return Response({"error":str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error":"id is not specified"}, status=status.HTTP_400_BAD_REQUEST)

class UserContentsList(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, CanSeeUser)
    def get(self, request, pk, format=None):
        user = User.objects.get(pk=pk)
        serializer = ContentSerializer(user.content_owner.all(), many=True)
        return Response(serializer.data)

class UserFollowersList(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, CanSeeUser)
    def get(self, request, pk, format=None):
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user.profile.followers, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserFollowingsList(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated, CanSeeUser)
    def get(self, request, pk, format=None):
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user.profile.followings, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class MeView(APIView):
    authentication_classes = (JSONWebTokenAuthentication, )
    permission_classes = (IsAuthenticated,)
    def get(self, request, format=None):
        user = request.user
        serializer = UserSerializerFull(user, many=False, context={'request': request})
        return Response(serializer.data)
    def post(self, request, format=None):
        profile = None
        try:
            profile = request.user.profile
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        if 'file' in request.data:
            try:
                file = request.data['file']
                file._set_name("photo_%s_%s"%(str(request.user.id),file._get_name()))
                profile.photo = file
                profile.save()
                return Response({"status": "OK"})
            except KeyError:
                return Response({"error": "Request has no resource file attached"}, status=status.HTTP_400_BAD_REQUEST)

        elif 'url' in request.data:
            print("URL")
            try:
                url = request.data['url']
                name = "photo_%s_%s"%(str(request.user.id),urlparse(url).path.split('/')[-1])
                content = urlopen(url)
                profile.photo.save(name, content, save=True)
                return Response({"status": "OK"})
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "url or file field does not exist"})


