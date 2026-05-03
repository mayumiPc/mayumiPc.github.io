---
layout: default
title: カテゴリ一覧
permalink: /categories/
---

## カテゴリ一覧

{% if site.categories and site.categories != empty %}
<ul class="archive-group-list">
  {% assign sorted_categories = site.categories | sort %}
  {% for category_entry in sorted_categories %}
  {% assign category_name = category_entry[0] %}
  {% assign posts = category_entry[1] %}
  <li class="archive-group-list__item">
    <h3 class="archive-group-list__heading">
      <span class="taxonomy-pill taxonomy-pill--category">{{ category_name }}</span>
      <span class="archive-group-list__count">({{ posts | size }}件)</span>
    </h3>
    <ul class="archive-post-list">
      {% for post in posts %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <span class="archive-post-list__meta">{{ post.date | date: "%Y.%m.%d" }}</span>
      </li>
      {% endfor %}
    </ul>
  </li>
  {% endfor %}
</ul>
{% else %}
<p>カテゴリはまだありません。</p>
{% endif %}
