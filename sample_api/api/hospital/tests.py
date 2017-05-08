import unittest
import os
import subprocess
from django.test import TestCase

class Test2(TestCase):
def test_patient_get(self):
 		patientName = subprocess.getoutput('http --json GET http://127.0.0.1:8000/hospital/patient/1/')
 		expected='{"Patient": "qwer qwerty"}
 		self.assertEqual(expected,patientName)
class Test3(TestCase):
def test_doctor_post(self):
 		doctorName = subprocess.getoutput('http --json POST http://127.0.0.1:8000/hospital/doctor/ doctor_id=2 name="mehmet" lastname="kısa" age=41')
 		expected='{"message": "doctor added", "status": "OK"}'
 		self.assertEqual(expected,doctorName)
 		
