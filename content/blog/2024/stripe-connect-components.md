---
title: Simplifying Stripe Connect with Embedded Components
description: How Stripe's embedded components ease the burden of implementing Custom Connect for a platforms.
og:
  title: Simplifying Stripe Connect with Embedded Components
  description: Discover how Stripe's embedded components streamline the implementation of Custom Connect for platforms.
path: /blog/2024/stripe-connect-components
image:
  src: https://ik.imagekit.io/mthomps4/site/posts/stripe-connect-components/connect-featured.png
  alt: Stripe Connect Components
publishedOn: '2024-09-11'
tags:
  - Stripe
  - Stripe Connect
organization:
  name: Echobind
  site: https://echobind.com
---

<img src="https://ik.imagekit.io/mthomps4/site/posts/stripe-connect-components/connect-featured.png" alt="Stripe Connect Components" class="featured-image">

## Introduction

Implementing a robust payment system for platforms that connect businesses with customers can be a complex endeavor. Stripe Connect has long been a go-to solution for marketplaces, SaaS platforms, and crowdfunding sites. However, the implementation process often required significant development effort and careful attention to compliance requirements. At times even feeling locked in or insecure about decisions made between Express, Standard, and Custom Connect. Enter Stripe's embedded Connect components – a game-changer in simplifying this process.

## The Challenge of Custom Connect

Traditionally, implementing Stripe Connect involved several challenges:

1. Building custom onboarding flows
2. Ensuring compliance with varying regulations across different countries
3. Maintaining and updating these systems as requirements change
4. Handling complex edge cases and user errors

These challenges often led to longer development cycles and increased the potential for errors or oversights in the implementation.

## Stripe's Embedded Components: A Solution

Stripe has introduced [components](https://docs.stripe.com/connect/get-started-connect-embedded-components) for Connect, which address many of these pain points. These pre-built, customizable UI components significantly reduce the complexity of implementing Connect. They are available as a plain JS SDK and React library to fit your needs. Here's how they help:

### 1. Simplified Onboarding

The embedded components provide ready-to-use UI elements for onboarding connected accounts. These components handle:

- Information collection
- Identity verification
- Bank account or debit card input

By using these components, platforms can dramatically reduce the time and effort required to create a smooth onboarding experience.

### 2. Automatic Compliance Updates

One of the biggest advantages of using Stripe's embedded components is that they automatically stay up-to-date with the latest regulatory requirements. This means:

- Less worry about keeping up with changing regulations
- Reduced risk of non-compliance
- Fewer resources dedicated to maintaining compliance

### 3. Customization and Branding

<https://docs.stripe.com/connect/customize-connect-embedded-components>
Despite being pre-built, these components offer a high degree of customization. Platforms can:

- Adjust the look and feel to match their brand
- Choose which information to collect
- Decide on the flow of the onboarding process

This flexibility ensures that platforms can maintain their unique identity while benefiting from Stripe's robust infrastructure.

### 4. Improved User Experience

The components are designed with user experience in mind. They offer:

- Mobile-responsive designs
- Clear error messaging
- Intuitive flows that reduce user confusion

This results in higher conversion rates for connected account onboarding.

## Implementation Example

<https://docs.stripe.com/stripe-js/react>
Here's a simple example from the [Stripe React Connect JS](https://github.com/stripe/react-connect-js) library on how you can leverage components for dashboards like Payment and Payout information.

```sh
npm install --save @stripe/connect-js @stripe/react-connect-js
```

```ts
import React from 'react';
import ReactDOM from 'react-dom';
import {loadConnectAndInitialize} from '@stripe/connect-js';
import {
  ConnectPayments,
  ConnectPayouts,
  ConnectPaymentDetails,
  ConnectComponentsProvider,
} from '@stripe/react-connect-js';

const fetchClientSecret = async () => {
  // Fetch the AccountSession client secret by making an API call to your service
};
const connectInstance = loadConnectAndInitialize({
  publishableKey: '{{pk test123}}',
  fetchClientSecret: fetchClientSecret,
  appearance: {
    variables: {
      colorPrimary: '#228403', //optional appearance param,
    },
  },
});

const App = () => (
  <ConnectComponentsProvider connectInstance={connectInstance}>
    <ConnectPayments />
    <ConnectPayouts />
    <ConnectPaymentDetails
      onClose={() => {
        console.log('closed');
      }}
      payment="pi_test123"
    />
  </ConnectComponentsProvider>
);

ReactDOM.render(<App />, document.body);
```

## Resources

For more information on Stripe Connect Components, check out the following resources:

- [Stripe Connect Components](https://docs.stripe.com/connect/get-started-connect-embedded-components)
- [Component List](https://docs.stripe.com/connect/supported-embedded-components)
- [Stripe React Connect JS](https://github.com/stripe/react-connect-js)
- [Stripe React Docs](https://docs.stripe.com/stripe-js/react)
