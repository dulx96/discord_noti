# `python-base` sets up all our shared environment variables
FROM python:3.8-slim as python-base

# python
ENV PYTHONUNBUFFERED=1 \
    # prevents python creating .pyc files
    PYTHONDONTWRITEBYTECODE=1 \
    \
    # pip
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    \
    # poetry
    # https://python-poetry.org/docs/configuration/#using-environment-variables
    POETRY_VERSION=1.1.0 \
    # make poetry install to this location
    POETRY_HOME="/opt/poetry" \
    # make poetry create the virtual environment in the project's root
    # it gets named `.venv`
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    # do not ask any interactive question
    POETRY_NO_INTERACTION=1 \
    \
    # paths
    # this is where our requirements + virtual environment will live
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv" \
    PLAYWRIGHT_BROWSERS_PATH="/opt/playwright-browser"

# prepend poetry and venv to path
ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

# Install Chromium dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    fonts-liberation \
    libnss3 \
    libxss1 \
    libasound2 \
    fonts-noto-color-emoji \
    libxtst6 \
    libgtk-3-0 \
    libdrm2 \
    libgbm1 \
    libxshmfence1&& \
    rm -rf /var/lib/apt/lists/*

# `builder-base` stage is used to build deps + create our virtual environment
FROM python-base as builder-base
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
    # deps for installing poetry
    curl \
    # deps for building python deps
    build-essential

# install poetry - respects $POETRY_VERSION & $POETRY_HOME
RUN curl -sSL https://raw.githubusercontent.com/sdispater/poetry/master/get-poetry.py | python

# copy project requirement files here to ensure they will be cached.
WORKDIR $PYSETUP_PATH
COPY poetry.lock pyproject.toml ./

# install runtime deps - uses $POETRY_VIRTUALENVS_IN_PROJECT internally
RUN poetry install --no-dev
RUN poetry run python -m playwright install chromium

# install nginx
COPY install-nginx-debian.sh /

RUN bash /install-nginx-debian.sh

COPY nginx.conf /etc/nginx/nginx.conf

FROM builder-base as dev
WORKDIR $PYSETUP_PATH
# copy in our built poetry + venv
COPY --from=builder-base $PYSETUP_PATH $PYSETUP_PATH
COPY --from=builder-base $PLAYWRIGHT_BROWSERS_PATH $PLAYWRIGHT_BROWSERS_PATH

# quicker install as runtime deps are already installed
# RUN poetry install

# will become mountpoint of our code
WORKDIR /app
CMD ["/bin/bash", "-c", "service nginx start; python main.py"]
