# Shopify Application - Image Repository

### Live site: https://samimagerepo.vercel.app/

This is an image repository built by Sam Eskandar for the Shopify Fall 2021 Developer Challenge

***This site is deployed on Heroku and Vercel. Heroku cold start on free tier takes ~10 seconds and Vercel timeout on free tier is 10 seconds. If you get a 504 timeout error in the app you may need to refresh a couple of times. This is a limitation of my bank account I do apologize for the inconvenience***

demo account credentials (or just make an account through the site):

```
username: demoaccount
password: shopify
```

### Testing
To run tests, clone the repository and run the following commands:
```
# inside backend directory
pip install -r requirements.txt
py manage.py test
```

### Features
This project supports image creation, user profiles, private photos and accounts, and image search (based on title, captions, and hashtags). If you would like to generate captions and use the reverse image search functionality, clone the project and run the docker container on port 5000. This can be done by running:

```
# in ml directory
docker build -t <name_of_container>:latest .
docker run -p 5000:5000 <name_of_container>
```

The model was trained on the first 6000 images in the MS-COCO dataset, resulting in sub-optimal caption generation. If you have the time, feel free to open the notebook provided and train the model on the full dataset for better results.

### Tech Stack
- Frontend
  - NextJS
  - React

- Backend
  - Django
  - Tensorflow
  - Flask
  - Docker
  
View images on the featured page, sorted by the amounts of likes and shares each photo has

![main](./readme-content/featured-images.png)

View user profiles, and all of their public photos

![profile](./readme-content/profile.png)

The image repository supports sharing profiles and images via share buttons. NextJS is used for proper SEO when sharing links

![profile-seo](./readme-content/profile-seo.png)
![image-seo](./readme-content/image-seo.png)


