from django.urls import path
from .views import UserSettingRetrieveUpdateView


urlpatterns = [
    path('', UserSettingRetrieveUpdateView.as_view())
]
