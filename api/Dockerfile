########################################################################################
########################################################################################
FROM python:3.12-slim AS base
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
RUN pipenv sync --system --verbose
# RUN pipenv install --system --verbose

COPY . /code/

########################################################################################
# api + scheduler: no browser
########################################################################################
FROM base AS api
# ENV CRAWL4AI_MODE=api
# RUN crawl4ai-setup

########################################################################################
# worker: full browser install
########################################################################################
FROM base AS worker
RUN crawl4ai-setup