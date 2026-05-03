---
layout: default
title: このブログサイトがどう動いているか（Jekyll・GitHub Pages・構成の詳細）
excerpt: mayumipc.github.io を静的サイトとしてどうビルド・配信しているか（Jekyll・GitHub Pages・設定）を整理した。
categories:
  - 技術
tags:
  - Jekyll
  - GitHub Pages
  - 静的サイト
---

{% raw %}

本記事では、このサイト（`mayumipc.github.io`）が**どのようなソフトウェアでビルドされ、どこで配信され、画面がどう組み立てられるか**を、実装に即して説明する。

## 全体像：静的サイトとしての動き方

このサイトは**データベースもサーバー側アプリケーションもない静的サイト**である。流れは次のとおりだ。

1. **Jekyll** が Markdown・Liquid テンプレート・設定を読み込む。
2. Jekyll が **HTML・CSS・フィード等のファイル一式**を生成する（ビルド）。
3. 生成物が **GitHub Pages** により HTTPS で公開される。

閲覧者がページを開いたときに動くのは、ブラウザが HTML/CSS/JavaScript を解釈するだけであり、WordPress のような「リクエストごとに PHP が DB を読む」モデルではない。

## ホスティングとリポジトリの関係

`_config.yml` では次のように設定されている。

- `url: https://mayumipc.github.io`
- `baseurl: ""`

GitHub の**ユーザーサイト**は、リポジトリ名が `<username>.github.io` のとき、サイトのルートがそのリポジトリの公開ブランチ直下になる。そのため **`baseurl` は空文字**でよい。プロジェクトサイト（`username.github.io/repo-name/`）のときだけ、`baseurl` に `/repo-name` を設定する必要がある。

テンプレートではリンクやアセットに **`relative_url` フィルタ**を付けている例が多い（例：`{{ '/' | relative_url }}`、`{{ '/assets/css/main.css' | relative_url }}`）。これにより、将来 `baseurl` を変えてもパスが破れにくい。

## 依存関係：`github-pages` gem

`Gemfile` では `github-pages` をまとめて引いている。

```ruby
gem "github-pages", group: :jekyll_plugins
```

これは **GitHub Pages が実際にビルドで使う Jekyll とプラグインのバージョンセットに近い形**で依存を固定するための手段である。

## 設定の要点（`_config.yml`）

### Markdown とシンタックスハイライト

- `markdown: kramdown`
- `kramdown.input: GFM` … GitHub Flavored Markdown（テーブル・改行など）に寄せた入力。
- `syntax_highlighter: rouge` … コードブロックを Rouge で HTML に着色する。

記事本文は `_posts` の Markdown が、この設定に従って HTML に変換される。

### パーマリンク

```yaml
permalink: /:year/:month/:day/:title/
```

各投稿の URL は **日付（ファイル名由来）＋スラッグ**から決まる。例：`2026-05-04-blog-no-shikumi-to-jissou.md` → `/2026/05/04/blog-no-shikumi-to-jissou/` のような形になる（実際の `:title` はファイル名の日付以外の部分による）。

### 既定レイアウト（`defaults`）

`pages` と `posts` の両方に **`layout: default`** をデフォルト指定している。個別ファイルの YAML で `layout` を上書きしない限り、すべて `/_layouts/default.html` が使われる。

### プラグイン（ビルド時に動くもの）

有効になっているのは次の三つである。

| プラグイン | 役割 |
|-----------|------|
| `jekyll-feed` | Atom 形式のフィード（RSS の親戚）を生成。テンプレートの `{% feed_meta %}` と連動。 |
| `jekyll-sitemap` | `sitemap.xml` を生成し、検索エンジン向けに URL 一覧を提供。 |
| `jekyll-seo-tag` | `{% seo %}` で title・description・OGP 系メタなどを出力。 |

これらはすべて **ビルド時に静的ファイルや `<head>` のマークアップとして出力される**ものであり、サーバー上で常駐プロセスが動くわけではない。

## レイアウト：`default.html` がページ種別で分岐している

全ページ共通の骨格は `_layouts/default.html` である。`<main>` 内で **`page.path` に `_posts` が含まれるか**で、記事ページかそれ以外かを分けている。

### 記事ページ（`_posts` 由来）

- `<article>` で `page.title`・日付（`<time datetime="...">`）・カテゴリ／タグを表示。
- `{{ content }}` で Markdown から生成された本文が差し込まれる。
- その下に **関連記事**セクションがある。

関連記事のロジックは次のとおりである。

```liquid
{% assign related_posts = site.related_posts | where_exp: "post", "post.url != page.url" | limit: 3 %}
{% if related_posts == empty %}
  {% assign related_posts = site.posts | where_exp: "post", "post.url != page.url" | limit: 3 %}
{% endif %}
```

まず Jekyll の **`site.related_posts`**（類似度に基づく関連）を試し、空なら **単に最新側から除外した `site.posts`** で埋めるフォールバックになっている。`related_posts` は環境によっては常に空に近い場合もあるため、このフォールバックは実運用上わかりやすい。

### 固定ページ・ホーム・一覧ページ

`page.path contains '_posts'` が偽のときは、`{{ content }}` だけがそのまま出力される。つまり **`index.md`、`categories.md`、`tags.md` はそれぞれが自分の Markdown（とそこに書かれた Liquid）をそのまま載せる**形になる。

## ホーム・カテゴリ・タグ一覧の実装

### ホーム（`index.md`）

フロントマターで `layout: default`、`title: ホーム`。本文で **`{% for post in site.posts %}`** により全投稿をループし、タイトルリンク・抜粋・日付・カテゴリ／タグを表示している。

抜粋は `post.excerpt` に Liquid で後処理（HTML 除去・改行削除・文字数制限）をかけている。

### カテゴリ・タグ（`categories.md` / `tags.md`）

それぞれ `permalink: /categories/` と `/tags/` が指定されている。

Jekyll は投稿の YAML に書いた `categories` / `tags` から、ビルド時に **`site.categories` と `site.tags`** を組み立てる。これらは「名前 → 投稿の配列」のマップとして渡るため、テンプレート側では `sorted_categories` / `sorted_tags` に `sort` してから `for` で回し、件数は `posts | size` で表示している。

個別タグ／カテゴリごとの **専用 URL の自動生成（`/tag/foo/` のようなページ）** は、このリポジトリの構成だけでは行っていない。一覧ページを Markdown と Liquid で静的にレンダリングしている形である。

## スタイル：`assets/css/main.scss`

スタイルは **`assets/css/main.scss`** に SCSS として書かれ、Jekyll の Sass 統合により **`main.css` にコンパイル**されて配信される（ファイル先頭の YAML front matter `---` が Jekyll に処理対象であることを示す）。

デザインは独自の変数（背景色・アクセント色など）と BEM に近いクラス名で、`site-header`・`post-list`・`taxonomy-pill`・フッターなどセクションごとにスタイルがまとまっている。

## ビルドから公開までの典型的な流れ（開発者視点）

1. `_posts/YYYY-MM-DD-slug.md` を追加または編集する。
2. Git にコミットし、`main`（または Pages が見るブランチ）へプッシュする。
3. GitHub Pages が Jekyll ビルドを走らせ、成功すると **`username.github.io` に静的ファイルが公開**される。

（ビルドオプションや Actions の有無はリポジトリ設定によるが、ユーザーサイトの標準フローは上記のイメージである。）

## まとめ

| 要素 | 役割 |
|------|------|
| Jekyll | Markdown・Liquid・YAML を HTML/CSS に変換する静的サイトジェネレータ |
| GitHub Pages | 生成されたファイルをホストし HTTPS 配信する |
| `_layouts/default.html` | 共通レイアウトと記事ページ専用ブロック（関連記事含む） |
| `_config.yml` | URL・Markdown・プラグイン・パーマリンク・defaults |
| `github-pages` gem | Pages に近い依存バージョンで Gem を固定する |
| `jekyll-feed` / `jekyll-sitemap` / `jekyll-seo-tag` | フィード・サイトマップ・SEO メタの自動生成 |

このサイトは「シンプルさ」と「Pages でホストしやすさ」を優先した構成であり、動的 CMS の機能は持たない代わりに、**ビルド済み成果物の配信だけに依存する**ため表示が速く、攻撃面も小さいという特性がある。

{% endraw %}
