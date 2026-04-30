#!/bin/sh
set -e
cd /site

export LANG="${LANG:-C.UTF-8}"
export LC_ALL="${LC_ALL:-C.UTF-8}"
# ホストがマウントされてもイメージ側の gem を使う（/site 配下に置かない）
export BUNDLE_PATH="${BUNDLE_PATH:-/usr/local/bundle}"

# マウント後の Gemfile.lock と同期（初回 or lock 更新時）
bundle _2.3.27_ check 2>/dev/null || bundle _2.3.27_ install --jobs 4 --retry 3

exec bundle _2.3.27_ exec jekyll "$@"
