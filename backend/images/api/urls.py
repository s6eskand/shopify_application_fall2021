from django.urls import path
from .views import (
    ImageView
)

image_list_create = ImageView.as_view({
    "get": "list",
    "post": "create"
})

image_detail = ImageView.as_view({
    "get": "retrieve"
})


urlpatterns = [
    path('', image_list_create),
    path('/<pk>', image_detail)
]
