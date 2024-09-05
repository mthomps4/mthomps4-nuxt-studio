---
title: Playwright with Next-Auth and Prisma
description: Today, I wanted to go over how to quickly configure Playwright with Next-Auth… There are many options, but the most exciting for me is the ability to save our user sessions into a storageState for multiple user roles and re-use them in our specs.
og:
  title: Playwright with Next-Auth and Prisma
  description: Brew some coffee and lets dive in
path: '/blog/2022/playwright-with-next-auth'
image:
  src: https://ik.imagekit.io/mthomps4/site/posts/playwright-w-nextauth/two-masks.png
  alt: og-image
publishedOn: "2022-11-09"
tags: ["Playwright", "NextAuth", "Prisma", "NextJS"]
organization:
  name: Echobind
  site: https://echobind.com
---

<img src="https://ik.imagekit.io/mthomps4/site/posts/playwright-w-nextauth/two-masks.png" alt="featured.png" class="featured-image">

## Intro

You may have heard some rumblings in previous [blogs](https://echobind.com/post/why-we-ditched-graphql-for-trpc) and [tweets](https://twitter.com/alexdotjs/status/1589960174495625216) about Echobind moving to tRPC, and our team working on what we are calling [Bison 2.0](https://github.com/echobind/bisonapp). While tRPC is exciting, it is not the only change we are looking into. Over the past year, we have consistently started to leverage [Next-Auth](https://next-auth.js.org/), and have hit countless time sinks with Cypress. Next-Auth obviously plays into our stack built around NextJS, but testing it with Cypress always proved to be a bit… wonky. Having to build custom commands to use node and DB Factories, intercepting, mocking, and worst of all those `.then` waterfalls — Gross.

[Insert Playwright.](https://playwright.dev)

I’m happy to say Playwright has A LOT going for it out of the box in comparison.

Today, I wanted to go over how to quickly configure Playwright with Next-Auth. I was excited to see Playwright had already taken Authentication into account out of the box. There are many options, but the most exciting for me is the ability to save our user sessions into a `storageState` for multiple user roles and re-use them in our specs. No more `beforeEach` where we need to check the Database, create a User, Login, intercept the call, mock the return, wait for the redirect, oh wait what was I testing again…

Oh right, As an Admin I simply want to log in. Geez

Playwright has a whole section on Authentication, but we are going to specifically look at the multiple signed roles section found [here](https://playwright.dev/docs/test-auth#multiple-signed-in-roles).

## Sounds great! Where’s the code…

If you haven’t set up Playwright before, follow their quick setup here. [https://playwright.dev/docs/intro#installing-playwright](https://playwright.dev/docs/intro#installing-playwright)

Once set, you should have a `playwright.config.ts` file. (You did choose Typescript right?!)

We are going to add two lines to our default config. A `globalSetup` and `globalTeardown`.

```tsx
// playwright.config.ts

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve('./tests/e2e/global-setup'),
  globalTeardown: require.resolve('./tests/e2e/global-teardown'),
}
```

If you are familiar with Jest, or any other testing lib, this should sound straightforward enough. We are going to have two files that do something before and after ALL of our tests run. Here I’ve included these in my `test/e2e/` directory, just be sure you have the right file path and we’re all set here.

Let’s take a look at our `global-setup` file. (I’ve also included my `constants` file for reference)

```tsx
// tests/e2e/global-setup.ts

import { chromium, FullConfig } from '@playwright/test';
import { Role } from '@prisma/client';

import { UserFactory } from '../factories';

// Shared Below...
import { ADMIN, APP_URL, LOGIN_URL, USER } from './constants';

async function globalSetup(_config: FullConfig) {

  // These User Factories are specific to our boilerplate
  // The goal here is to create an Admin and User for your future specs

  const _adminUser = UserFactory.create({
    email: ADMIN.email,
    emailVerified: new Date().toISOString(),
    roles: [Role.ADMIN],
    password: ADMIN.password,
    profile: {
      create: {
        firstName: ADMIN.firstName,
        lastName: ADMIN.lastName,
      },
    },
  });

  const _user = UserFactory.create({
    email: USER.email,
    emailVerified: new Date().toISOString(),
    roles: [Role.USER],
    password: USER.password,
    accounts: {},
    profile: {
      create: {
        firstName: USER.firstName,
        lastName: USER.lastName,
      },
    },
  });

 // The fun part!
  const browser = await chromium.launch();
  const adminPage = await browser.newPage();
  await adminPage.goto(LOGIN_URL);
  await adminPage.locator('data-test=login-email').fill(ADMIN.email);
  await adminPage.locator('data-test=login-password').fill(ADMIN.password);
  await adminPage.locator('data-test=login-submit').click();
  await adminPage.waitForNavigation();
  await adminPage.waitForURL((url) => url.origin === APP_URL, { waitUntil: 'networkidle' });
  // This saves everything about `adminPage` so far into a named `storageState`
  await adminPage.context().storageState({ path: ADMIN.storageState });

  const userPage = await browser.newPage();
  await userPage.goto(LOGIN_URL);
  await userPage.locator('data-test=login-email').fill(USER.email);
  await userPage.locator('data-test=login-password').fill(USER.password);
  await userPage.locator('data-test=login-submit').click();
  await userPage.waitForNavigation();
  await userPage.waitForURL((url) => url.origin === APP_URL, { waitUntil: 'networkidle' });
  // This saves everything about `userPage` so far into a named `storageState`
 await userPage.context().storageState({ path: USER.storageState });

  // We are done for now :)
 await browser.close();
}

export default globalSetup;
```

```tsx
// tests/e2e/constants.ts

export const APP_URL = 'http://localhost:3001';
export const LOGIN_URL = 'http://localhost:3001/login';

// This is primarily args for our DB Factories
// storageState is the named path/file where Playwright will save our session
export const ADMIN = {
  email: 'brainiac@lex.com',
  firstName: 'Lex',
  lastName: 'Luther',
  password: '1amBrainiac!',
  storageState: './temp/adminStorageState.json',
};
export const USER = {
  email: 'clark@thedaily.com',
  firstName: 'Clark',
  lastName: 'Kent',
  password: 'krypton8!',
  storageState: './temp/userStorageState.json',
};
```

Let’s walk through this in a bit more detail.

After creating our Users for future scenarios, we’ll create a `browser` instance in playwright. From there we can open a specific `page` for each user. `adminPage` and `userPage` respectfully. Now for the fun part, each page/browser has `context` Playwright can keep track of and a `storageState` where all of this information can live until you want to call it again.

Looking at our `adminPage` calls, you’ll see we have instructed Playwright to navigate to the `LOGIN_URL` and log the user in before saving anything to `storageState`. This means, when we go to use the state for admin, we’ll already have an Admin User signed in to our app, cookies saved, and in our case redirected back to the home page ready to go.

In a `beforeEach` scenario, you might perform all these same steps minus the storageState save.  The beauty here is I don’t have to worry about creating a `beforeEach` block for ***every*** spec.

This means:

- Fewer DB hits
- Faster Specs
- Less maintenance and cleanup

## Test Example

Having our Admin and User defined in the global setup means we can make use of `test.use({ storageState: 'file-path-to-storage' });`

Our home page is a simple welcome message with the Users name.

```tsx
// pages/index.tsx

<Center>
  <Heading data-testid="welcome-header">
    {welcomeMsg}
  </Heading>
</Center>
```

```tsx
// tests/e2e/auth.spec.ts

import { Page, test, expect } from '@playwright/test';

import { ADMIN, APP_URL, USER } from './constants';

test.describe(() => {
  test.use({ storageState: USER.storageState });

  test('Can Login as a User', async ({ page }: { page: Page }) => {
    await page.goto(APP_URL);
    await page.waitForURL((url) => url.origin === APP_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('internal:attr=[data-testid="welcome-header"]');

    const welcomeHeader = await page.getByTestId('welcome-header');
    const welcomeMsg = `Welcome, ${USER.firstName}!`;
    await expect(welcomeHeader).toContainText(welcomeMsg, { ignoreCase: true });
  });
});

test.describe(() => {
  test.use({ storageState: ADMIN.storageState });
  test('Can Login as an Admin', async ({ page }: { page: Page }) => {
    await page.goto(APP_URL);
    await page.waitForURL((url) => url.origin === APP_URL, { waitUntil: 'networkidle' });
    await page.waitForSelector('internal:attr=[data-testid="welcome-header"]');

    const welcomeHeader = await page.getByTestId('welcome-header');
    const welcomeMsg = `Welcome, ${ADMIN.firstName}!`;
    await expect(welcomeHeader).toContainText(welcomeMsg, { ignoreCase: true });
  });
});
```

For each of these, we use the StorageState path for each user. Navigate back to the home page, and assert that we see our Welcome text.

A quick run with `yarn playwright test` and 1… 2… 3… ✅

## Conclusion

From async/await, the ability to run factories, and having robust options when testing different scenarios, Playwright has been a joy to work with so far in comparison. While this strategy may not work for every scenario, I’m a lot more confident in the tools Playwright has provided to be successful long term. Stay tuned for a more in-depth comparison as we continue to build out.
