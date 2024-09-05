---
title: Roll your own CDN
description: In this article, we will cover CDNs, whether you need one, and how to create your own with S3 and CloudFront. If you're curious about any of this, read on!
og:
  title: Roll your own CDN
  description: Lets explore how to create your own CDN with S3 and CloudFront.
path: '/blog/2024/role-your-own-cdn'
image:
  src: https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/featured.jpg
  alt: og-image
publishedOn: "2024-06-04"
tags: ["CDN", "S3", "CloudFront"]
organization:
  name: Echobind
  site: https://echoind.com
---

<img src="https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/featured.jpg" alt="featured.png" class="featured-image">

## TL;DR

In this article, we will cover CDNs, whether you need one, and how to create your own with S3 and CloudFront. If you're curious about any of this, read on!

## What are CDNs

What is a CDN? A Content Delivery Network (CDN) is a system of distributed servers that deliver web content to users based on their geographic location. This results in faster load times and improved performance, as content is served from a server closer to the user.

When it comes to CDNs for images, you've likely heard of major players like Cloudinary, Imgix, and ImageKit. These services excel with features like end-user cropping tools, extensive transformation options, and even new AI features to help enhance and edit. However, these benefits often come with significant costs and potential vendor lock-in. Additionally, features like external backups can quickly push you out of the free tier, making these services overkill for many use cases.

So, do you even need a CDN?

## Evaluating CDNs

Before setting up a CDN, consider whether you actually need one. For simple apps with a few static images—such as logos and accent images—hosting them alongside your app under `public/assets/` may suffice. With hosts like [Vercel](https://vercel.com/), placing images into a `public` folder will leverage their own CDN as the app is distributed. A CDN becomes essential when serving numerous dynamic assets to a global audience. For instance, blogs and e-commerce sites with images and videos for each post or item benefit greatly from a CDN, as it improves load times and SEO, especially for users far from your primary server location.

As previously mentioned, all of this can come at a cost if you aren’t careful. Are there other solutions? Of course! It’s 2024, we have all sorts of options.

## Setting Up Your Own CDN with S3 and CloudFront

If you decide a CDN is right for you but don't need the extensive features of services like Cloudinary, setting up Amazon S3 and CloudFront can be a cost-effective alternative. You can upload images to S3 in a way that suits your application, and once there, CloudFront can serve them globally without any issues.

Below, we will go over step-by-step to see what it takes to roll your own CDN with AWS.

To start, I’m going to assume you have the following:

- An [AWS account](https://aws.amazon.com/) and basic working knowledge of the AWS console.
- A domain you wish to use for your CDN. (optional, but recommended)
  - Basic understanding of DNS to add a CNAME. (we’ll walk through it 🙂)

In our approach below with S3 and Cloudfront, you can create a base CDN for nearly free (outside our domain usage). Cloudfront / S3 costs are usage-based, and their free tier is quite extensive.

[CloudFront Pricing](https://aws.amazon.com/cloudfront/pricing/)

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled.png)

## Creating the Bucket

First things first: We need a place to store our images. Insert good ‘ol AWS S3, which is known for becoming the junk drawer for most website assets. Let us head over to the AWS Console to S3 and create a new bucket. Feel free to name this bucket whatever you’d like, preferably something that makes sense for your application and/or environment. Example:`mysite-dev-assets` (local dev) `mysite-assets` (prod).

When creating the bucket, you’ll want to leave everything as PRIVATE and block all public access. We’ll update the Bucket Policy later to include the permissions we need.

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%201.png)

While we are here, go ahead and upload an image to your bucket. Feel free to use any image you would like or our puppy friend below. Be sure to name the file something easy, as this will become part of our URL later.  `puppy.jpeg` > `Screenshot Something something today's date.jpeg`

![https://images.unsplash.com/photo-1550948537-130a1ce83314?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb](https://images.unsplash.com/photo-1550948537-130a1ce83314?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb)

## Creating the CDN with Cloudfront

Alright, so now we have a bucket. Let's use CloudFront to create a CDN with our new bucket as the source. In AWS, search for CloudFront and navigate to its dashboard.  Select “Create Distribution”. If this is your first time, you may see a marketing landing page from AWS instead of the normal dashboard - the link should be on the right side in their standard yellow as “get started”.

You should be brought to a screen like the one below. Under Origin Domain, find your newly created bucket. Once selected, the name will auto-fill as well. I tend to leave this be and let it match, but feel free to update it to your liking (remember the name should you change it).

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%202.png)

The rest of the defaults should be good to start, but we’ll highlight a few to check here below.

We’ll only need GET access from our CDN, and we’ll want to leave this as HTTP & HTTPS for now.

**Protocol Access**

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%203.png)

**Logs**

One sneaky way AWS will hit your budget is with logs… unless you have a real need leave all the log options to “off” and “no” respectfully.

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%204.png)

**Firewall WAF**

This one is optional but worth pointing out. AWS offers some base protections for your CDN out of the box. You’ll note below that even at 0 requests, it’s a base $8.00 to add on. At something like 1 million requests, they estimate the WAF cost around $14.00.

This seems like a nice addition, but it can be added anytime. We’ll skip this step for now, but feel free to enable it if you are okay with the base cost starting out. For our basic site, we’ll look at a free CDN (or close to it minus the domain).

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%205.png)

**Settings**
Keep all the recommendations for Settings as well. Using all edge locations doesn’t really affect your cost—recalling the image above, it’s usage-based, meaning traffic comes through CloudFront regardless of location.

Note the section for the **Custom SSL Certificate.** We’ll be back here later to update this.

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%206.png)

**Click CREATE!**

… spinning … spinning … AND Don’t close those toast warnings!

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%207.png)

If we’ve done everything correctly, AWS tries to warn you that the Bucket Policy will need to be updated. You should see a Toast message with a “Copy Policy” button. If not, that’s ok. We can still take note of the `ARN` from the dashboard above to add our new bucket policy.

If you copied the Bucket Policy, you should end up with something like the following. If not, take note of the `ARN` and your bucket name to stitch together the JSON below. While we are still on the CloudFront distribution page, copy the `Distribution domain name` somewhere for future use. This is our new CDN URL (internal use).

**Sample Bucket Policy**

```json
{
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::{YOUR_BUCKET_NAME}/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "{CLOUDFRONT_ARN}"
                }
            }
        },
    ]
}
```

## Bucket Policy (CDN Permissions)

Let us navigate back to S3 and our Bucket.
Navigating to the permissions tab and scrolling down, you’ll see a white text box awaiting our new Bucket Policy. Let’s add the snippet above here and click save.

This tells AWS that our CloudFront CDN has `GetObject` permissions for this specific bucket. i.e., it has read permissions for our future GET calls.

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%208.png)

## Testing our CDN

Remember that `Distribution domain name`; let's give it a whirl.

On its own, you’ll hit a nasty AWS permission XAML screen. We don’t have any `index` page set for this route as it’s not a full “site,” and that’s okay.

Rather, you’ll want to match your buckets folder/asset structure and try to access your image.

If you uploaded our `puppy.jpeg` image to your bucket earlier, your URL should look something like this.

`your-domain.cloudFront.net/puppy.jpeg`

If everything checks out, you should see our puppy friend hosted by your new CDN in your browser. If not, double-check the Bucket Policy and CloudFront status. Ensure everything is deployed, permissions are correct, and the URL/image you are trying to access exists in your bucket.

🎉🎉🎉

Take a moment to celebrate and grab a beverage. We have a CDN!
🎉🎉🎉

Next, we’ll add a domain and IAM permissions to finish getting this tied into something we can use in the real world.

## DNS, It’s always DNS

Our CloudFront domain works, but I would not recommend showing the internal AWS domain to end users. It’s not the end of the world for CloudFront, but we try to avoid it as an AWS best practice in general. The more we can hide internals from end users, the better.

We can use a subdomain to alias our CDN via a CNAME if you have a domain handy. `assets.mysite.com/puppy.jpeg`

### Adding a Subdomain Alias

Navigate to where your domain is hosted, including Route53, DNSimple, GoDaddy, etc.

We aim to add a single CNAME for our new CDN Subdomain.

**CNAME:** `assets.mysite.com.` (*Note the end `.` may not be needed for some sites*)

**Content/Value:** [`your-domain.cloudfront.net`](http://your-domain.cloudfront.net) (copy your CDN Domain here)

**TTL:** Lower this to 1min or the smallest integer to kick everything off. Once set, we can bump this back up to the standard hour.

**DNSSimple Example:**

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%209.png)

### SSL Certificate

CloudFront expects everything to be over HTTPS. For everything to work properly, we’ll need an SSL cert for our new subdomain tied to our instance.

Head back over to the AWS console, but leave a tab open for more DNS changes.

In AWS, search for a service called `Certificate Manager`. We’ll use this to generate our SSL certificate. Similar to before, if this is your first time, you may see the landing page. Look for a “Request Certificate” button, and we’ll dive in.

🚨The first thing you’ll want to check in the top right is that your AWS region is set to “N. Virginia ‘us-east-1’”. CloudFront has a requirement here for us-east-1. Once in ‘us-east-1’, we can continue with Request Certificate.

Here, you’ll select `public` and land on the form for your SSL cert.
You’ll only need to add your new subdomain to the `fully qualified domain name` list. *Note: if you want `www` as a part of this, add both here. (`assets.mysite.com` &[`www.assets.mysite.com`](http://www.assets.mysite.com))*

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%2010.png)

Leave DNS validation, the default algorithm selected, and any tags (if you prefer), then click request.

Once created, you should see the start of the new SSL cert pending with a new CNAME name and value for your domain. *(You may need to refresh this page as it continues processing to see the updates)*

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%2011.png)

… and you guessed it. Navigate back to our DNS tab, and let's add that CNAME. Similarly, set the TTL here to something short until DNS has caught up and provisioned.

*Note: If you already have an SSL Certificate from your domain provider for **the subdomain**, you can also use the `import` feature.*

### Updating the CDN Settings

[https://dnschecker.org/](https://dnschecker.org/)

We're almost there—DNS may take a bit to update. While we wait, let’s finish up our last step back in AWS. Under the CloudFront dashboard, let's select our distribution and click “Edit”.

There are TWO settings we’ll need to update here.

**Alternate Domain Name (CNAME)**

This step is crucial for CloudFront to correctly associate the custom domain with your distribution and serve content over HTTPS using the appropriate SSL certificate.

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%2012.png)

**Adding the SSL Cert to CloudFront**

Find and select your new SSL cert.

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%2013.png)

**Click Save and wait for it to deploy…**

## Testing… Take 2

Once deployed, you should be able to see `puppy.jpeg` under your new CNAME alias.

[`assets.mysite.com/puppy.jpeg`](http://assets.mysite.com/puppy.jpeg)

![Untitled](https://ik.imagekit.io/mthomps4/site/posts/role-your-own-cdn/Untitled%2014.png)

## Applications In Practice

We have a CDN 🎉… but how do we get images in it?!

To get images into our source bucket, we’ll want to leverage an SDK with our app and utilize IAM keys for security. This could be any stack you choose, such as Node, Rails, C#, etc. The main change here is that we’ll need to update our Bucket Policy also to allow IAM keys for full CRUD operations.

Depending on your stack, the SDK will guide you on using the IAM key and secret to perform S3 operations. I won’t try to cover all those options here. We’ll simply look to create the IAM role and update the bucket policy for any stack to utilize.

Navigate to the AWS console one last time, and let's search for the `IAM` section. We will create a Programtic-only user and generate an API Key and Secret. Select the `Users` link on the left and `create a user`. Give this user a name specific to your application and environment for easy reference in the future (myapp-dev). Do NOT check the “access to console” option; our app will not need this. Next, click `attach policies directly` in the set permissions tab and search for “S3” in the new list. While you can refine which permissions you give these API keys, I’ll give it “[AmazonS3FullAccess](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-2#/policies/details/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FAmazonS3FullAccess)” to start (for demo’s sake). Continue to review and create; here, you can download and copy your key and value sets.

🚨Throw this in something like 1Password for future use - you will not see it again.

Once created, you should land back on the user’s dashboard.
Select your new user and take note of the `ARN` for that user.

It should look something like this:

`arn:aws:iam::{some-id}:user/{my-user-name}`

Copy this somewhere, and let's head back to our S3 bucket to make one final Policy change.

We’ll want to include BOTH the CloudFront permission and now our IAM permissions.

**Full Policy Example:**

```json
{
    "Version": "2008-10-17",
    "Id": "PolicyForCloudFrontPrivateContent",
    "Statement": [
        {
            "Sid": "AllowCloudFrontServicePrincipal",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::{YOUR_BUCKET_NAME}/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "{CLOUDFRONT_ARN}"
                }
            }
        },
        // NEWLY ADDED PERMISSION SET FOR IAM ROLE
        **{
            "Effect": "Allow",
            "Principal": {
                "AWS": "{IAM_USER_ARN}"
            },
            "Action": "s3:*",
            "Resource": [
                "arn:aws:s3:::{YOUR_BUCKET_NAME}",
                "arn:aws:s3:::{YOUR_BUCKET_NAME}/*"
            ]
        }**
    ]
}
```

## Summary

Congratulations.

Now, when your application tries to upload or manage assets in this bucket, the IAM role has permission to do so. All while CloudFront and your domain are set to serve these assets as a CDN.

We did it!

Just remember, any time you want to use an asset — you’ll prefix it with your new [`assets.mysite.com`](http://assets.mysite.com) domain instead of the raw S3 path or internal CloudFront domain.

## Bonus: Image Variants

As mentioned before, any stack/SDK can manage to upload images to your bucket.
Multiple free solutions exist to convert larger images into different variations for application use. You could leverage the [Sharp](https://sharp.pixelplumbing.com/) or [ImageMagick](https://www.npmjs.com/package/imagemagick) kits in Node, for example. For Rails, you’ll likely leverage [Active Storage](https://guides.rubyonrails.org/active_storage_overview.html) or [Carrierwave](https://github.com/carrierwaveuploader/carrierwave), leveraging MiniMagick/Imagemagik in a similar way.

The path here is up to you; the result is that you’ll have some async process to manipulate the raw image and leverage the S3 SDK to upload that new version to your source bucket.

Below is a quick Rails / Carrierwave example:
Here, we are leveraging MiniMagick to create a thumbnail and header variants.

With Carrierave, we can also tack on our `asset_host` for a quick lookup later on when accessing this image from the model. We can create a quick util in our Model to nab the cdn_url on the fly.

```ruby
# app/uploaders/image_uploader.rb

class ImageUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  storage :aws

  def store_dir
    # This would store in S3 as post/2/images/{versions}.jpeg
    "post/#{model.post_id}/#{mounted_as.to_s.pluralize}"
  end

  # Create different versions of your uploaded files:
  version :thumb do
    process resize_to_fit: [50, 50]
  end

  version :small_og do
    process resize_to_fill: [300, 157.5]
  end

  version :og do
    process resize_to_fill: [1200, 630]
  end

  def asset_host
    'https://assets.mysite.com'
  end

  # Add an allowlist of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_allowlist
    %w[jpg jpeg gif png]
  end
end

```

```ruby
*# A join table of Posts and Images*
class PostImage < ApplicationRecord
  ...
  mount_uploader :image, ImageUploader

  *# psuedo code helper to get the cdn_url for thumb, og, or the raw image.
  # https://assets.mysite.com/post/3/thumb_puppy.jpeg*
  def cdn_url(type = :raw_image)
    *#[:thumb, :og, :small_og]*
    version_keys = image.versions.keys

    uploaded_image = if version_keys.include?(type.to_sym)
                       image.send(type)
                     else
                       image
                     end

    "#{uploaded_image.asset_host}/#{uploaded_image.path}"
  end
end
```
