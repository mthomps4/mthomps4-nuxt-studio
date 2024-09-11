---
title: Browserless Puppeteer
description: Skip the PDF dependencies by leveraging Browserless with Puppeteer.
og:
  title: Browserless Puppeteer
  description: Skip the PDF dependencies by leveraging Browserless with Puppeteer.
path: /blog/2024/browserless-puppeteer
image:
  src: https://ik.imagekit.io/mthomps4/site/posts/browserless-puppeteer/featured.jpeg
  alt: og-image
publishedOn: '2024-09-01'
tags:
  - Railway
  - Puppeteer
  - Browserless
  - PDF
organization:
  name: Echobind
  site: https://echobind.com
---

## Intro

During a recent migration of a service to Railway, we encountered a significant challenge with the Puppeteer package we were using for PDF generation. The package required numerous Linux dependencies, particularly for Linux-Chrome, which led to several issues:

1. Dramatically increased build times
2. Occasional build failures
3. Numerous warnings and troubleshooting logs, guided by Puppeteer's documentation:
   - [Puppeteer Linux Troubleshooting](https://pptr.dev/troubleshooting#chrome-doesnt-launch-on-linux)
   - [Puppeteer Chrome Troubleshooting](https://pptr.dev/troubleshooting#could-not-find-expected-browser-locally)

Initially, we considered creating a custom Dockerfile to manage these dependencies, as suggested in this [Puppeteer/Chrome nixpacks example](https://github.com/ryannono/Puppeteer-Railway-Buildpack/blob/main/nixpacks.toml).

However, our continued research led us to a more elegant solution: [Browserless](https://www.browserless.io/). We discovered that we could integrate Browserless within Railway to handle Puppeteer calls and manage all the necessary dependencies. This approach proved to be significantly simpler than building a custom Dockerfile, and the implementation process was surprisingly straightforward.

## The Migration

The migration ended up being a pretty easy process.

1. Create a new Railway app and select the ["Browserless" template](https://railway.app/template/0jqemX).
2. Update the `package.json` to remove the `puppeteer` dependency and instead use the `puppeteer-ci` package. (This does not include the chromium browser dependencies)
3. Include the new `BROWSER_WS_ENDPOINT` environment variable in the Railway app.
4. Update the code to connect to the Browserless instance. (see below)

```ts
    const getBrowser = async () => {
      if (process.env.BROWSER_WS_ENDPOINT) {
        // Use Browserless for staging and production
        return await puppeteer.connect({
          browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT,
        });
      } else {
        // Fallback to local Chrome instance if BROWSER_WS_ENDPOINT is not set for local development
        return await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new'],
          ignoreDefaultArgs: ['--disable-extensions'],
        });
      }
    };

    const browser = await getBrowser();
    // other logic here for generating PDFs

    const page = await browser.newPage();
    // continue with PDF generation per normal
```

In the above code, we're checking for the `BROWSER_WS_ENDPOINT` environment variable to be set. With this set, we can now leverage the `connect` method of puppeteer to connect to the Browserless instance rather than launching a local browser instance.

That was it! We were now able to leverage Browserless for PDF generation and not have to worry about any of the dependencies.

## Resources

- [Railway Browserless Template](https://railway.app/template/browserless)
- [Browserless Docs](https://docs.browserless.io/#using-puppeteer)
- [Puppeteer Docs](https://pptr.dev/)
