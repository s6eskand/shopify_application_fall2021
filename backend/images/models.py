from django.db import models
from versatileimagefield.fields import VersatileImageField, PPOIField


# Model storing Image content (either file or url)
class Image(models.Model):
    image = VersatileImageField(
        'Image',
        upload_to="images/",
        ppoi_field='image_ppoi'
    )
    caption = models.TextField(max_length=100)
    title = models.CharField(max_length=100, default="Untitled")
    image_ppoi = PPOIField()
