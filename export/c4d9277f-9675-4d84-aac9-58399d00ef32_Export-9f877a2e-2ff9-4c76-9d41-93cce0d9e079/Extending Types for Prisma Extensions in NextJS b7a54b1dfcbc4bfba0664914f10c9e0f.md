# Extending Types for Prisma Extensions in NextJS

Created: December 8, 2022 3:01 PM
Status: Published
Planned Publish Date: January 4, 2023
Author: Matt Thompson
Slug: extending-types-for-prisma-extensions-in-nextjs
SEO Title: Extending Types for Prisma Extensions in NextJS
Social Caption: The issue is that now the type PrismaClient has no clue about our new Extensions and the types within. In this use case, we are attempting to create a new signUp method on the User model… Lets see how we can solve that. 
Approvers: Usman Ibrahim

If you read my [previous post](https://echobind.com/post/playwright-with-next-auth), you’ll note that I was very excited to try out Prisma’s new [Extensions](https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions) alongside their [Middleware](https://www.prisma.io/docs/concepts/components/prisma-client/middleware) and try out various use cases. When test driving I did hit a snag rebuilding the Types for our new extension to pull through. 

If you are running Prisma with NextJS you’ve probably followed this initial best practice doc: [https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices](https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices)

Here we define `prisma` in the `global` object so that we don’t create a bazillion instances of Prisma and have the world crashing down on us. If you are using Typescript, this `global` instance was probably Typed. in our case we had: 

```tsx
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
```

## The Issue

The issue is that the type `PrismaClient` has no clue about our new Extensions or the types within. In this use case, we are attempting to create a new `signUp` method on the `User` model.

```tsx
const extendedPrisma = prisma.$extends({
    model: {
      user: {
        async signUp(args: SignUpArgs): Promise<UserWithRelations> {
          return await prisma.user.create({
            ...args,
          });
        },
      },
    },
  });
```

So how do we fix this?…

## The Solution

Turn `const prisma` from the previous example into a function that returns the newly created `extendedPrisma` context. When setting the global prisma value we use this value and Type instead. Now when we import `prisma` it should include our new model action `signUp` and type validations as seen below.

### The Code

```tsx
import {
  Prisma,
  PrismaClient,
  Profile,
  User,
} from '@prisma/client';

export const defaultUserSessionIncludes = {
  profile: true,
} as Prisma.UserCreateArgs['include'];

export type UserWithRelations = User & {
  profile: Profile;
};

// Set default prisma logs. More logs in debug mode.
const logOptions: Prisma.LogLevel[] = process.env.DEBUG ? ['query', 'error'] : ['error'];

type UserCreateArgsWithProfile = Omit<Prisma.UserCreateArgs['data'], 'profile'> & {
	// Require Profile for signup  
	profile: Prisma.UserCreateArgs['data']['profile']; 
};

// mimics Prisma.UserCreateArgs
type SignUpArgs = {
  data: UserCreateArgsWithProfile;
  include?: Prisma.UserCreateArgs['include'];
};

const extendedPrismaClient = () => {
  const prisma = new PrismaClient({
    log: logOptions,
  });

  const extendedPrisma = prisma.$extends({
    model: {
      user: {
        async signUp(args: SignUpArgs): Promise<UserWithRelations> {
          return await prisma.user.create({
            ...args,
          });
        },
      },
    },
  });

  return extendedPrisma;
};

export type ExtendedPrismaClient = ReturnType<typeof extendedPrismaClient>;

/**
 * Instantiate prisma client for Next.js:
 * https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices#solution
 */

declare global {
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined;
}

export const prisma = global.prisma || extendedPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export async function disconnect() {
  await prisma.$disconnect();

  return true;
}

export async function connect() {
  await prisma.$connect();

  return true;
}
```

![Untitled](Extending%20Types%20for%20Prisma%20Extensions%20in%20NextJS%20b7a54b1dfcbc4bfba0664914f10c9e0f/Untitled.png)

### If you are using Next-Auth

One other note if you are using Next-Auth. 
We kept hitting a snag with the types for Next-Auth’s `PrismaAdapter`

Again, it expects a type of `PrismaClient` but we want to pass our new `ExtendedPrismaClient` type instead. 

There was a weird type of error trying to recast this for some reason complaining about Prisma’s `$use` missing on our type. Remembering this is still in the **Experimental Phase.** We didn’t try to dive in too hard here, rather we cast as `unknown` first before passing along the types expected for the adapter. While not ideal, it does work and is something we’ll monitor as Prisma continues to wrap this feature up. 

```tsx
export const authOptions: NextAuthOptions = {
  adapter: CustomPrismaAdapter(prisma as unknown as ExtendedPrismaClient),
  ... 
}

function CustomPrismaAdapter(p: ExtendedPrismaClient) {
  const prismaAdapter = PrismaAdapter(p as unknown as PrismaClient);
...
}

```

## That’s all folks!

Remember to restart that Typescript Server folks. 🙂
I kept battling this a few times only to realize I needed to “turn it off and on again”.  Once set, you’ll be ready to keep tacking on new extensions and middleware!