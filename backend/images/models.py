from django.db import models


# Model storing Image content (either file or url)
class Image(models.Model):
    image = models.FileField(null=True)
    image_data = models.BinaryField(null=True)
    caption = models.TextField(max_length=100)
