import io
import json
from PIL import Image as IMG
from rest_framework.test import (
    APIRequestFactory,
    force_authenticate,
    APITestCase
)
from .api.views import (
    ImageCreateView,
    ImageRetrieveView,
    ImageNonOwnerUpdateView,
    ImageListView
)
from .models import Image
from usersettings.models import UserSetting
from django.contrib.auth.models import User


def generate_image_file():
    file = io.BytesIO()
    image = IMG.new('RGBA', size=(100, 100), color=(155, 0, 0))
    image.save(file, 'png')
    file.name = 'test.png'
    file.seek(0)
    return file


# tests for image creation view
class ImageCreateViewTest(APITestCase):

    def setUp(self) -> None:
        self.view = ImageCreateView.as_view({"post": "create"})
        self.factory = APIRequestFactory()
        self.file = generate_image_file()
        self.user = User.objects.create_user(
            username="testuser",
            email="testemail@test.com",
            password="testpassword"
        )
        self.user.save()

    def test_empty_request_body(self):
        request = self.factory.post(
            "/images/create",
            {}
        )
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)
        self.assertRaises(Exception)

    def test_unauthenticated_request(self):
        request = self.factory.post(
            "/images/create",
            {"image": self.file, "title": "test title", "caption": "test caption"}
        )
        response = self.view(request)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.data["detail"], "Authentication credentials were not provided.")

    def test_profile_picture_creation(self):
        request = self.factory.post(
            "/images/create?dp=True",
            {"image": self.file, "title": "test title", "caption": "test caption", "profile_picture": True}
        )
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], "test title")
        self.assertEqual(response.data["caption"], "test caption")
        self.assertEqual(response.data["profile_picture"], True)

    def test_valid_image_creation(self):
        request = self.factory.post(
            "/images/create",
            {"image": self.file, "title": "test title", "caption": "test caption"}
        )
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], "test title")
        self.assertEqual(response.data["caption"], "test caption")
        self.assertEqual(response.data["private"], False)


# tests for image list endpoint
class ImageListViewTest(APITestCase):

    def setUp(self) -> None:
        self.view = ImageListView.as_view()
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username="testuser",
            email="testemail@test.com",
            password="testpassword"
        )
        self.user.save()

    def test_list_images_empty_list(self):
        request = self.factory.get("/images")
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_list_images(self):
        Image.objects.create(
            title="test title",
            caption="test caption",
            owner=self.user
        )
        UserSetting.objects.create(
            owner=self.user
        )
        request = self.factory.get("/images")
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["author"], {"username": "testuser"})
        self.assertEqual(response.data[0]["title"], "test title")

    def test_list_images_only_show_public(self):
        Image.objects.create(
            title="test title public",
            caption="test caption",
            owner=self.user
        )
        Image.objects.create(
            title="test title private",
            caption="test caption",
            owner=self.user,
            private=True
        )
        UserSetting.objects.create(
            owner=self.user
        )
        request = self.factory.get("/images")
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["author"], {"username": "testuser"})
        self.assertEqual(response.data[0]["title"], "test title public")

    def test_list_images_private_profile(self):
        Image.objects.create(
            title="test title public",
            caption="test caption",
            owner=self.user
        )
        UserSetting.objects.create(
            owner=self.user,
            private=True
        )
        request = self.factory.get("/images")
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_list_images_sort_by_likes_and_shares(self):
        Image.objects.create(
            title="test title third",
            caption="test caption",
            owner=self.user
        )
        Image.objects.create(
            title="test title first",
            caption="test caption",
            owner=self.user,
            likes=2,
            shares=2
        )
        Image.objects.create(
            title="test title second",
            caption="test caption",
            owner=self.user,
            likes=2
        )
        UserSetting.objects.create(
            owner=self.user
        )
        request = self.factory.get("/images")
        response = self.view(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response.data[0]["title"], "test title first")
        self.assertEqual(response.data[1]["title"], "test title second")
        self.assertEqual(response.data[2]["title"], "test title third")


# tests for image update likes and shares endpoint
class ImageNonOwnerUpdateViewTest(APITestCase):

    def setUp(self) -> None:
        self.view = ImageNonOwnerUpdateView.as_view()
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username="testuser",
            email="testemail@test.com",
            password="testpassword"
        )
        self.image = Image.objects.create(
            title="test title",
            caption="test caption",
            owner=self.user
        )
        self.image.save()
        self.user.save()

    def test_increment_likes_and_shares(self):
        pk = self.image.pk
        request = self.factory.post(
            "/images/images",
            json.dumps({"pk": pk, "likes": 1, "shares": 1}),
            content_type="application/json"
        )
        response = self.view(request)
        updated_image = Image.objects.get(title="test title")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(updated_image.likes, 1)
        self.assertEqual(updated_image.shares, 1)

    def test_decrement_likes(self):
        pk = self.image.pk
        request = self.factory.post(
            "/images/images",
            json.dumps({"pk": pk, "likes": -1, "shares": 0}),
            content_type="application/json"
        )
        response = self.view(request)
        updated_image = Image.objects.get(title="test title")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(updated_image.likes, 0)
        self.assertEqual(updated_image.shares, 0)

    def test_decrement_likes_at_zero(self):
        pk = self.image.pk
        request = self.factory.post(
            "/images/images",
            json.dumps({"pk": pk, "likes": -1, "shares": 0}),
            content_type="application/json"
        )
        response = self.view(request)
        updated_image = Image.objects.get(title="test title")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(updated_image.likes, 0)
        self.assertEqual(updated_image.shares, 0)

    def test_update_on_nonexistent_object(self):
        request = self.factory.post(
            "/images/images",
            json.dumps({"pk": 0, "likes": 1, "shares": 0}),
            content_type="application/json"
        )
        response = self.view(request)
        self.assertEqual(response.status_code, 404)

    def test_update_missing_fields(self):
        pk = self.image.pk
        Image.objects.create(
            title="test title",
            caption="test caption",
            owner=self.user
        )
        request = self.factory.post(
            "/images/images",
            json.dumps({"pk": pk}),
            content_type='application/json'
        )
        response = self.view(request)
        self.assertEqual(response.status_code, 204)


# tests for image retrieval endpoint
class ImageRetrievalViewTest(APITestCase):

    def setUp(self) -> None:
        self.view = ImageRetrieveView.as_view()
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(
            username="testuser",
            email="testemail@test.com",
            password="testpassword"
        )
        self.image = Image.objects.create(
            title="test title",
            caption="test caption",
            owner=self.user
        )
        self.usersettings = UserSetting.objects.create(
            owner=self.user
        )
        self.usersettings.save()
        self.image.save()
        self.user.save()

    def test_image_retrieval(self):
        request = self.factory.get("/images/testuser?title=test title")
        response = self.view(request, username="testuser")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["title"], "test title")
