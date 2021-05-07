from rest_framework import (
    viewsets,
    permissions,
    views,
    response,
    status
)
from .serializers import ImageSerializer
from ..models import Image
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from usersettings.models import UserSetting


class ImageListView(views.APIView):

    def get(self, request):
        queryset = Image.objects.filter(private=False, profile_picture=False)
        serializer = ImageSerializer(queryset, many=True)
        jsonResponse = []
        for image in serializer.data:
            author = User.objects.get(id=image["owner"])
            usersettings = UserSetting.objects.get(owner=author.id)
            if not usersettings.private:
                try:
                    profile_picture = Image.objects.get(owner=author, profile_picture=True)
                except ObjectDoesNotExist:
                    profile_picture = None
                user = {"username": author.username}
                if profile_picture:
                    user["profile_picture"] = ImageSerializer(profile_picture).data["image"]["avatar"]
                image["author"] = user
                jsonResponse.append(image)
        jsonResponse.sort(key=lambda x: x["likes"] + x["shares"], reverse=True)
        return response.Response(
            data=jsonResponse,
            status=status.HTTP_200_OK
        )


class ImageNonOwnerUpdateView(views.APIView):

    def post(self, request):
        queryset = Image.objects.all()
        image = queryset.get(pk=request.data['pk'])
        image.likes += request.data['likes']
        image.shares += request.data['shares']
        image.save()
        return response.Response(
            status=status.HTTP_204_NO_CONTENT
        )


class ImageRetrieveView(views.APIView):

    def get(self, request, username=None):
        try:
            usersettings = UserSetting.objects.get(owner__username=username)
            queryset = Image.objects.filter(owner__username=username)
            image = queryset.get(title=self.request.query_params['title'])
            if image and not image.private and not usersettings.private:
                serializer = ImageSerializer(image)
                return response.Response(
                    data=serializer.data,
                    status=status.HTTP_200_OK
                )
        except ObjectDoesNotExist:
            return response.Response(
                status=status.HTTP_404_NOT_FOUND
            )
        return response.Response(
            status=status.HTTP_404_NOT_FOUND
        )


class ImageCreateView(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = ImageSerializer
    queryset = Image.objects.all()

    def create(self, request):
        if self.request.query_params["dp"] and self.request.data["profile_picture"]:
            try:
                curr = self.queryset.filter(owner=self.request.user).get(profile_picture=True)
                curr.delete()
            except ObjectDoesNotExist:
                pass
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response.Response(
                data=serializer.data,
                status=status.HTTP_201_CREATED
            )
        return response.Response(
            data={"error": "Error creating image"},
            status=status.HTTP_400_BAD_REQUEST
        )
