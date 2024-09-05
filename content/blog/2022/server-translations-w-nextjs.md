---
title: "TIL: ServerSide Translations w/ NextJS"
description: The other day I spent way to long trying to get translations to work ServerSide inside a NextJS API route. Honestly, I did not expect it to become the issue it was. I blamed the weak coffee but continued to dive in. To my surprise, there wasn’t a well-documented answer. I validated some claims in Discord, got a handful of responses that led me down a decent path, and now here I am to share my tale.
og:
  title: "TIL: ServerSide Translations w/ NextJS"
  description: Brew some coffee and lets dive in
path: '/blog/2022/server-side-translations-with-nextjs'
image:
  src: https://ik.imagekit.io/mthomps4/site/posts/server-side-translations-w-nextjs/featured.png
  alt: og-image
publishedOn: "2022-12-08"
tags: ["NextJS", "Translations"]
organization:
  name: Echobind
  site: https://echobind.com
---

<img src="https://ik.imagekit.io/mthomps4/site/posts/server-side-translations-w-nextjs/featured.png" alt="featured.png" class="featured-image">

## Intro

You know the idea: if you have to spend a lot of figuring something out and/or it was hard to find on the interwebs… you should probably write about it. If for no other reason than being kind to your future self. So hello future me 👋🏼!

Recently I spent way too long trying to get translations to work ServerSide inside a NextJS API route. I did not expect it to become the issue it did. At first, I blamed the weak coffee, but then I continued to dive in. To my surprise, there wasn’t a well-documented answer. I validated some claims in Discord, got a handful of responses that led me down a decent path, and now here I am to share my findings.

## The Issue

So, what was I trying to do…

I’ve been working a ton with Twilio lately. I have started pulling together some concrete examples in an app for future us/me. Specifically, in this scenario, I was working with SMS and simply wanted to supply a translated body for the message going out. Easy enough, right? Grab the user's locale, translate the “Welcome, Johnny!” message, and fire away. In previous stacks translations become a class service util and, well, you just use them - anywhere and everywhere - without really thinking too much about it.

Off I go to do just that. I set up my `public/locale` folder. Created an `sms` namespace with my test message, added to my API call, and… 💥

Huh?!

Did I miss something in the config?

I decided to validate on screen via the client.

Yup, that worked?! What the…

After searching around I came to find out that the majority of React/NextJS pieces are client driven utils. Meaning all that config and setup is meant for the React useHook. There wasn’t a non-client facing utility to be found… or at least the weak coffee was not helping me find it. Then I went hitting all the channels to see what I could be overlooking.

## The Solution

Create a global i18n instance that can be passed around for both the Server and the client and leverage `i18next-fs-backend` for our API routes. Below you’ll see we have three methods the main `createI18nClient` and two utils I created that wrap the client for quick use `translator` and `translate`. The translator returns the client mapped to the namespace, locale, and translate going ahead and doing the good thing by returning our translated body text.

```tsx
// https://discord.com/channels/752553802359505017/1046900384481951754/1047052679492419614
import path from 'path';
import { readdirSync, lstatSync } from 'fs';

import i18n, { InitOptions } from 'i18next';
import i18nextFSBackend from 'i18next-fs-backend';
// import { i18n as i18nConfig } from 'next-i18next.config';
import { I18n, InitPromise, CreateClientReturn } from 'next-i18next';

let globalInstance: I18n;
const localesFolder = path.join(process.cwd(), '/public/locales');

type TranslatorProps = {
  template: string;
  ns: string[];
  args: object;
  lng?: string;
};

type UseTranslatorProps = {
  ns: string[];
  lng?: string;
};

type CreateInstanceProps = {
  locale?: string;
  namespaces: string[] | readonly string[];
};

const createI18nClient = ({ namespaces }: CreateInstanceProps): CreateClientReturn => {
  let instance: I18n;

  const config: InitOptions = {
    initImmediate: false,
    fallbackLng: ['en'],
    // NOTE: pass in locale to make this dynamic -- originally imported from 'next-i18next.config' compile issue in CI
    // fallbackLng: i18nConfig.defaultLocale,
    ns: namespaces,
    // lng: i18nConfig.locales.includes(locale) ? locale : i18nConfig.defaultLocale,
    lng: 'en',
    // preload for server side -- preload ['en']
    preload: readdirSync(localesFolder).filter((fileName) => {
      const joinedPath = path.join(localesFolder, fileName);
      return lstatSync(joinedPath).isDirectory();
    }),
    backend: {
      loadPath: path.join(localesFolder, '{{lng}}/{{ns}}.json'),
    },
    load: 'all',
    // return empty string instead of key if something went wrong
    saveMissing: true,
    saveMissingTo: 'all',
    missingKeyNoValueFallbackToKey: true,
    parseMissingKeyHandler: (key) => {
      console.log('Missing Key:', key);

      return '';
    },
    // useSuspense to avoid first render issues
    react: { useSuspense: true },
    // debugging info
    debug: false,
  };

  if (!globalInstance) {
    globalInstance = i18n.createInstance(config);
    instance = globalInstance;
  } else {
    instance = globalInstance.cloneInstance(config);
  }

  let initPromise: InitPromise;

  if (!instance.isInitialized) {
    instance.use(i18nextFSBackend);
    initPromise = instance.init(config);
  } else {
    initPromise = Promise.resolve(i18n.t);
  }

  return { i18n: instance, initPromise };
};

export default createI18nClient;

// returns 't' as you would expect
export const translator = ({ ns, lng = 'en' }: UseTranslatorProps) => {
  const { i18n } = createI18nClient({ namespaces: ns, locale: lng });

  return i18n.t;
};

// Just do the good thing... I don't care about my options here.
export const translate = ({ template, ns, args, lng = 'en' }: TranslatorProps) => {
  const { i18n } = createI18nClient({ namespaces: ns, locale: lng });

  const { t } = i18n;
  return t(template, { ...args, ns });
};
```

## In Practice

Because this import is now global util — they both work consistently the same, as expected! 🎉

### Client Side

```tsx
import { translator } from '../utils/i18n-translator';
...
const t = translator({ ns: ['common'] });
const welcomeMessage = t('welcome', { firstName });
```

### Server Side

```tsx
import { translator } from '../utils/i18n-translator';
...
const t = translator({ ns: ['common'] });
const welcomeMessage = t('welcome', { firstName });
```

## Conclusion

While there may be room for improvement here, I’m happy where this landed. I was able to start translating messages from my API as expected, and I now have a better understanding of NextJS and its translation setup.
