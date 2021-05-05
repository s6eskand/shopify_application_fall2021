from rest_framework import serializers
from versatileimagefield.serializers import VersatileImageFieldSerializer
from ..models import Image


class ImageSerializer(serializers.ModelSerializer):
    image = VersatileImageFieldSerializer(
        sizes=[
            ('full_size', 'url'),
            ('avatar', 'thumbnail__40x40'),
        ]
    )

    class Meta:
        model = Image
        fields = ['pk', 'title', 'image', 'caption', 'likes', 'shares', 'owner', 'profile_picture',]
