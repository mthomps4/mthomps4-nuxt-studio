# Go, Go, Gadget Expo!

![top-secret-gadget-phone-photo-u2.jpg](Go,%20Go,%20Gadget%20Expo!%20d29ec375a41c4cbea1d15bfc86503d91/top-secret-gadget-phone-photo-u2.jpg)

## Intro

I have no shame in saying that up until now I've stayed out of the Mobile Dev space simply out of spite. While I love apps and want to experiment with all the latest devices, this wasn't obtainable to me (or most) due to the giant pay gate that is Apple Tax. You had to have a mac to run XCode and you needed to pay for the subs to release even an Alpha Build. Not to mention, at the time, there were all the legal snafus if you took payments from within your app. To sum it up, when I started, it would have been $1200 for the "privilege" where Apple could still say "No". Compare that to the 101 ways I can learn to build for the web... for free... no thanks Apple. I just couldn't back it. 

## The harsh reality

The harsh reality, outside of work no one uses a browser, or wouldn't if they had the choice. I myself don't `www dot` all the things, why should I expect my clients to be any different. This is being pushed more so as devices are starting to blur. Hardware is aligning, laptops and tablets are one and the same. Desktops are more app-driven and even more so as Windows has started pushing better support for Android, and local Linux development. This means **it's time** to dive in. iOS, Android, and Desktop alike — it's an app vs app world. Despite all the "tax", it's inevitable at this point. However, that doesn't mean we should simply accept it as a norm... and thankfully, others have been pushing this agenda as well. 

## Insert Expo Go

Here at EB, we've built React Native in a variety of ways. Experimenting with a bare RN app, creating our own template, and recently diving into Expo's bare workflow. All attempting to stay flexible and open to meet our client's needs. When I started my React Native journey I compared a bare RN app to a bare Expo app. In doing so, I stumbled upon a few extra things that caught my attention and solved one of my major issues with the complaints above. EAS cloud builds. 

When installing Expo for the first time, the line below caught my attention. 

> You don't need macOS to build an iOS app with Expo, you only need an iOS device to run the Expo Go app. For your development machine, Windows, Linux, and macOS are all supported.
> 

Wha?!  That's new. This certainly wasn't achievable a few years ago to my knowledge. 

You've got my attention Expo, let's go. When starting, I found out there was a small price to pay for a premium developer plan that included Development Builds and Cloud Builds. 
*I know, I know, I mentioned I hated all the nickel and dime tax... but hear me out.* Since my exploration, Expo has actually roped these features into the Free build! 

![legacy-plan.png](Go,%20Go,%20Gadget%20Expo!%20d29ec375a41c4cbea1d15bfc86503d91/legacy-plan.png)

[https://expo.dev/pricing](https://expo.dev/pricing)

![Untitled](Go,%20Go,%20Gadget%20Expo!%20d29ec375a41c4cbea1d15bfc86503d91/Untitled.png)

### What does all this mean?

The TL;DR here, Expo has lowered the pay gate for mobile developers everywhere. 

I can now write my code anywhere leveraging Expo for Local Development, test builds with the team, and submitting to the app store. To really put this to the test, I was able to use my Raspberry Pi to make changes to an app, debug and view those changes on my iPhone, and publish the Alpha release to the Team. **Total Cost: $130**. A huge leap from the entry MacBook you'd previously need. You can imagine this only gets better as VSCode Dev, codespaces, etc. gain more momentum. 

I'm excited that the entry point to mobile development is becoming less of a privilege. The fact that I can now recommend a few Free tiers for folks to see their work on a physical device is life-changing. Literally. 

**EAS UPDATE BLOG POST:** 

[https://blog.expo.dev/introducing-eas-395d4809cc6f](https://blog.expo.dev/introducing-eas-395d4809cc6f)

*****Should I explain the Workflow... second blog... good enough?**

### The workflow

Screenshots and CLI commands used for Local and Alpha testing.