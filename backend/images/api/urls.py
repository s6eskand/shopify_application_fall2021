from django.urls import path
from .views import (
    ImageListView,
    ImageCreateView,
    ImageDetailListView
)


urlpatterns = [
    path('', ImageListView.as_view()),
    path('<pk>', ImageDetailListView.as_view()),
    path('create', ImageCreateView.as_view())
]
