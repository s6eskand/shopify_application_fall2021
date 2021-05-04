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


class ImageListView(generics.ListAPIView):

    serializer_class = ImageSerializer
    queryset = Image.objects.all()


class ImageRetrieveView(views.APIView):

    def get(self, request, username=None):
        queryset = Image.objects.filter(owner__username=username)
        serializer = ImageSerializer(queryset, many=True)
        return response.Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )


class ImageCreateUpdateView(viewsets.ModelViewSet):

    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = ImageSerializer
    queryset = Image.objects.all()
