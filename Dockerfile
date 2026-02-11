FROM python:3.14-slim

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1


RUN apt-get update 
RUN apt-get install -y git

RUN pip install --no-cache-dir pipenv

COPY Pipfile Pipfile.lock /code/
RUN pipenv install --system --deploy --verbose

COPY . /code/