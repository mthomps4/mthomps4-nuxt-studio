---
title: You may not need Redis and Sidekiq
description: Save some money and ditch your Redis worker.
og:
  title: You may not need Redis and Sidekiq
  description: Save some money and ditch your Redis worker.
path: /blog/2024/you-may-not-need-sidekiq-redis
image:
  src: https://ik.imagekit.io/mthomps4/site/posts/you-may-not-need-redis-and-sidekiq/featured.jpeg
  alt: og-image
publishedOn: '2024-06-03'
tags:
  - Rails
  - Redis
  - Sidekiq
organization:
  name: Echobind
  site: https://echoind.com
---

![featured.png](https://ik.imagekit.io/mthomps4/site/posts/you-may-not-need-redis-and-sidekiq/featured.jpeg){.featured-image}

## Why you may not need Redis and Sidekiq

[In another post](https://www.mthomps4.com/blog/2024/rails-on-railway/) I mentioned 2024 being the year of re-evaluation and cost cutting.

It wasn’t long after starting some of these deployment evaluations that Redis caused a stir with its announcement of license changes. It’s always something, right? Most of my Redis interactions have been in Rails land, keeping globs of data in memory for quick access or the 1, 2 combo with Sidekiq. Add in the fact that a production Redis is stupidly expensive with services like Render. ($135/mo+ for the pro production version—ouch!)

Accessing my own memory, I recalled some mention from last year's [Rails World](https://youtu.be/iqXjGiQ_D-A?si=9qt8EAWD0jNAU6Uz\&t=2796) about leaning into the Hardware we already have. Memory access tools like Redis were invented/used when doing direct reads from an externally hosted database from a hard drive was slow (or slower). Today, we have Solid-State Drives, beefy cloud machines, shared data/edge resources, etc. To be clear, technology _has_ actually advanced a bit; we have options.

The Rails core community has been taking these thoughts and concepts to heart pushing and maintaining packages like [Solid Queue](https://github.com/rails/solid_queue) and [Solid Cache](https://github.com/rails/solid_cache).  We are already approaching Rails World 2024, where tickets sold out in 20 minutes. While I’m not able to attend, I’m excited to see where the conversations take us.

**Solid Cache**

<https://github.com/rails/solid_cache>

> Solid Cache is a database-backed Active Support cache store implementation.
>
> Using SQL databases backed by SSDs we can have caches that are much larger and cheaper than traditional memory only Redis or Memcached backed caches.

Solid Cache is exactly what it sounds like. Why pay for an expensive in-memory Redis DB when your application is sitting inside an SSD, where reads and writes are crazy fast? Leveraging something like Postgres (which has also grown and scaled over the years) with SSD makes this a no-brainer for most use cases.

**Solid Queue**

<https://github.com/rails/solid_queue>

> Solid Queue is a DB-based queuing backend for [Active Job](https://edgeguides.rubyonrails.org/active_job_basics.html), designed with simplicity and performance in mind.

Sorry, Sidekiq—you may no longer be needed either. In the same manner, we can leverage Postgres / SSDs to simply manage our jobs and processes. Even better, because this is DB-driven, we have direct insight into what is in the queue, what has failed, properties sent, etc.

With a solid queue, you can even run this on the same thread as your application's thread via the Puma plugin. For example, I have an application with a small process that needs to run once per hour. This process doesn’t need a lot of resources; it’s not going to block the app and it completes in a few seconds. There’s no need for the added overhead of an additional worker thread — just tell the app to run the dang process.

Again, even with a worker, comparing this to the overhead and costs of a full Sidekiq / Redis process is still a no-brainer for me. In a worst-case scenario, you beef up the box the Application/Postgres is hosted in. That is still a huge cost-saving difference from adding full in-memory services like Redis at scale.

While there are alternatives to solid\_queue like [good\_job](https://github.com/bensheldon/good_job), both solid\_cache and solid\_queue are becoming an increased part of the Rails core packages, maintained under the Rails org. In my opinion, there’s no real need to look elsewhere, as these are built to directly interact out of the box with Active Job.

## Summary

I don’t like to lay down blanket statements, especially in the Software industry. However, the use cases I once had for Sidekiq and Redis are closing.

Simply put, do your homework.
Don’t pay for services you don’t need.

Until next time! 🙂
