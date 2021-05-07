from django.db import models
from django.contrib.auth.models import User
from versatileimagefield.fields import VersatileImageField, PPOIField


# Model storing Image content
class Image(models.Model):
    image = VersatileImageField(
        'Image',
        upload_to="images/",
        ppoi_field='image_ppoi'
    )
    caption = models.TextField(max_length=100)
    title = models.CharField(max_length=100, default="Untitled")
    likes = models.IntegerField(default=0)
    shares = models.IntegerField(default=0)
    private = models.BooleanField(default=False)
    profile_picture = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    image_ppoi = PPOIField()
    owner = models.ForeignKey(
        User,
        related_name='images',
        on_delete=models.CASCADE,
        null=True
    )
