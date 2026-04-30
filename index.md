---
layout: default
title: ホーム
---

## 記事一覧

<ul class="post-list">
{% for post in site.posts %}
  <li>
    <h3 class="post-list__heading">
      <a class="post-list__title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
    </h3>
    <p class="post-list__preview">{{ post.excerpt | strip_html | strip_newlines | truncate: 110 }}</p>
    <span class="post-list__meta">{{ post.date | date: "%Y年%-m月%-d日" }}</span>
  </li>
{% endfor %}
</ul>
