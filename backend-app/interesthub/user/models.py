from django.db import models
from django.contrib.auth.models import User, Group

# Create your models here.
class UserProfile(models.Model):

    owner = models.OneToOneField(User, on_delete=models.CASCADE, null=False, related_name="profile")

    followers = models.ManyToManyField(User, related_name="followings")
    followings = models.ManyToManyField(User, related_name="followers")
    follower_requests = models.ManyToManyField(User, related_name="following_requests")

    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=30)
    lastname = models.CharField(max_length=30)
    birthdate = models.DateField(null=True, blank=True)

    MAN = "man"
    WOMAN = "woman"
    OTHER = "other"
    NOT_SPECIFIED = "notspecified"
    GENDER_CHOICES = (
        (MAN, "Man"),
        (WOMAN, "Woman"),
        (OTHER, "Other"),
        (NOT_SPECIFIED, "Not-specified")
    )

    gender = models.CharField(max_length=12, choices=GENDER_CHOICES, blank=True, null=True)
    contacts = models.CharField(max_length=150, default="")
    about = models.TextField(default="")
    photo = models.ImageField(
        upload_to='user/',
        max_length=254, blank=True, null=True
    )
    is_public = models.BooleanField(default=False)
    facebook_account = models.CharField(max_length=30, null=True, blank=True)
    twitter_account = models.CharField(max_length=30, null=True, blank=True)
    instagram_account = models.CharField(max_length=30, null=True, blank=True)

    def __str__(self):
        return self.name + " " + self.lastname + "(" + str(self.owner.id) + ")" 

    