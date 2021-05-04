from rest_framework import (
    status,
    response,
    views,
    permissions
)
from ..models import UserSetting
from .serializers import UserSettingSerializer


class UserSettingRetrieveUpdateView(views.APIView):

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    def get(self, request):
        usersetting = UserSetting.objects.get(owner=self.request.user)
        serializer = UserSettingSerializer(usersetting)
        return response.Response(
            data=serializer,
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
