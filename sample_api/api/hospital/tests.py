import unittest
import os
import subprocess
from django.test import TestCase

class Test1(TestCase):
	def test_rendezvous_get(self):
		result = subprocess.getoutput('http --json GET http://127.0.0.1:8000/hospital/rendezvous/1/')
		expected='{"Patient": "qwer qwerty", "Doctor Name": "Kazim Kazim", "Time": "2017-04-23 22:07:39.117858+00:00"}'
		self.assertEqual(expected,result)
	def test_rendezvous_get(self):
		result = subprocess.getoutput('http --json POST http://127.0.0.1:8000/hospital/rendezvous/ patient_id=3 doctor_id=1')
		expected='{"message": "rendezvous added", "status": "OK"}'
		self.assertEqual(expected,result)
		
		
		
