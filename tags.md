---
layout: default
title: タグ一覧
permalink: /tags/
---

## タグ一覧

{% if site.tags and site.tags != empty %}
<ul class="archive-group-list">
  {% assign sorted_tags = site.tags | sort %}
  {% for tag_entry in sorted_tags %}
  {% assign tag_name = tag_entry[0] %}
  {% assign posts = tag_entry[1] %}
  <li class="archive-group-list__item">
    <h3 class="archive-group-list__heading">
      <span class="taxonomy-pill taxonomy-pill--tag">#{{ tag_name }}</span>
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
<p>タグはまだありません。</p>
{% endif %}
