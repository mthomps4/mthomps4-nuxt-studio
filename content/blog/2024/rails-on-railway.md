---
title: Rails on Railway
description: Ruby on Rails deployed on Railway!
publishedOn: "2024-05-03"
path: '/blog/2024/rails-on-railway'
image:
  src: https://ik.imagekit.io/mthomps4/site/posts/rails-on-railway/featured.png
  alt: og-image
tags: ["Rails", "Railway"]
organization:
  name: Echobind
  site: https://echobind.com
---

<img src="https://ik.imagekit.io/mthomps4/site/posts/rails-on-railway/featured.png" alt="featured.png" class="featured-image">

## Intro

It’s no secret the year 2024 is one of re-evaluation and cost-cutting. As a Software Engineer, hosting the app is one of the unspoken costs that can chip away at us. For Rails specifically, I’ve seen these costs continue to grow. Today, we will explore ONE of the many options out there: [Railway](https://railway.app). I hope to continue this series with a few more options including Fly, Digital Ocean, and AWS.

## Past Resources

As a Rails developer, [Heroku](https://www.heroku.com/) used to be the industry standard, and for many folks, it still is. However, in my opinion, Heroku got the Salesforce sentence of death. We eventually started to use [Render.com](http://Render.com). For the longest time, I was happy with Render... that is until we started hitting some crazy production costs. For a hobbyist app - Render is still great, but let's compare some of the costs for a “real” app. [https://render.com/pricing](https://render.com/pricing)

Most production Rails applications historically have had a server, a database, and until recently, a worker of some kind with Sidekiq w/ Redis.  Humble plug — Feel free to read more [**here on *“why you may not need Redis”***](https://www.mthomps4.com/blog/2024/you-may-not-need-sidekiq-redis/) in 2024. We can simply avoid that open-source drama altogether with something like [solid_queue](https://github.com/rails/solid_queue).

With Render — anything past the “hobby” tier quickly grows to need something like Pro.
That means we now have:

- $20 per team member for access
- $25/mo for a STANDARD Service (let's pretend the app is ok here..)
- $85/mo for the worker
- $95/mo for Postgres
- $135/mo for Redis

Let's see here… carry the one and… Just No.

I couldn’t justify this—anyone who remembers the $5 droplet days would be shocked to see today’s market. Let's be honest: for some folks, there may be some justification for these costs, but try explaining this breakdown to a startup stakeholder.

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/rails-on-railway/Untitled%201.png)

## Railway Overview (TL;DR)

One of the selling points of Railway is **usage-based** cost. I’ve already subtly mentioned one cost-cutting solution of [**removing Redis/Sidekiq**](https://www.notion.so/You-may-not-need-Redis-and-Sidekiq-d17850712df148cf81b375816b6c5ab5?pvs=21). Usage-based can be a double-edged sword here depending on your needs. There’s never a silver bullet solution. There will always be tradeoffs.

However, consider our growing startups, internal apps, and personal hobby apps. With an internal example app below, I was able to take those drastic Render costs and cut costs to the estimated breakdown below.

So far, for a small worker, Rails server, and Postgres, I’m sitting at ~$12 a month. I’ll take it. With some hosting services, I can’t even stand up Postgres for under $15. This gets a little closer to the OG $5 droplet days.

If you are still in the exploration stages this is great.
At some point, usage-based may not be the most cost-effective — but I’d imagine you are still better off here than with a tired price structure like Render. My current recommendation is that once usage-based becomes too much, you’re likely stable enough to start “enterprising” everything down in AWS/Azure. (more on that in a future post)

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/rails-on-railway/Untitled%202.png)

## Running on Railway

Railway has two options to deploy a rails app.
Both include the standard recommended approach of linking your GitHub account/repo to a particular branch (defaulted to `main`). I’m not going to cover that piece here as it has become pretty standard practice for a lot of services today, and they do a pretty good job of walking you through it.

Start by creating a new project and follow the GitHub prompts. Before the first deployment, you’ll have a chance to enter any Environment Variables. Take a second to add anything you’d need — leaving out the DATABASE_URL for now. This would include RAKE_ENV, RAILS_ENV, NODE_ENV, PORT, RAILS_MASTER_KEY, SECRET_KEY_BASE, etc. (depending on your setup)

**With Docker**
With Rails 7 you have a Dockerfile out of the box.
If you make zero changes and link a `rails new` app to Railway, it will auto-detect the Dockerfile and build using Docker. This honestly just worked out of the box and was a great experience. However, things start to get a little tricky if you want to introduce that worker thread. Maybe it’s an old hat habit, but I tend to lean into the second option here.

**With a Procfile**
Good ‘ol Procfile.
If you’ve deployed to Heroku and others in the past, this was the norm. Railway is also set to use a Procfile by default, so if you are migrating from Heroku or another, this should be straightforward. Railway even has some notes to cover that process in full [here](https://railway.app/heroku).

For me and this sample app, I have the normal web app and solid_queue running in a side worker.

```jsx
web: rake db:migrate && bin/rails server -b 0.0.0.0 -p ${PORT:-3000}
worker: bundle exec rake solid_queue:start
```

For this to automatically work with Railway, I renamed the Dockerfile to something bogus and pushed it back up with my Procfile. Railway then uses its nix-packs and leverages the Procfile to kick everything off. You should see both the web and worker logs when viewing the “deploy logs.”

**Adding the Database**

At this point, your app may still be failing in the build due to not having a Database. Lets go ahead and take care of that. The first thing I update in the code is to mark my Production config to use `DATABASE_URL` we don’t really have control over the database name here and honestly, I’d rather manage one ENV > all the pieces.

```ruby
# database.yml
production:
  <<: *default
  url: <%= ENV["MY_APP_DATABASE_URL"] %>

```

Don’t push just yet!

Back in Railway, let's add our PG Database.
Render has a handy CMD+K / Ctrl+K command for adding a new service (or finding the button in the dash). A menu should pop up, allowing you to search for “Postgres.”

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/rails-on-railway/Untitled%203.png)

Add the Postgres service and you should see both services running.

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/rails-on-railway/Untitled%204.png)

Click on your repo application and click Variables. Railway has a quick helper to add the linked Postgres `DATABASE_URL`. This is super handy for ANY service you continue to add.

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/rails-on-railway/Untitled%205.png)

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/rails-on-railway/Untitled%206.png)

### Re-Click Deploy

At this point, your new app should have all it needs to get rolling. From here monitor the build/deploy logs for anything specific to your application.

## Conclusion

As I mentioned, there’s never a silver bullet solution for Software or deployment needs. That said, Railway does seem to offer some pretty solid Usage-based pricing that can take you pretty far. I’d highly consider having this as an option in your tool belt before buying into giant infrastructure (and the overhead that comes with it).

Until next time! 🙂
