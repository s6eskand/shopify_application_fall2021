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


class UserProfileRetrieveView(views.APIView):

    def get(self, request, username=None):
        usersetting = UserSetting.objects.get(owner__username=username)
        profile = UserSettingSerializer(usersetting).data
        imagesqueryset = Image.objects.filter(owner__username=username)
        images = ImageSerializer(imagesqueryset, many=True).data
        jsonResponse = {
            "profile": profile,
            "images": images
        }
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
        serializer = UserSettingSerializer(usersetting)
        return response.Response(
            data=serializer.data,
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
