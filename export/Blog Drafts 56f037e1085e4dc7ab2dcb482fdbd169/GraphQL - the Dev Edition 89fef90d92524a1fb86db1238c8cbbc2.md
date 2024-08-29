# GraphQL - the Dev Edition

---

### Intro

There's a lot of hype around GraphQL these days. As a developer I've spent the last 3 plus years implementing GraphQL API's in Elixir and Node, watching the tooling and community grow along the way. In this post I hope to shed some light on the Pros and Cons, packages used, and hopefully leave you and your team with enough insight to make an informed decision on GraphQL. 

*Note: Your GraphQL server does not have to be implemented with Node. However, I will be detailing a bit of GraphQL history with JavaScript in mind as most will be interacting with these tools at some point via the client. You can see a full list of supported server languages at [graphql.org/code](http://graphql.org/code).*

Trying to pitch GraphQL to your investors and founders? Check out @mikes non-technical pair article here.

## Outline:

...

If you want to skip to the Pro/Con section... 

### What's the Hype all about?

> GraphQL is an open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data.
> 

As is with any new shiny web tool we'll start with the source website. 

[graphql.org](http://graphql.org) does a good job at detailing most of the "What Am I?" so I'm not going to veer too far from that here. Navigating to [graphql.org](http://graphql.org) you'll be greeted with a landing page that gives a quick 3 bullet response to the Pros you hear about often. 

- Describe your data
- Ask for what you want
- Get predictable results

We will talk about these points more in a moment, but for a lot of lead developers, we have the responsibility to research these tools to ensure their merit. The last thing we want is to see our team ramp up on a new open-sourced tool only to have it crumble from underneath us a few months later. With the open-sourced community being well... open-sourced. We tend to have a pessimistic approach to development and the tools we use, or at least I do. My internal conversations start with something like "That all sounds great, but everyone hypes up their work. How do I know I can trust this one?" 

**History of GraphQL** 
Let's take a quick dive into how it all started and where a few packages are now. 

Google searching around you'll find that GraphQL started by Facebook as an internal tool back in 2012. Facebook had an issue of building a solid API for their mobile apps that could consistently describe their data as they scaled. You can read more of their release details [here](https://engineering.fb.com/core-data/graphql-a-data-query-language/). As you can imagine this took a while to refine. By 2015 Facebook had now released this tool into the wild to help drive the process similar to how React grew into what we know today. Fast forward a few more years. GraphQL was moved from Facebook to the newly established [GraphQL Foundation](https://foundation.graphql.org/members/), hosted by [Linux Foundation](https://www.linuxfoundation.org/). Now you have a tool created by a tech giant, refined by the community, and supported by one of the largest open-source investors today. [Other companies](https://foundation.graphql.org/members/) as well have joined the GraphQL Foundation in support AWS, IBM, and Twitter being a few. If that's not enough a quick look into the JavaScript community shows the [graphql npm package](https://www.npmjs.com/package/graphql) alone was downloaded by over 2 million users last week. This is just one package within one community. Again, GraphQL is not tied to JavaScript. [graphql.org/code](http://graphql.org/code)

**History of GraphQL tools**

Great! GraphQL seems legit enough to look into further.
But now I notice there's a ton of tooling and ways to implement. 

Agreeably, the noise is hard to sort through. You search GraphQL and a ton of articles (like this one), packages, tools all appear. There are even articles like this one sharing ["13 GraphQL Tools and Libraries You Should Know in 2019"](https://blog.bitsrc.io/13-graphql-tools-and-libraries-you-should-know-in-2019-e4b9005f6fc2). 

I'm going to highlight a few of them here as a quick overview of where we are: 

- Express GraphQL
- GraphQL Yoga
- Prisma (1 and 2)
- Apollo Server
- AWS Amplify

**NOTE:** I'd like to mention that ALL of these packages have merit. There is no One Size Fits All GraphQL package. Explore the community, look around, and find what best suits your needs — Hopefully, this just gets you started. This is not meant to weigh one over ther other. 

 

**Express GraphQL**

Probably the quickest way to demo and experiment with GraphQL in my opinion. This setup uses the 'express-graphql' and 'graphql' packages. This used to be the example given within the graphql docs itself. Ignoring some details below you can see that Express sets up a route at `/graphql`. This exposes an endpoint pointing to our full `graphql` setup. From here it's all back to the GraphQL docs to learn how to build out a new Schema, Queries, Resolvers, etc. No doubt these two packages make up the foundation of some of the following tools. This setup will allow you to get your feet wet, spending more time in the GraphQL docs and less time in the "How do I set this thing up docs". 

```jsx
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = { hello: () => 'Hello world!' };

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
```

As the community took off with GraphQL you could imagine it became sort of a leg race to be THE GraphQL solve all. If you ask me — that marathon is still continuing today. The remaining list below has definitely grown and evolved since their first iterations, As a brief of each, I may have left something out... again they each have merit if something strikes your interest. Dive in! 

[**GraphQL Yoga**](https://github.com/prisma/graphql-yoga)

One of the first tools I remember seeing on the scene - GraphQL Yoga. A look into GraphQL Yoga and you'll see that it is a collection of packages and tools brought together to make remembering all the boilerplate setup you may need easier. When it started this used the express-graphql package above, but you'll notice now that it even uses one of the other tools mentioned here Apollo Server. So why not just use Apollo Server instead? In fact, some may opt for just that. GraphQL Yoga becomes a Pro/Con of abstraction. How much code do you wish to maintain vs having a tool do it for you? Will you run into a wall at some point? As with any magical create-thing package, you might, but for most common apps today, you probably won't. Use your own judgment here. 

 GraphQL Yoga's Pitch:

<aside>
📎 Using these packages individually incurs overhead in the setup process and requires you to write a lot of boilerplate. graphql-yoga abstracts away the initial complexity and required boilerplate and lets you get started quickly with a set of sensible defaults for your server configuration.

graphql-yoga is like create-react-app for building GraphQL servers.

</aside>

[**Prisma**](https://www.prisma.io/)

Prisma came on the scenes trying to solve the boilerplate issue. I already have my Database, I already have my models, can't we just wrap this in some way? Focusing more on Deployment options and wrappers Prisma started creating the idea of GraphQL as a service tooling. This came with pre-built filters from your models ditching all custom boilerplate you may have needed otherwise. Below you'll see their example of posts. prisma.posts already have a `where` and `orderBy` clause defined, but look further, `where` also has helpers for things like `*_contains`,* `_ends_with`, etc.   

```jsx
const posts: Post[] = await prisma.posts({
  where: {
    published: true,
    title_contains: "GraphQL"
    author: {
      email_ends_with: "@prisma.io"
    }
  },
  orderBy: "createdAt_ASC"
})
```

Prisma is now working on 2.0 which is to include it's own type of ORM tooling expanding the above into a more chain-able dot syntax and expanding it's database migration tools.

```jsx
const postsByUser: Post[] = await photon
  .users
  .findOne({ where: { email: 'ada@prisma.io' }})
  .posts()
```

At this point, GraphQL as a service seems to be a big push. I'll be interested to see how some of these tools shake out over time. Prisma learned a lot through its first iteration, and while the initial 1.0 setup felt a bit off, 2.0 seems to be making leaps based off community feedback. This is definitely worth keeping an eye on.

[**AWS Amplify**](https://aws-amplify.github.io/)

Do you run all your services in the cloud already? Thinking about it? Want to jump on the Serverless train? Similar to some other tooling AWS brings their services together to give you what seems to be as close to GraphQL as a service as you can be. In my opinion, I think we will be really close to "Point this tool at your database..." soon. You can set up your DB of choice, Add your Schema, Resolver logic, and let AWS manage the rest. Using something like AWS while with its own learning curve removes a lot of the overhead and boilerplate. You'll really be up and running quickly and back to focusing on solving your project's problems instead of configuring all the things. This also gives you the freedom to quickly tie into other AWS resource such as S3. Need to have an endpoint to upload files? You were probably going to use S3 anyway... Have IAM roles set. Use them with GraphQL for your authorization. Between Amplify and AppSync you'll be set in no time. 

Want to stay up to date with AWS Amplify? I'd recommend giving [Nader Dabit](https://twitter.com/dabit3) a follow. 

**Apollo Server**

I know I said there was no 'One Size Fits All' GraphQL package, I kind of lied. It's hard to search GraphQL and NOT see Apollo mentioned at this point in the game and for good reason. While AWS and others are pushing forward with serverless tech. Apollo, at least for now, has kind of set the standard for server/client setups. Regardless of which Server-side setup you choose, you'll be reaching for Apollo at some point for client-side. Apollo client has been the most supported, and community-driven, improving upon its cache store, subscriptions, and staying up to date with ESX features such and state management features like React Hooks. At this point Apollo has enough tooling and configuration options to merit it's own blog post. It's safe to say if you aren't sure which option is best for your team, Apollo is the safe bet. 

## GraphQL the good and bad

### Benefits

- **One API Endpoint** - Normally the first thing you hear about. Simplify all those REST routes for your user into one simple route. 
Example: `api/graphql` route. 

Granted you will be managing Queries and Mutations as "routes" but now the End User can infer these from automated schema docs, graphql playground, etc.
- **Data Normalization** - Sometimes your API may manage calls and data that aren't it's own. This is always awkward for the consuming User. What if it Errors? And now I have to parse this JSON blob and hope what I need is there. 
Turn those Third Party calls defined graphQL calls and normalize the return. This can be as simple as `{success: true, data: "JSON"}` Or take this further and define Types for `data`. Now not only can the user quickly parse a successful call, but they can ask specifically for the information needed.
    
    ```jsx
    getBlogPost {
      success
      data { id title body }
      errors
    }
    ```
    
- **Multiple Languages** - If you haven't caught on by now the community is huge. GraphQL has been around longer than most think and is more than just a fancy new way to build a web app. You can use GraphQL in just about any tech stack.  *[graphql.org/code](http://graphql.org/code)*
- **Ease in** - Outside of a bit of boilerplate you do not have to support your entire API all at once out of the gate. Initialize your GraphQL server and migrate a call at a time as needed. Supporting both your REST API and GraphQL API can be done simply by relaying calls between the two. There are also community works to wrap a REST API auto-magically with GraphQL. You don't have to rush it, take the time to define your types, in the long run, it is worth it.
- **Clean Data** - We've hinted at this already but your data now becomes typed and defined. As long as you've got some error handling in play. You can normalize all your results into something human-readable and reliable. Adding things like custom `Scalars` enhances your data ensuring it is serialized or parsed before ever reaching your DB/User.
- **Dynamic Use** - Once you get a few endpoints up and running you'll realize a lot of the functionality can be broken down into similar patterns. Patterns like filters, order, pagination, etc as well as relational lookups via Resolvers. Not only will these patterns simplify maintenance for your devs, but now it's on the end-user to ask for what they need. Instead of supporting 10 different routes for 'users' we simply have a query endpoint for `users` with all the required patterns in play. It's now on the end-user to decide what they need. Maintenance becomes adding new where filters with the appropriate joins as you scale, and the end-user is good to go. Your Front-End devs can also get used to this pattern. I need 'X' users with 'Y' posts. No more long conversations about which route does what, and worrying about if all the data returns. Ask and receive.
    
    ```jsx
    users(where: {...}, orderBy: {...}, pagination: {...}) {
      id
      firstName
      posts (where: {...}, orderBy: {...}) {
        id
        title
        body 
      }
    }  
    ```
    
- **Documentation** - Real talk: keeping documentation up to date is a pain. Tech moves fast. With tooling to auto-export Schema, GraphiQL, and [graphQL playground](https://www.prisma.io/blog/introducing-graphql-playground-f1e0a018f05d) at your fingertips, documentation is no longer an issue. Staying diligent to add a quick description line here and there and you are good to go. GraphiQl and Playground will pick up on these lines to give a description to the call, but because everything is now typed, they also show the defined input and output of said call. You may even opt to create a GraphQL playground for your external users/clients. Keep a live server up to date with your GraphQL schema that returns dummy data. Users/Clients can use this playground to get a feel for your API and learn how to integrate on their own. With its schema documented most questions can be answered without the back and forth phone calls.
- **Subscriptions** - Need real-time data? GraphQL supports subscriptions out of the box. Create your `Subscriptions` and have your FE peeps tie in.
- **Onboarding** - While I agree there is a lot of boilerplate to set up with GraphQL, but once you are up and running the patterns become super simple to replicate. Need a new Query endpoint? Anyone can look at previous examples and follow along. You may even use template utils to make this process even simpler. New team member? Have them interact with the GraphQL playground for a day. This will introduce business terminology, relations, and current use cases. With GraphQL your goal should be to follow consistent patterns for your end-users to take hold. Once you understand THE pattern, you're good to go on creating new types and maintaining older DB relations.
- **Customization** — It is worth noting again. Use GraphQL for what you need, how you need, with the tools you need.

### Counter Weights (Cons)

- **Boilerplate** - Agreeable there is some overhead to get up and running with GraphQL. You'll want to choose what seems to work best for your team and press forward. While you can slowly build up your API remember there is a Front-End overhead here as well. Your team will probably want/need to set up some sort of cache/store with Apollo to make these calls easier moving forward. When adding new endpoints, it's all about the pattern. It does become rinse/repeat but there is still a chunk to replicate.
- **Learning Curve -** There is a bit of a learning curve to GraphQL. What's a Mutation? What is a Resolver? How do I setup this the pattern I keep hearing about? Above, I mentioned that onboarding becomes easier to follow due to patterns in play. While that is true, your team will still need to learn, communicate, and establish this pattern. That takes time.
- **Momentum** - Continuing on the note above. Establishing the patterns and benefits takes time. The time benefits from GraphQL become visible later in the game. Your team is in the thick of your production app and new features and maintenance are occurring. In my opinion, GraphQL is a long term investment. Over time you will refine this build, adding helpful utils, solidifying filters, and relational lookups. As you scale, your team will become more efficient in building more and more into and with GraphQL. 

As an agency, sometimes this one can be frustrating. We build for our clients with the future in mind. Their team will benefit from the patterns and momentum, it is our job to get the stone rolling.

### Don't recreate the wheel.

While this may be obvious it's worth noting. GraphQL has a ton of support and a rallying community. Don't recreate the wheel before checking out the open-sourced world for solutions. You'll spend a lot of time building out GraphQL boilerplate that could have been a simple import. Some packages that come to mind.  

- Date Scalars
    
    Node:
    
    - [https://www.npmjs.com/package/graphql-scalars](https://www.npmjs.com/package/graphql-scalars)
    - [https://www.npmjs.com/package/graphql-iso-date](https://www.npmjs.com/package/graphql-iso-date)
    
    Elixir:  
    
    - [https://github.com/absinthe-graphql/absinthe/wiki/Scalar-Recipe](https://github.com/absinthe-graphql/absinthe/wiki/Scalar-Recipes)
    - [https://github.com/absinthe-graphql/absinthe/blob/master/lib/absinthe/type/custom.ex](https://github.com/absinthe-graphql/absinthe/blob/master/lib/absinthe/type/custom.ex)
- Dataloader
    - Node - [https://www.npmjs.com/package/dataloader](https://www.npmjs.com/package/dataloader)
    - Elixir - [https://github.com/absinthe-graphql/dataloader](https://github.com/absinthe-graphql/dataloader)
    - Python - [https://github.com/graphql-python/graphene](https://github.com/graphql-python/graphene)
- [Code Generating Typescript Types](https://github.com/dotansimha/graphql-code-generator)

### So is GraphQL a good fit?!

I usually go by a quick smoke test to determine if GraphQL is worth it. 

**NO** 

- I need to create a small website for my friend Joe.
- We don't see ourselves needing a lot of endpoints (simple web app)  
*Take the now vs later approach here.
Get the simple site up - wrap in GraphQL when/if you start to grow*

**YES**

- Are you supporting multiple Apps (Web/Admin/Mobile)
- Mobile API? (maybe look at Amplify)
- Is this a long term project that will continue to grow and scale

As to what tools, packages, etc. 
That is up to you. Use GraphQL for what you need, how you need, with the tools you need. 

## Conclusion

Stay tuned! 
I plan to follow up on this overview with some code. 
*"GraphQL - Talk is cheap, show me the Code!"*

I'll be diving into some of the patterns mentioned here, and showcasing some of our own "gotchas" we've solved for along the way.