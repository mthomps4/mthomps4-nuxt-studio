---
title: Docker DB
description: Learn how to set multiple versions of databases easily with Docker.
og:
  title: Docker DB
  description: Learn how to set multiple versions of databases easily with Docker.
path: '/blog/2021/docker-db'
image:
  src: "https://ik.imagekit.io/mthomps4/site/posts/docker-db/PBC_1.png"
  alt: og-image
publishedOn: "2021-04-15"
tags: ["Docker", "Databases"]
organization:
  name: Echobind
  site: "https://echobind.com"
---

<img src="https://ik.imagekit.io/mthomps4/site/posts/docker-db/PBC_1.png" alt="featured.png" class="featured-image">

## The Problem

Developer environments can be a tedious process, even more so at an agency. You spend 2 days getting Client A's secret sauce of a config rolling, only to need Client B's config later in the week. While you are typically at the liberty of their setup, a few things can still be in your control. e.g. Tooling.

Over the past couple of months, I've had clients needing versions of databases across the board. Typically, we don't think of it. Install this version, switch to that, run for a while.... rinse, and repeat. But what happens when you need to adapt quickly? What happens when Mac updates are pushed and brew installs break? ***Big Sur*** anyone? **The issue, as much as we try to stay consistent in our setup, it's almost impossible when we continue to patch and reconfigure. We've come a long way in terms of language versioning, but not much has been said in terms of databases.

It seems like something was made just for this... hmm... what was it.

****a wild dockerfile appears!***

![PBC_1.png](https://ik.imagekit.io/mthomps4/site/posts/docker-db/PBC_1.png)

*Credit: Kim Wikes via [http://www.pokemonbattlecreator.com/](http://www.pokemonbattlecreator.com/)*

Below is an exported README from my current docker setup for database versioning.

Feel free to clone and follow along in exploring this *probably over-engineered* setup.

> *Automation is good! More must be better!*
>

**Source Repo:**

[https://github.com/mthomps4/docker-compose-db](https://github.com/mthomps4/docker-compose-db)

## Why Docker DB

The same reason you use docker for anything, projects differ, and while version managers work well for programming languages, they are nightmarish for databases. Have you ever tried to manage 3 versions of MySQL on a mac? While you can brew link all day… they still share common MySQL setup files and config files via brew… and as you could imagine, MySQL@5.6 and MySQL8 do not play nice together.

**Why can’t we just host these in the cloud somewhere?!** Absolutely, this is not to discourage other alternatives. Slap that MySQL instance up there and drop some ENVs. At some point, however, you’ll want more direct access to logging, and those *free* services and hosts stop being free. And what if you need to modify some `my.cnf` files? While services have options, and there are definitely pro’s and con’s to both, having more direct control over what is going in our dev setup can be ideal when onboarding and debugging various applications.

***insert docker***

## The Goal

The main focus here is to give each DB instance a home, MySQL 5.6 shouldn’t care about MySQL8, etc. Each instance is self contained to it’s container with a persisted volume and config files are set for each as needed. This also lends itself to expansion with other DB tooling, postgres, redis, and memcache for example. If we need to tweak a config, it’s as easy as stopping the running container, editing/creating a file and restarting.

## Setup

Note: If you are familiar with docker and want a single instance of a DB feel free to take a quick peek at the `docker-compose.yml` and copy over what you need. This setup will enable you to set up and run, MySQL 5.6, 5.7, 8, and Postgres either as a suite or as individual services (recommended).

We are leveraging [Docker/MySQL](https://hub.docker.com/_/mysql) and [Docker/Postgres](https://hub.docker.com/_/postgres) docs here.

- Create a `.env` from `.env.example` and set your DB ENVs accordingly.
- run `source .env`
- run `docker-compose config` to ensure your ENVs are pulling through
- You may need to ensure `setup.sh` has executable permissions by running `chmod +x ./setup.sh`
- Run `./setup.sh`

`./setup.sh` gives the folder `./initializers` permissions and runs each DB initializer file respectfully to scaffold out or `db` folder.

**Let’s take a look at what happened:** You should now see a `db` folder. The initializers have created a folder PER DB inside, each with a `data` folder, `init` folder, and for MySQL a `my.conf` file. If you take a peek at the [db/mysql8/init](./db/mysql8/init) you’ll notice the initializer also added a `01.sql` file. This file will then be used by docker in pair with `docker-entrypoint-initdb.d` to run extra commands on setup. In our case, we’ve taken the liberty to use our ENVs to ensure a superuser was created with all permissions and a respected DB. While the ENVs provided to [Docker/MySQL](https://hub.docker.com/_/mysql) already do this, I’ve kept this file as an example for any other seeds and SQL you may need to run.

Note: For MySQL 5.6, I’ve set an example setup of Root with NO password. If you need something different be sure to tweak the initializer, ENVs, and compose, respectfully.

## Ways to run this thing

To pull, build, and link all the things with docker lets run from our project directory.

```bash
docker-compose up --no-start
```

This will pull the DB images from DockerHub, create the default network drivers, and build the containers to run. Now we are ready to run all or some of our services.

```bash
docker-compose start mysql8
```

You should see `Starting mysql8 ... done`.

Let’s see what’s going on with

```bash
docker-compose logs -f
```

You should see something similar to:

```bash
MySQL8      | 2021-01-08T17:37:28.188065Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.22'  socket: '/var/run/mysqld/mysqld.sock'  port: 3308  MySQL Community Server - GPL.MySQL56 exited with code 0postgres exited with code 0MySQL57 exited with code 0
```

You’ll notice here - our other DBs have “exited” with a code of 0 – ie. They were never started. MySQL 8 is *ready for connections* on *port: 3308*

> Side Note: Currently each DB port is hardcoded in the docker-compose file. If another port is needed, swap these out in the command: and ports: section, I’ll look to make a quick follow with ENVs for these as well.
>

## Connecting via DB Viewer

This is no different than running a DB locally. Your config will still look similar to the below image with localhost (or 127.0.0.1), port, username, and password.

Config:

![Docker%20DB%202a9c297434334b3bb42a0fbb83c58c9c/db-viewer-config.png](https://ik.imagekit.io/mthomps4/site/posts/docker-db/db-viewer-config.png)

Connected View:

![Docker%20DB%202a9c297434334b3bb42a0fbb83c58c9c/connected-dbs.png](https://ik.imagekit.io/mthomps4/site/posts/docker-db/connected-dbs.png)

## Next Steps

**Do I really need to `cd` into another project for all of this?!**

Nope!

Thanks to docker we can build some nice alias commands with the `-f` command.

`Base Command:docker-compose -f <path_to_file> <command> <service_name>`

```bash
# .bash_aliases

alias db:mysql8:start='docker-compose -f ~/Databases/docker-compose.yml start mysql8'
alias db:mysql8:stop='docker-compose -f ~/Databases/docker-compose.yml stop mysql8'
```

See `bash_aliases.md` for more fun helpers!
