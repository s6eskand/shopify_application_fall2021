from django.urls import path
from .views import (
    ImageListView,
    ImageRetrieveView,
    ImageCreateUpdateView
)

image_create = ImageCreateUpdateView.as_view({
    "post": "create",
    "put": "update"
})


urlpatterns = [
    path('', ImageListView.as_view()),
    path('/images/<username>', ImageRetrieveView.as_view()),
    path('/create', image_create)
]
