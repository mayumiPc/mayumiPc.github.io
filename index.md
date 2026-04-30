---
layout: default
title: ホーム
---

# {{ site.title }}

{{ site.description }}

## 記事一覧

<ul class="post-list">
{% for post in site.posts %}
  <li>
    <a class="post-list__title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="post-list__meta">{{ post.date | date: "%Y年%-m月%-d日" }}</span>
  </li>
{% endfor %}
</ul>
