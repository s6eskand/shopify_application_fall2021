from django.urls import path
from .views import UserSettingRetrieveUpdateView, UserProfileRetrieveView


urlpatterns = [
    path('settings', UserSettingRetrieveUpdateView.as_view()),
    path('profiles/<username>', UserProfileRetrieveView.as_view())
]
