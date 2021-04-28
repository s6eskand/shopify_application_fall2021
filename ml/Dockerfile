FROM python:3.7

COPY ./app/requirements.txt /app/requirements.txt

WORKDIR /app

RUN python -m pip install --upgrade pip

RUN pip install -r requirements.txt

COPY ./app /app
COPY ./functions /app/functions
COPY ./models /app/models

CMD ["python", "app.py"]