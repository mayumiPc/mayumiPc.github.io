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
    <span class="post-list__meta">{{ post.date | date: "%Y.%m.%d" }}</span>
    {% if post.categories and post.categories != empty %}
    <ul class="post-list__taxonomy" aria-label="カテゴリ">
      {% for category in post.categories %}
      <li><span class="taxonomy-pill taxonomy-pill--category">{{ category }}</span></li>
      {% endfor %}
    </ul>
    {% endif %}
    {% if post.tags and post.tags != empty %}
    <ul class="post-list__taxonomy" aria-label="タグ">
      {% for tag in post.tags %}
      <li><span class="taxonomy-pill taxonomy-pill--tag">#{{ tag }}</span></li>
      {% endfor %}
    </ul>
    {% endif %}
  </li>
{% endfor %}
</ul>
