from content.models import Content
from group.models import InterestGroup
from django.contrib.auth.models import User
from .models import Tag
from user.models import UserProfile
from components.models import *

def search_user(query, limit=5):
    # print(UserProfile.objects.select_related('owner').filter(name=query))
    users = set()
    profiles = UserProfile.objects.filter(name__icontains=query).select_related('owner')
    for profile in profiles:
        users.add(profile.owner)
    if len(users)<limit:
        profiles = UserProfile.objects.filter(about=query).select_related('owner')[:limit-len(users)]
        for profile in profiles:
            users.add(profile.owner)
    
    if len(users)<limit:
        tag = Tag.objects.filter(label=query)
        if tag.exists():
            tag=tag.first()
            for profile in tag.users.all():
                users.add(profile.owner)
                if len(users)>=limit:
                    break
    
    if len(users)<limit:
        tags = Tag.objects.filter(label__icontains=query)
        for tag in tags:
            for profile in tag.users.all():
                users.add(profile.owner)
                if len(users) >= limit:
                    break
            if len(users) >= limit:
                break
    return users

def search_group(query, limit=5):
    groups = InterestGroup.objects.filter(name__icontains=query)
    groups.union( InterestGroup.objects.filter(description__icontains=query) )
    
    if len(groups)<limit:
        tag = Tag.objects.filter(label=query)
        if tag.exists():
            tag=tag.first()
            groups.union(tag.groups.all()[:limit-len(groups)])

    if len(groups)<limit:
        tags = Tag.objects.filter(label__icontains=query)
        for tag in tags:
            groups = (tag.groups.all()[:limit-len(groups)])
            if len(groups) >= limit:
                break

    return groups

def search_content(query, group=None, limit=5):

    if group is None:
        all_contents = Content.objects
    else:
        all_contents = group.contents

    contents = all_contents.filter(components__text__data__icontains=query)
    contents = contents.union(all_contents.filter(components__longtext__data__icontains=query))
    contents = contents.union(all_contents.filter(components__checkbox__selecteds__title__icontains=query))
    contents = contents.union(all_contents.filter(components__dropdown__selected__title__icontains=query))
    contents = contents.union(all_contents.filter(content_type__name__icontains=query))
    contents = contents.union(all_contents.filter(tags__label=query))
    contents = contents.union(all_contents.filter(tags__label__icontains=query))

    return contents[:limit]




    
    
    
