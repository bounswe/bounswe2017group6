from rest_framework import serializers
from components.serializers import ComponentSerializer, ComponentSerializer2
from .models import *
from django.contrib.auth.models import User
from group.serializers import UserSerializer
from components.models import Component
from collections import OrderedDict
from django.contrib.auth.models import User
from recommendation.serializers import TagSerializer
from recommendation.models import Tag

class DropdownItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DropdownItem
        fields = ('id', 'title')

class DropdownDefinitionSerializer(serializers.HyperlinkedModelSerializer):
    items = DropdownItemSerializer(many=True)
    class Meta:
        model = DropdownDefinition
        fields = ('id', 'name', 'items')

    def create(self, validated_data):
        print("DROPDOWN CREATE", validated_data)
        data = validated_data.pop('items')
        dropdown = DropdownDefinition.objects.create(**validated_data)
        for item in data:
            DropdownItem.objects.create(dropdown = dropdown, **item)
        return dropdown

class CheckboxItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CheckboxItem
        fields = ('id', 'title')

class CheckboxDefinitionSerializer(serializers.HyperlinkedModelSerializer):
    items = CheckboxItemSerializer(many=True)
    class Meta:
        model = CheckboxDefinition
        fields = ('id', 'name', 'items')

    def create(self, validated_data):
        print("CHECKBOX CREATE", validated_data)
        data = validated_data.pop('items')
        checkbox = CheckboxDefinition.objects.create(**validated_data)
        for item in data:
            CheckboxItem.objects.create(checkbox = checkbox, **item)
        return checkbox


class ContentTypeSerializer(serializers.HyperlinkedModelSerializer):
    checkboxes = CheckboxDefinitionSerializer(many=True, required=False)
    dropdowns = DropdownDefinitionSerializer(many=True, required=False)
    class Meta:
        model = ContentType
        fields = ("id", "name", "components", "component_names", "checkboxes", "dropdowns")
    
    def create(self, validated_data):
        print("CT", validated_data)
        checkbox_data = validated_data.pop('checkboxes', [])
        dropdown_data = validated_data.pop('dropdowns', [])
        ct = ContentType.objects.create(**validated_data)
        for checkbox in checkbox_data:
            print(checkbox)
            serializer = CheckboxDefinitionSerializer(data=checkbox, context=self.context)
            if serializer.is_valid():
                ct.checkboxes.add(serializer.create(serializer.validated_data))
        
        for dropdown in dropdown_data:
            print(dropdown)
            serializer = DropdownDefinitionSerializer(data=dropdown, context=self.context)
            if serializer.is_valid():
                ct.dropdowns.add(serializer.create(serializer.validated_data))
        
        return ct

class ContentSerializer(serializers.HyperlinkedModelSerializer):
    components = ComponentSerializer2(many=True)
    owner = UserSerializer(read_only=True, allow_null=False, many=False)
    content_type = ContentTypeSerializer(read_only=True, allow_null=True, many=False)
    tags = TagSerializer(many=True, read_only=False)
    groups = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Content
        fields = ("id", "content_type", "created_date", "modified_date", "owner", 'components', 'tags', 'groups')
    
    def to_internal_value(self, data):
        data = data.copy()
        validated_data = OrderedDict()
        print("to_internal_value")
        try:
            if not ContentType.objects.filter(id=data['content_type_id']).exists():
                raise serializers.ValidationError("No content type with given content_type_id.")
            content_type = ContentType.objects.get(pk=data['content_type_id'])
            validated_data["content_type_id"] = data["content_type_id"]

            validated_data["components"] = []

            if len(data["components"]) != len(content_type.components):
                raise serializers.ValidationError("Number of components does not match with content type.")

            for component in data["components"]:
                print('comp:', component)
                serializer = ComponentSerializer2(data=component, context=self.context)
                if not serializer.is_valid():
                    print("ehehe")
                    print(serializer.errors)
                    error = serializer.errors
                    raise serializers.ValidationError(error)
                if component["component_type"] != content_type.components[component["order"]-1]:
                    print("ohoho")
                    raise serializers.ValidationError("Order of the components does not match with content type")

                print("end")
                print("END BUT: ", serializer.validated_data)
                validated_data["components"].append(component)
        
        except Exception as e:
            if not self.partial:
                raise serializers.ValidationError(str(e))

        # print("to_internal_value")

        try:
            if "tags" in data:
                validated_data["tags"] = []
            for tag in data["tags"]:
                t = Tag.objects.filter(label=tag["label"])
                if t.exists():
                    validated_data["tags"].append(tag)
                else:
                    serializer = TagSerializer(data = tag)
                    if serializer.is_valid():
                        validated_data["tags"].append(serializer.validated_data)
                    else:
                        ValidationError(serializer.errors)
        except Exception as e:
            if not self.partial:
                raise serializers.ValidationError(str(e))

        return validated_data
    
    def create(self, validated_data):
        data = validated_data.copy()
        tags_data = data.pop("tags")
        content = Content.objects.create(owner=self.context["request"].user, content_type_id=data["content_type_id"])
        for comp_data in data["components"]:
            serializer = ComponentSerializer2(data=comp_data, context=self.context)
            if serializer.is_valid():
                comp = serializer.create(serializer.validated_data)
                comp.save()
                content.components.add(comp)
        content.save()

        for tag_data in tags_data:
            tag = Tag.objects.filter(label=tag_data["label"])
            if tag.exists():
                tag = tag.first()
            else:
                serializer = TagSerializer(data=tag_data)
                if serializer.is_valid():
                    tag = serializer.create(serializer.validated_data)
            content.tags.add(tag)
        content.save()
        return content
    
    def update(self, instance, validated_data):
        print("---update---")
        data = validated_data.copy()

        instance.owner_id = data.get("owner_id",instance.owner_id)
        instance.content_type_id = data.get("content_type_id", instance.content_type_id)
        instance.save()

        if "components" in data:
            for comp_data in data["components"]:
                comp = instance.components.filter(order = comp_data["order"]).first()
                serializer = ComponentSerializer2(comp, many=False, data=comp_data, context=self.context)
                if serializer.is_valid():
                    comp = serializer.update(comp, serializer.validated_data)
        instance.save()

        print(data)
        
        if "tags" in data:
            tag_ids = []
            print("we have some tags")
            tags_data = data["tags"]
            for tag_data in tags_data:
                tag = Tag.objects.filter(label=tag_data["label"])
                if tag.exists():
                    tag = tag.first()
                    t = instance.tags.filter(id=tag.id)
                    if t.exists():
                        tag_ids.append(tag.id)
                        continue
                else:
                    serializer = TagSerializer(data=tag_data)
                    if serializer.is_valid():
                        tag = serializer.create(serializer.validated_data)
                tag_ids.append(tag.id)
                instance.tags.add(tag)
            for tag in instance.tags.all():
                if tag.id not in tag_ids:
                    instance.tags.remove(tag)
        instance.save()
        return instance

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    owner = UserSerializer(read_only=True, allow_null=False, many=False)
    content = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "created_date", "modified_date", "text", "owner", "content",)
        read_only_fields = ["owner", "created_date", "modified_date", "content"]

    def to_internal_value(self, data):
        validated_data = OrderedDict()
        if "text" in data:
            validated_data["text"] = data["text"]
        elif not self.partial:
            raise serializers.ValidationError("text field is not found")
        if "content_id" in data:
            validated_data["content_id"] = data["content_id"]
        elif not self.partial:
            raise serializers.ValidationError("content_id is not found")
        return validated_data

    def create(self, validated_data):
        print('val:', validated_data)
        comment = Comment.objects.create(**validated_data, owner=self.context["request"].user)
        return comment

    def update(self, instance, validated_data):
        print(instance)
        instance.text = validated_data.get('text', instance.text)
        instance.owner = self.context["request"].user
        instance.save()
        return instance

class UpDownSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    content = serializers.PrimaryKeyRelatedField(many=False, read_only=True)

    class Meta:
        model = UpDown
        fields = ('id', 'isUp', 'owner', 'content',)
    
    def to_internal_value(self, data):
        validated_data = OrderedDict()
        if "isUp" in data:
            validated_data["isUp"] = data["isUp"]
        elif not self.partial:
            raise serializers.ValidationError("isUp field is not found")
        if "content_id" in data:
            validated_data["content_id"] = data["content_id"]
        elif not self.partial:
            raise serializers.ValidationError("content_id is not found")
        return validated_data
    
    def create(self, validated_data):
        print(validated_data)
        t = UpDown.objects.filter(owner=self.context["request"].user, content_id=validated_data["content_id"])
        if t.exists():
            return t.first()
        upDown = UpDown.objects.create(**validated_data, owner=self.context["request"].user)
        return upDown
    
    def update(self, instance, validated_data):
        instance.isUp = validated_data.get('isUp', instance.isUp)
        instance.owner = self.context["request"].user
        instance.save()
        return instance
