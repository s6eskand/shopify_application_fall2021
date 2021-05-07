from django.urls import path
from .views import (
    ImageListView,
    ImageNonOwnerUpdateView,
    ImageCreateView,
    ImageRetrieveView
)

image_create = ImageCreateView.as_view({
    'post': 'create'
})


urlpatterns = [
    path('create', image_create),
    path('', ImageListView.as_view()),
    path('images', ImageNonOwnerUpdateView.as_view()),
    path('<username>', ImageRetrieveView.as_view()),
]
