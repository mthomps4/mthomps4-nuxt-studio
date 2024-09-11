---
title: Building a Fuzzy Search with Turbo Streams in Rails
description: Learn how to implement a dynamic fuzzy search feature using Turbo Streams in your Rails application.
og:
  title: Building a Fuzzy Search with Turbo Streams in Rails
  description: Discover how to create a responsive fuzzy search functionality with Turbo Streams for a seamless user experience.
path: /blog/2024/turbo-auto-complete
image:
  src: https://ik.imagekit.io/mthomps4/site/posts/turbo-auto-complete/featured.png
  alt: Turbo Streams Fuzzy Search
publishedOn: '2024-08-01'
tags:
  - Rails
  - Turbo Streams
  - Stimulus
organization:
  name: Echobind
  site: https://echobind.com
_draft: true
draft: true
---

<img src="https://ik.imagekit.io/mthomps4/site/posts/turbo-auto-complete/featured.png" alt="Turbo Streams Fuzzy Search" class="featured-image">

## Introduction

In modern web applications, providing a smooth and responsive search experience is crucial for user engagement. Fuzzy search, which allows for approximate string matching, can greatly enhance the usability of your search functionality. In this blog post, we'll explore how to implement a dynamic fuzzy search feature using [Turbo Streams](https://turbo.hotwired.dev/handbook/streams) and [Request.js](https://github.com/rails/requestjs-rails) in a Rails application.

## What are Turbo Streams?

[Turbo Streams](https://turbo.hotwired.dev/handbook/streams) is part of the Hotwire suite, which allows you to update parts of your web page without a full page reload. It's particularly useful for creating interactive features like live search, where you want to update search results as the user types.

## Setting Up the Project

I'm going to assume you are already familiar with Rails and have a project setup. If you are not, you can use the Rails CLI to create a new project:

```bash
rails new search-app
```

## The Flow

1. User types in the search field
2. Turbo Streams is triggered to update the search results
3. Turbo Streams updates the search results

## The Search Controller

```ruby

1. User types in the search field
