from django.test import TestCase
from .models import *
from .serializers import *

class Recommendation(TestCase):

	def setUp(self):
		self.r_attr = {
			"label": "test_tag",
			"description": "Tag for unit test"
		}

		self.r_comp = Tag.objects.create(**self.r_attr)
		self.serializer = TagSerializer(instance=self.r_comp, data=self.r_attr)

	def test_text_component(self):
		self.assertTrue(self.serializer.is_valid())		
		data = self.serializer.validated_data
		
		self.assertEqual(set(data.keys()), set(["label", "description"]))
		self.assertEqual(data["label"], self.r_attr["label"])
		self.assertEqual(data["description"], self.r_attr["description"])

	def test_create_and_update_tag(self):
		self.assertTrue(self.serializer.is_valid())		
		data = self.serializer.validated_data
		data["label"] = "new_tag"
		temp = self.serializer.create(data)
		self.assertEqual(temp.label, "new_tag")
		self.assertEqual(temp.description, self.r_attr["description"])

		self.serializer = TagSerializer(instance=temp, data={"label": "new_tag", "description": "tag for testing"})
		self.assertTrue(self.serializer.is_valid())		
		data = self.serializer.validated_data
		temp = self.serializer.update(temp, data)
		self.assertEqual(temp.label, "new_tag")
		self.assertEqual(temp.description, "tag for testing")
