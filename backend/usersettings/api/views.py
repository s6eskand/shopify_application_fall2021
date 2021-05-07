from rest_framework import (
    status,
    response,
    views,
    permissions
)
from ..models import UserSetting
from images.models import Image
from images.api.serializers import ImageSerializer
from .serializers import UserSettingSerializer
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User


class UserProfileRetrieveView(views.APIView):

    def get(self, request, username=None):
        usersetting = UserSetting.objects.get(owner__username=username)
        profile = UserSettingSerializer(usersetting).data
        profile["username"] = username
        imagesqueryset = Image.objects.filter(owner__username=username).order_by("timestamp__minute")
        try:
            profile_picture = imagesqueryset.get(profile_picture=True)
            profile_picture_url = ImageSerializer(profile_picture).data["image"]["full_size"]
            profile["profile_picture"] = profile_picture_url
        except ObjectDoesNotExist:
            profile["profile_picture"] = None
        imagesqueryset = imagesqueryset.filter(profile_picture=False)
        images = ImageSerializer(imagesqueryset, many=True).data
        jsonResponse = {
            "profile": profile,
            "images": images
        }
        for image in images:
            author = User.objects.get(id=image["owner"])
            try:
                profile_picture = Image.objects.get(owner=author, profile_picture=True)
            except ObjectDoesNotExist:
                profile_picture = None
            user = {"username": author.username}
            if profile_picture:
                user["profile_picture"] = ImageSerializer(profile_picture).data["image"]["avatar"]
            image["author"] = user
        if usersetting.private:
            jsonResponse["images"] = []
            return response.Response(
                data=jsonResponse,
                status=status.HTTP_200_OK
            )
        return response.Response(
            data=jsonResponse,
            status=status.HTTP_200_OK
        )


class UserSettingRetrieveUpdateView(views.APIView):

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request):
        usersetting = UserSetting.objects.get(owner=self.request.user)
        usersettingdata = UserSettingSerializer(usersetting).data
        usersettingdata["username"] = self.request.user.username
        imagequeryset = Image.objects.filter(owner=self.request.user, profile_picture=False).order_by("timestamp__minute")
        imagedata = ImageSerializer(imagequeryset, many=True).data
        try:
            profile_picture = Image.objects.get(owner=self.request.user, profile_picture=True)
            usersettingdata["profile_picture"] = ImageSerializer(profile_picture).data["image"]["full_size"]
        except ObjectDoesNotExist:
            usersettingdata["profile_picture"] = None
        jsonResponse = {
            "profile": usersettingdata,
            "imagedata": imagedata
        }
        return response.Response(
            data=jsonResponse,
            status=status.HTTP_200_OK
        )

    def put(self, request):
        usersetting = UserSetting.objects.get(owner=self.request.user)
        serializer = UserSettingSerializer(usersetting, request.data)
        if serializer.is_valid():
            serializer.save()
            return response.Response(
                data=serializer.data,
                status=status.HTTP_200_OK
            )
        return response.Response(
            data={"error": "Invalid request body"},
            status=status.HTTP_400_BAD_REQUEST
        )
