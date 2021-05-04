from django.db import models
from django.contrib.auth.models import User


# User settings model
class UserSetting(models.Model):
    owner = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )
    likes_visible = models.BooleanField(default=True)
    private = models.BooleanField(default=False)
