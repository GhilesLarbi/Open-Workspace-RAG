FROM python:3.12-slim
WORKDIR /code
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y \
    git build-essential gcc ca-certificates \
    --no-install-recommends && \
    update-ca-certificates && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir pipenv
COPY Pipfile Pipfile.lock /code/
RUN pipenv install --system --verbose

RUN playwright install --with-deps chromium
RUN crawl4ai-setup

COPY . /code/