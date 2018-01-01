from django.test import TestCase
from django.contrib.auth.models import User
import json
from django.forms.models import model_to_dict
from .models import *
from .serializers import *

class ContentTests(TestCase):

	def setUp(self):
		self.ctype_attr = {
			"name": "testing",
			"components": ["text","number"],
			"component_names": ["title","count"]
		}

		#If we will try for a user:
		#self.user = User.objects.create_user(username="deneme",
		#	password="12345", email="deneme@gmail.com")
		#self.user.save()

		self.ctype = ContentType.objects.create(**self.ctype_attr)
		self.serializer = ContentTypeSerializer(instance=self.ctype, data=self.ctype_attr)
		
	def test_basic_content_type(self):
		self.assertTrue(self.serializer.is_valid())		
		data = self.serializer.validated_data
		
		self.assertEqual(set(data.keys()), set(["name", "components", "component_names"]))
		self.assertEqual(data["name"], self.ctype_attr["name"])
		self.assertEqual(data["components"], self.ctype_attr["components"])
		self.assertEqual(data["component_names"], self.ctype_attr["component_names"])

	def test_create_and_update_content_type(self):
		self.assertTrue(self.serializer.is_valid())		
		data = self.serializer.validated_data
		temp = self.serializer.create(data)
		self.assertEqual(temp.name, self.comp_attr["name"])
		self.assertEqual(temp.components, self.comp_attr["components"])
		self.assertEqual(temp.component_names, self.comp_attr["component_names"])

		self.serializer = ContentTypeSerializer(instance=temp, data={"name": "changed_name"})
		self.assertTrue(self.serializer.is_valid())		
		data = self.serializer.validated_data
		temp = self.serializer.update(temp, data)
		self.assertEqual(temp.name, "changed_name")
		self.assertEqual(temp.components, ["text","number"])
		self.assertEqual(temp.component_names, ["title","count"])

		#Extra test section for "Content"
		#self.c = Content.objects.create(content_type=self.ctype, owner=self.user)
		#self.c.save()
		
		#dict_obj = model_to_dict(self.c)
		#serialized = json.dumps(dict_obj)
		
		#print(serialized)
		#self.serializer = ContentSerializer(instance=self.c, data=dict_obj)
		#self.assertTrue(self.serializer.is_valid())		
		#data = self.serializer.validated_data
		
		#self.assertEqual(set(data.keys()), set(["component_type", "order"]))
		#self.assertEqual(data["component_type"], self.comp_attr["component_type"])
		#self.assertEqual(data["order"], self.comp_attr["order"])

