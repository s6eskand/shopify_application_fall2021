from rest_framework import (
    viewsets,
    permissions,
    generics,
    views,
    response,
    status
)
from .serializers import ImageSerializer
from ..models import Image
from django.contrib.auth.models import User


class ImageListView(views.APIView):

    def get(self, request):
        queryset = Image.objects.filter(private=False)
        serializer = ImageSerializer(queryset, many=True)
        jsonResponse = serializer.data
        for image in jsonResponse:
            author = User.objects.get(id=image["owner"])
            image["author"] = author.username
        return response.Response(
            data=jsonResponse,
            status=status.HTTP_200_OK
        )


class ImageNonOwnerUpdateView(views.APIView):

    def post(self, request):
        queryset = Image.objects.all()
        image = queryset.get(pk=request.data['pk'])
        image.likes = request.data['likes']
        image.shares = request.data['shares']
        image.save()
        return response.Response(
            status=status.HTTP_204_NO_CONTENT
        )


class ImageRetrieveView(views.APIView):

    def get(self, request, username=None):
        queryset = Image.objects.filter(owner__username=username)
        image = queryset.get(title=self.request.query_params['title'])
        if image and not image.private:
            serializer = ImageSerializer(image)
            return response.Response(
                data=serializer.data,
                status=status.HTTP_200_OK
            )
        return response.Response(
            status=status.HTTP_404_NOT_FOUND
        )


class ImageCreateUpdateView(viewsets.ModelViewSet):

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = ImageSerializer
    queryset = Image.objects.all()
