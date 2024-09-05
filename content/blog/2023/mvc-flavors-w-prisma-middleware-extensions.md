---
title: MVC flavors with Prisma Middleware and Extensions
description: Add that extra magic touch to your Prisma models with Middleware and Extensions.
og:
  title: MVC flavors with Prisma Middleware and Extensions
  description: Add that extra magic touch to your Prisma models with Middleware and Extensions.
path: '/blog/2023/mvc-flavors-w-prisma-middleware-extensions'
image:
  src: https://ik.imagekit.io/mthomps4/site/posts/mvc-flavors-w-prisma-middleware-extensions/featured.webp
  alt: Fox with goggles
publishedOn: "2023-01-12"
tags: ["Prisma", "NextJS", "MVC"]
organization:
  name: Echobind
  site: https://echobind.com
---

<img src="https://ik.imagekit.io/mthomps4/site/posts/mvc-flavors-w-prisma-middleware-extensions/featured.webp" alt="featured.png" class="featured-image">

## Intro

While working at Echobind, we are huge React and [Prisma](https://www.prisma.io/) fans. We’ve even built our own template called [Bison](https://github.com/echobind/bisonapp) which leverages all of our favorite tools including a [Prisma Factory](https://github.com/echobind/prisma-factory) lib that we are working on re-releasing soon. While these tools are fantastic, coming back over from a non-React stack (Rails at the time) I found myself feeling like something was missing. I kept reaching for full Model classes wanting that MVC feel. While yes, “we aren’t in Kansas anymore Toto” it felt like something I *should be able to handle at the Model/Database level in our stack.

I went searching for a way to add helpers, before/after hooks, virtual fields, etc to our Models. While we could create some helper util, add logic somewhere, all the things. My colleague [Alex](https://twitter.com/ralex1993) informed me of some magic Prisma had just released called [Extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions). This mixed with Prisma’s [Middleware](https://www.prisma.io/docs/concepts/components/prisma-client/middleware) functionality opened the door for MVC heart to experiment with what I had been missing out on.

## Middleware

 Middleware provides a great way to:

- Create audit trail logs
- Add a before/after save hook
- Return a virtual field alongside the model

*** As a best practice, leverage the Model and action to avoid running your logic all the time.*

```tsx
prisma.$use(async (params, next) => {
  if (params.model == 'User' && params.action == 'create') {
    // Logic only runs for the create action and User model
  }
  return next(params)
})
```

## Extensions

Extensions provided a great way to create new helper methods on the Model itself to mimic a “Class” like feel. For example, on our `User` model, I was able to create a new method called `signUp` that created a set of default relations for that User. Mixed with Middleware, I was also able to conditionally send this new person a Welcome Email and/or Opt-In message for SMS. Again, while we could have all sorts of logic sprinkled around. Having this logic all be together at the Model level is fantastic in my opinion. For me, this solves the “But what if we forget to call ‘x’” concerns and keeps everything bundled and consistent.

## Conclusion

It works!
Admittedly, there are ways to create a `signUp` util that “keeps it all together” without Prisma extensions. That said, I’m still loving having this control at the Prisma/Database level and it makes my MVC brain smile seeing the potential this will have as Prisma and React continue to evolve.
