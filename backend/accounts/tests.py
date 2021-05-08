from rest_framework.test import (
    APIRequestFactory,
    APIClient,
    APITestCase
)
from .api.views import (
    RegisterAPI,
    LoginAPI
)
from django.core.exceptions import ValidationError
from usersettings.models import UserSetting
import json


# tests for registration view
class RegisterAPITest(APITestCase):

    def setUp(self) -> None:
        self.view = RegisterAPI.as_view()
        self.factory = APIRequestFactory()

    def test_empty_request_body(self):
        request = self.factory.post(
            "/auth/register",
            {}
        )
        response = self.view(request)
        self.assertRaises(Exception)
        self.assertEqual(response.status_code, 400)

    def test_valid_credentials(self):
        expected_response_data = {"id": 4, "username": "testuser", "email": "testemail@test.com"}
        request = self.factory.post(
            "/auth/register",
            {"username": "testuser", "email": "testemail@test.com", "password": "testpassword"}
        )
        response = self.view(request)
        usersetting = UserSetting.objects.get(owner__username="testuser")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user"], expected_response_data)
        self.assertFalse(usersetting.private)  # tests that it was created


# tests for login view
class LoginAPITest(APITestCase):

    def setUp(self) -> None:
        self.factory = APIRequestFactory()
        self.view = LoginAPI.as_view()
        self.user = APIClient().post(
            "/auth/register",
            json.dumps({
                "username": "testuser",
                "email": "testemail@test.com",
                "password": "testpassword"
            }),
            content_type="application/json"
        ).data

    def test_empty_request_body(self):
        request = self.factory.post(
            "/auth/login",
            {}
        )
        response = self.view(request)
        self.assertRaises(Exception)
        self.assertEqual(response.status_code, 400)

    def test_invalid_credentials(self):
        request = self.factory.post(
            "/auth/login",
            {"username": "testuser", "password": "wrongpassword"}
        )
        response = self.view(request)
        self.assertEqual(response.status_code, 400)
        self.assertRaises(ValidationError, msg="Incorrect Credentials")

    def test_valid_credentials(self):
        request = self.factory.post(
            "/auth/login",
            json.dumps({
                "username": "testuser",
                "password": "testpassword"
            }),
            content_type='application/json'
        )
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user"], {"id": 3, "username": "testuser", "email": "testemail@test.com"})
