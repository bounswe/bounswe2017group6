"""interesthub URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import url, include
from rest_framework import routers
from group.views import GroupContentList
from content.views import *
from components.views import *
from group.views import *
from user.views import *
from recommendation.views import *
from annotation.views import *
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework.documentation import include_docs_urls
from django.conf.urls.static import static
from django.conf import settings

router = routers.DefaultRouter()
# router.register(r'content', ContentViewSet)
router.register(r'content-types', ContentTypeViewSet)
router.register(r'users', UserViewSet)
router.register(r'groups', InterestGroupViewSet)
router.register(r'tags', TagViewSet)

router.register(r'votes',UpDownViewSet)
router.register(r'comments',CommentViewSet)
# router.register(r'component',ComponentViewSet)

router.register(r'components',ComponentViewSet)
router.register(r'contents',ContentViewSet)

urlpatterns = [   
    url(r'user/(?P<pk>[0-9]+)/groups/$', UserGroupList.as_view()),
    
    url(r'group/(?P<pk>[0-9]+)/contents/$', GroupContentList.as_view()),
    url(r'group/(?P<pk>[0-9]+)/members/$', GroupMembersList.as_view()),
    url(r'group/(?P<pk>[0-9]+)/waitings/$', GroupWaitingsList.as_view()),
    url(r'group/(?P<pk>[0-9]+)/content-types/$', GroupContentTypeList.as_view()),
    url(r'group/(?P<pk>[0-9]+)/logo/$', GroupLogo.as_view()),
    url(r'group/(?P<pk>[0-9]+)/cover/$', GroupCover.as_view()),
    url(r'group/(?P<pk>[0-9]+)/search/$', SearchContentInGroup.as_view()),

    url(r'content/(?P<pk>[0-9]+)/comments/$',ContentCommentList.as_view()),
    url(r'content/(?P<pk>[0-9]+)/votes/$',ContentVoteList.as_view()),
    url(r'upload_image/(?P<pk>[0-9]+)/$',UploadImage.as_view()),
    
    url(r'^user/(?P<pk>[0-9]+)/contents/$',UserContentsList.as_view()),
    url(r'^user/(?P<pk>[0-9]+)/followers/$',UserFollowersList.as_view()),
    url(r'^user/(?P<pk>[0-9]+)/followings/$',UserFollowingsList.as_view()),
    url(r'^me/$',MeView.as_view()),

    url(r'^recommendation/users/$',RecommendUser.as_view()),
    url(r'^recommendation/groups/$',RecommendGroup.as_view()),
    url(r'^search/groups/',SearchGroup.as_view()),
    url(r'^search/users/',SearchUser.as_view()),
    url(r'^search/contents/',SearchContent.as_view()),

    url(r'^annotations/$',AnnotationCreate.as_view()),
    url(r'^annotations/(?P<pk>[0-9]+)/$',AnnotationUpdate.as_view()),
    url(r'^annotations/search/$',AnnotationSearch.as_view()),
    

    # url(r'^test/', TestView.as_view()),
    url(r'^login/$', obtain_jwt_token),
    url(r'^register/$', UserRegisterView.as_view()),
    url(r'^followers/$', FollowerView.as_view()),
    url(r'^followings/$', FollowingView.as_view()),

    url(r'^admin/', admin.site.urls),
    url(r'^api-auth/', include('rest_framework.urls')),

    url(r'^docs/', include_docs_urls(title='My API title', public=True))
]

urlpatterns = format_suffix_patterns(urlpatterns)
urlpatterns.append(url(r'^', include(router.urls)))
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
print(settings.MEDIA_URL, settings.MEDIA_ROOT)
print(static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))