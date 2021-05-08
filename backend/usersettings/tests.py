from rest_framework.test import (
    APIRequestFactory,
    APITestCase,
    force_authenticate
)
from .api.views import (
    UserSettingRetrieveUpdateView,
    UserProfileRetrieveView
)
from .models import UserSetting
from images.models import Image
from django.contrib.auth.models import User
import json


# test for retrieval by username endpoint
class UserProfileRetrieveViewTest(APITestCase):

    def setUp(self) -> None:
        self.factory = APIRequestFactory()
        self.view = UserProfileRetrieveView.as_view()
        self.user = User.objects.create_user(
            username="testuser",
            email="testemail@test.com",
            password="testpassword"
        )
        self.usersetting = UserSetting.objects.create(
            owner=self.user
        )
        self.usersetting.save()
        self.user.save()

    def test_retrieval_by_username_no_images(self):
        request = self.factory.get("/account/profile/testuser")
        response = self.view(request, username="testuser")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["images"], [])
        self.assertEqual(response.data["profile"]["username"], "testuser")
        self.assertIsNone(response.data["profile"]["profile_picture"])

    def test_retrieval_by_username_order_by_timestamp(self):
        Image.objects.create(
            title="test title",
            caption="test caption",
            owner=self.user,
        )
        Image.objects.create(
            title="test title 2",
            caption="test caption",
            owner=self.user
        )
        request = self.factory.get("/account/profile/testuser")
        response = self.view(request, username="testuser")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["images"]), 2)
        self.assertEqual(response.data["images"][0]["title"], "test title")
        self.assertEqual(response.data["images"][1]["title"], "test title 2")
        self.assertEqual(response.data["images"][0]["author"]["username"], "testuser")

    def test_retrieval_by_username_private_images(self):
        Image.objects.create(
            title="test title public",
            caption="test caption",
            owner=self.user,
        )
        Image.objects.create(
            title="test title private",
            caption="test caption",
            owner=self.user,
            private=True
        )
        request = self.factory.get("/account/profile/testuser")
        response = self.view(request, username="testuser")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["images"]), 1)
        self.assertEqual(response.data["images"][0]["title"], "test title public")

    def test_retrieval_by_username_doesnt_exist(self):
        request = self.factory.get("/account/profile/missinguser")
        response = self.view(request, username="missinguser")
        self.assertEqual(response.status_code, 404)
        self.assertRaises(Exception)

    def test_retrieval_by_username_private_account(self):
        Image.objects.create(
            title="test title",
            caption="test caption",
            owner=self.user,
        )
        Image.objects.create(
            title="test title 2",
            caption="test caption",
            owner=self.user
        )
        self.usersetting.private = True
        self.usersetting.save()
        request = self.factory.get("/account/profile/testuser")
        response = self.view(request, username="testuser")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["images"]), 0)


# tests for user settings retrieval and update view
class UserSettingRetrieveUpdateViewTest(APITestCase):

    def setUp(self) -> None:
        self.factory = APIRequestFactory()
        self.view = UserSettingRetrieveUpdateView.as_view()
        self.user = User.objects.create_user(
            username="testuser",
            email="testemail@test.com",
            password="testpassword"
        )
        self.usersetting = UserSetting.objects.create(
            biography="a test biography",
            owner=self.user
        )
        self.usersetting.save()
        self.user.save()

    def test_retrieve_account(self):
        request = self.factory.get("/account/settings")
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["profile"]["username"], "testuser")
        self.assertEqual(len(response.data["imagedata"]), 0)

    def test_retrieve_account_no_auth(self):
        request = self.factory.get("/account/settings")
        response = self.view(request)
        self.assertEqual(response.status_code, 401)

    def test_retrieve_account_order_by_timestamp(self):
        Image.objects.create(
            title="test title",
            caption="test caption",
            owner=self.user,
        )
        Image.objects.create(
            title="test title 2",
            caption="test caption",
            owner=self.user
        )
        request = self.factory.get("/account/settings")
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["imagedata"]), 2)
        self.assertEqual(response.data["imagedata"][0]["title"], "test title")
        self.assertEqual(response.data["imagedata"][1]["title"], "test title 2")

    def test_retrieve_account_private_images(self):
        Image.objects.create(
            title="test title private",
            caption="test caption",
            owner=self.user,
            private=True
        )
        Image.objects.create(
            title="test title public",
            caption="test caption",
            owner=self.user
        )
        request = self.factory.get("/account/settings")
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["imagedata"]), 2)
        self.assertEqual(response.data["imagedata"][0]["title"], "test title private")
        self.assertTrue(response.data["imagedata"][0]["private"])
        self.assertEqual(response.data["imagedata"][1]["title"], "test title public")

    def test_retrieve_account_private_account(self):
        Image.objects.create(
            title="test title",
            caption="test caption",
            owner=self.user,
        )
        Image.objects.create(
            title="test title 2",
            caption="test caption",
            owner=self.user
        )
        self.usersetting.private = True
        self.usersetting.save()
        request = self.factory.get("/account/settings")
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["imagedata"]), 2)

    def test_update_account_invalid_request_body(self):
        request = self.factory.put(
            "/account/settings",
            json.dumps({"invalidkey": True}),
            content_type="application/json"
        )
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertRaises(Exception)
        self.assertEqual(response.status_code, 400)

    def test_update_account_no_auth(self):
        request = self.factory.put(
            "/account/settings",
            json.dumps({}),
            content_type="application/json"
        )
        response = self.view(request)
        self.assertEqual(response.status_code, 401)

    def test_update_account(self):
        self.assertEqual(self.usersetting.biography, "a test biography")
        request = self.factory.put(
            "/account/settings",
            json.dumps({"biography": "an edited test biography", "owner": self.user.pk}),
            content_type="application/json"
        )
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["biography"], "an edited test biography")
