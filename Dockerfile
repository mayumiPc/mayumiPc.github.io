FROM ruby:3.1-bookworm

WORKDIR /site

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

ENV BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_APP_CONFIG=/usr/local/bundle

RUN gem install bundler:2.3.27

COPY Gemfile Gemfile.lock ./
RUN bundle _2.3.27_ install --jobs 4 --retry 3

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
# Windows チェックアウトの CRLF を除去（shebang が壊れるのを防ぐ）
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh

# ビルド時にサイト一式が妥当か確認するためコピー（実行時は compose のボリュームで上書き）
COPY . .

# Docker Desktop（Windows）のボリュームマウントでは Jekyll 3.9 の watch が
# /proc/version 読み取りで例外になることがあるため、既定では監視をオフにする。
# ファイル変更後はコンテナを再起動するか: docker compose restart
EXPOSE 4000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["serve", "--host", "0.0.0.0", "--port", "4000", "--no-watch"]
