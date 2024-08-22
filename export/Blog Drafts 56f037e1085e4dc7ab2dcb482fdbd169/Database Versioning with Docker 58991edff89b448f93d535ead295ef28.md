# Database Versioning with Docker

## The Why

- Versioning databases sucks.
- Having to remember those brew commands when setting up a new client is a pain.
- Having to switch between all those clients multiple times throughout the week. HECKS NO.
- Version managers don't really help here.

## The solution

This in my opinion is a perfect fit for why docker exists. CI/CD already leans on Docker images for database setups. No reason we can't utilize that locally. 

- The versions are already compiled on Docker Hub with their own dependencies
- They are community driven
- They can be mounted and persisted for local development
- I don't have to think about setup or brew when context switching

**Note:** 
Ideally, it'd be nice to have a nice docker-compose workflow with ALL our apps and clients... but that's not always doable in Agency life. 

## But ... but...

I know, some of you like pain, and DevOps scares you. Don't worry, you can still the same way you always have. This is another option in case you ever need it, or finally, realize DevOps exists for a reason. 

Think of this as [Postgres.app](http://postgres.app) but for all the DB's.

For me, having a quick maintainable way of standing up DB's for legacy apps is worth the hassle. This week alone I needed to brew switch/link between 3 versions of MySQL and two versions of Redis. 

## Quirks with Databases and Mac

### Installing mysql2 gem (Rails)

Having trouble with the mysql2 gem installation on a mac? Try this.

```bash
gem install mysql2 -- --with-ldflags=-L/usr/local/opt/openssl/lib --with-cppflags=-I/usr/local/opt/openssl/include
```

You'll also likely need `imagemagick` in order to create local databases. For mac users:

```bash
brew install imagemagick
```

I've run into this a ton, never fully understanding what was going on. After diving in with others, I understand now that these libs are helping the gem compile down allowing the gem to communicate with MySQL itself. **ImageMagick** is a free open source simple software suite for any kind of image manipulation that is used for creating, editing, converting, displaying image files (i.e. another DB dep).

## Docker UP!

asdf

asdf/github.asdf

> don't just blindly follow a readme, and if a client can't deal with another dotfile in their repo they probably have bigger problems ~cball
> 

  

docker run -p 4545:3306 --name mysql -e MYSQL_ROOT_PASSWORD=test1234 -d mysql:5.7