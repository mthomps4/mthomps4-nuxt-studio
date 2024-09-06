---
title: Restore tmux sessions with tmux-continuum
description: Learn how to save your tmux sessions with tmux-continuum.
og:
  title: Restore tmux sessions with tmux-continuum
  description: Learn how to save your tmux sessions with tmux-continuum.
path: /blog/2024/tmux-continuum
image:
  src: https://ik.imagekit.io/mthomps4/site/posts/tmux-continiuum/featured.jpeg
  alt: og-image
publishedOn: '2024-06-12'
tags:
  - tmux
organization:
  name: learn.typecraft.com
  site: https://learn.typecraft.com
---

![featured.png](https://ik.imagekit.io/mthomps4/site/posts/tmux-continiuum/featured.jpeg){.featured-image}

## Overview

Personally I use tmux to organize projects and terminal splits.
I have a few projects that I work on and I like to have a tmux session for each project.
However, setting up a new machine I was reminded that tmux doesn't save your sessions once you close the terminal or restart the machine, at least by default.
Insert [tmux-contiuum](https://github.com/tmux-plugins/tmux-continuum) and [tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect).
With a few lines in your `.tmux.conf` you can have tmux save your sessions and windows saving you time and frustration.

Let's dive in!

## Installation

I'm going to assume you are already using tmux and leverage tpm. If not, you can find the installation instructions [here](https://github.com/tmux-plugins/tpm).
If you follow the readme on the tmux-continuum github page you can add the following to your `.tmux.conf`:

```bash
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'
set -g @continuum-boot 'on'
set -g @continuum-boot-options 'iterm,fullscreen'
```

On this machine I'm using `iterm` but feel free to peek the docs for other options.

Next you can install the plugins by running `prefix + I` in your tmux session.
You'll see something similar to below.

![tmux-install](https://ik.imagekit.io/mthomps4/site/posts/tmux-continiuum/tmux-plug-installs.png)

## Congrats

Congrats, that's it! You now have a tmux session that will save your windows and panes.
You can close your terminal and restart your machine and your tmux session will be restored.
You can also manually save your session by running `prefix + Ctrl-s` and restore it by running `prefix + Ctrl-r`.
By default continuum will save your session every 15 minutes.

Now when you reboot your machine, you can see your previous sessions with `tmux ls`.
Pro Tip: Rename your saved sessions for easier identification. I tend to use `<leader>:rename-session {name}` within the session itself once defined.
