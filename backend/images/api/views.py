from rest_framework import (
    response,
    status,
    views,
    parsers
)
from .serializers import ImageSerializer
from ..models import Image


class ImageCreateView(views.APIView):
    parser_classes = (parsers.MultiPartParser,)

    def post(self, request, format=None):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response.Response(
                status=status.HTTP_204_NO_CONTENT
            )
        return response.Response(
            data={"error": "Invalid data received"},
            status=status.HTTP_400_BAD_REQUEST
        )


class ImageListView(views.APIView):

    def get(self):
        queryset = Image.objects.all()
        serializer = ImageSerializer(queryset, many=True)
        return response.Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )


class ImageDetailListView(views.APIView):

    def get(self, request, pk=None):
        queryset = Image.objects.get(pk=pk)
        if queryset is None:
            return response.Response(
                data={"error": "No image found for the requested ID"},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ImageSerializer(data=queryset)
        return response.Response(
            data=serializer.data,
            status=status.HTTP_200_OK
        )
