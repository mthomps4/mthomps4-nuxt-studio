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
publishedOn: '2024-06-03'
tags:
  - Railway
  - Puppeteer
  - Browserless
  - PDF
draft: true
_draft: true
---

## Intro

We recently migrated a service over to Railway and noticed a significant increase in the time it took to generate PDFs. Build Errors... Blah blah blah.

From the PR:

On Railway, we're using a headless browser instance provided by Browserless. Browerless takes care of all the Chrome/Puppeteer dependencies, so we don't have to worry about them.

To get access to the Browserless instance on Railway, leverage theBROWSER_WS_ENDPOINT environment variable along with the connect method in Puppeteer. Any puppeteer calls after that should be 1:1. For local development, you can use the same endpoint from Staging or allow the fallback to a local Chrome instance.

```ts
    const getBrowser = async () => {
      if (process.env.BROWSER_WS_ENDPOINT) {
        // Use Browserless for both development and production
        return await puppeteer.connect({
          browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT,
        });
      } else {
        // Fallback to local Chrome instance if BROWSER_WS_ENDPOINT is not set
        return await puppeteer.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless=new'],
          ignoreDefaultArgs: ['--disable-extensions'],
        });
      }
    };

    const browser = await getBrowser();

    // other logic here...
```

feat: Utilize Railway Browserless for puppeteer
<https://railway.app/template/browserless>
<https://docs.browserless.io/#using-puppeteer>

updated: README
fix: remove unused
Adds Dev vs PROD browser.
adds cache folder for local dev <https://pptr.dev/guides/configuration#changing-the-default-cache-directory>
TL;DR why Browserless
To keep Puppeteer launching in code, we would have to build our own Dockerfile for Railway that has all the deps for Chrome-Linux, etc. Using Browserless keeps our build slim for application needs and not what Puppeteer / Chrome needs.

<https://pptr.dev/troubleshooting#could-not-find-expected-browser-locally>
<https://pptr.dev/troubleshooting#chrome-doesnt-launch-on-linux>
<https://github.com/ryannono/Puppeteer-Railway-Buildpack/blob/main/nixpacks.toml> (check links above for latest deps)
