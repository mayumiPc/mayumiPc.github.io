---

layout: default

title: ホーム

---



\# {{ site.title }}



<p>{{ site.description }}</p>



\## 記事一覧



<ul>

{% for post in site.posts %}

<li>

&nbsp; <a href="{{ post.url }}">{{ post.title }}</a>

&nbsp; ({{ post.date | date: "%Y-%m-%d" }})

</li>

{% endfor %}

</ul>

