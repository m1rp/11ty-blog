---
title: making a URL shortener
author: Sam
tags          : [writing, blog, dev]
categories    : [Tech]
introduction  : How to make a URL shortener with Express and TypeScript
date: "2020-05-25"
draft: false
---

## I've always struggled with side projects.

I find it really complicated to commit to an idea or a project until completion. They're either too small and not engaging (todo lists come to mind), or too intimidating (trying to contributing to open source projects fills me with self-doubt and imposter syndrome). Finding something that's just right is a real challenge.

What I've found works for me is making small tool that I need or want, scratching my own itch so to speak, with the intention of actually using it. That second part is quite important to me, I can't stay motivated if I'm making something for no real reason. For me, actually making small things and launching them is the best way to learn something. 

So I decided to make a URL shortener! It ticks all the boxes: it can be as simple or as over-engineered as I want, I get the opportunity to get familliar with a stack I don't use that often, and I can actually use it!

There are 2 parts to this project:
  - the [code](#code)
  - the [deployment](#ops)

I'm going to walk through what I've done with code examples and how I deployed everything. It's worth mentionning that all the services I have used are free, with the exeption of of my domain name.

This API is made with [Express](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/) and [MongoDB](https://www.mongodb.com/), the API is hosted on [heroku](https://www.heroku.com), the database is hosted on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), I got a domain name on [namecheap](https://www.namecheap.com/) and [Netlify](https://netlify.com) provides some DNS magic. 

Anyway, let's get started!

## Quick Technical Introduction

What I decided to start off with was a minimal, feature free URL shortener. One way to acheive this is assign a unique ID to a submited URL and store that information somewhere. Then when someone requests that unique ID, redirect them to the original URL. 

We'll store the URLs in a MongoDB instance, but this could also be achieved with different types of database, this could even be achieved using a service like [google sheets](https://docs.google.com/spreadsheets) or [airtable](https://airtable.com/)! 

For creating a Unique ID, we can a node package called `shortid` as we don't need anything fancy.

This API is an express app running on a heroku machine, but it could also be adapted to run as a cloud function (or lambda function) or using a different framework. 

<h2 id="code">The Code </h2>

*_you can find all the code to follow along [here](https://github.com/m1rp/url-shortener-example/tree/master)_*

The Code is approximately structured as follows:

```json
|
|---- controllers
|      |--- linksController.ts /* all functions related to links */
|      \--- checker.ts         /* check that request authorised */
|
|---- models
|      \--- link.ts            /* data model of link objects */
|
|---- routes
|      \--- index.ts           /* routes and associated controllers */
|
|---- index.ts                 /* server and db init*/
```

We won't be using views as we're only going to be interacting with the Backend. Adding a Frontend would require adding some form of authentication (to limit who can add and remove links) and that's out of scope.

In the index file, we connect to our Mongodb instance, initialise our app and routes.

For sensitive data, you can create a `.env` file in the root of your project and use the `dotenv` module to access those variables globally.

Here we're using a remote instance of MongoDB that I'll explain how to setup later.

```ts
// index.ts
require( './model/link' );
import express from "express";
import mongoose from "mongoose"
import * as bodyParser from "body-parser"
import * as routes from './routes/index'
import * as dotenv from 'dotenv'
import morgan from "morgan"
import helmet from "helmet"

// env variables
dotenv.config()
const user = process.env.USER
const pass = process.env.PASSWORD
const mongodbURL = process.env.DB_URL

//initialise connection to DB
const uri = `mongodb+srv://${user}:${pass}@${mongodbURL}`;

// avoid deprecation warnings
// https://mongoosejs.com/docs/deprecations.html
mongoose.set( 'useFindAndModify', false );
mongoose.set( 'useCreateIndex', true );
mongoose.set( 'useUnifiedTopology', true );
mongoose.set( 'useNewUrlParser', true )
mongoose.connect( uri )
const db = mongoose.connection

db.on( 'error', console.error.bind( console, 'connection error:' ) );
db.once( 'open', _ => console.log( 'Database connected:', uri ) )

// initialise app
const app = express()
app.use( helmet() )
app.use( bodyParser.urlencoded( { extended: true } ) )
app.use( '/api/*', bodyParser.json() )
app.use( morgan( 'combined' ) )
app.set( 'port', process.env.PORT || 3000 )

routes.routes( app )

app.listen( app.get( "port" ), () => {
  console.log( 'App is running at %d', app.get( 'port' ) )
}
)
```

Let's define the data model for our Links! We're also going to create an `Interface` for our links. An `Interface` is a typescript thing, it's an explicit way to define an object's shape. You can read more about that [in the Typescript documentation](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

For describing and using our data, we create a `Schema`. According to the Mongoose website, a `Schema` describes the shape of our `Documents` in a `Collection`. For a more in depth explanation please check out the [mongoose guide](https://mongoosejs.com/docs/guide.html)

It really sounds like we're doing the same thing twice, and we kind of are. The `Interface` is the description of the object used by typescript and it is completly optional. On the other hand, the `Schema` is the description of the object that will be stored in our database and this is not optional.

```ts
// models/links.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ILink {
  originalLink: string,
  generatedLink: string,
  GID: string,
  createdAt?: Date,
  updatedAt?: Date,
  popularity: number
}

export type LinkType = ILink & Document

const linkSchema = new Schema( {
  originalLink: {
    type: String,
    unique: true,
    required: true
  },
  generatedLink: String,
  GID: {
    type: String,
    unique: true,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  popularity: {
    type: Number,
    default: 0
  }
} );

export const Link = mongoose.model<LinkType>( 'Link', linkSchema );
```

Lets look into our controllers. This is where most of the functionality is implemented, where we query our database, parse requests and where we model our response.

We can start by implementing some core functionalities, creating a Link, deleting a link, and finding a link. We'll be making use of the `Interface` and `Type` we defined previously. Here's a quick implementation of these functions:

```ts
import { Request, Response, NextFunction } from "express";
import { Link, ILink, LinkType } from '../model/link'
import * as shortid from 'shortid'
import * as dotenv from 'dotenv'
dotenv.config()

const baseUrl = process.env.BASE_URL

export const createLink = async ( req: Request, res: Response ): Promise<void> => {
  try {
    const gid: string = shortid.generate()
    const originalLink = req.body.originalLink
    const generatedLink: string = baseUrl ? `https://${baseUrl}/${gid}` : `https://${req.headers.host}/${gid}`
    const linkObject: ILink = {
      'originalLink': originalLink,
      'generatedLink': generatedLink,
      'GID': gid,
      'popularity': 0
    }
    const newLink: LinkType = new Link( linkObject )
    await Link.findOneAndUpdate( { originalLink: originalLink }, newLink )
    res.status( 201 ).json( newLink );
  } catch ( error ) {
    res.status( 404 ).json( { error: `${error}` } )
  }
}


export const getLinkById = async ( req: Request, res: Response, next: NextFunction, ): Promise<void> => {
  const gid = req.params.gid
  try {
    // increment popularity of link
    const url = await Link.findOneAndUpdate( { GID: gid }, { $inc: { popularity: 1 } } )
    url == null ? res.status( 301 ).redirect( "/api" ) : res.redirect( 301, `https://${url.originalLink}` )
  } catch ( error ) {
    res.status( 301 ).redirect( "/api" )
  }
  next()
}


export const deleteLink = async ( req: Request, res: Response ): Promise<void> => {
  const gid = req.params.gid
  try{
    await Link.findOneAndDelete( { GID: gid } )
    res.status( 204 )
  }catch(error){
    res.status( 404 ).json( { error: `${error}` } )
  }
}

```

A couple of things worth noting:
  - the error handling is nearly none existent
  - in our `createLink` function, we don't check if the GID already exists.
  - `getLinkById` will redirect us directly to our original link, but will also increment a links popularity. This could be extended to include other data to give you some feedback on how many hits your blog post gets comming from one specific source without needing to implement any user tracking.


Ok we're halfaway there! Let's get our routing sorted:

```ts
import * as linksController from '../controllers/linksController'
import { validator } from '../controllers/validator'
import express, { Application } from "express";

export const routes = ( app: Application ) => {
    app.get( '/api/:gid', linksController.getLinkById )
    app.post( '/api/shorten', validator ).post( '/api/shorten', linksController.createLink )
    app.delete( '/api/delete/:gid', validator ).delete( '/api/delete/:gid', linksController.deleteLink )
};
```

We have our 3 routes using our 3 functions. There are a few ways to test these endpoints, we could use a tool like [postman](https://www.postman.com/) or [insomnia](https://insomnia.rest/) to query our API and save those queries, or we can use the `curl` tool in our terminal. Lets ignore (or remove) the `validator` function for the moment and try to create a link with the followng `curl` command:

```bash
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"originalLink":"my-cool-site.com"}' \
  localhost:3000/api/shorten
```
Now if we check our database, we should see that we have an entry. I would advise using a tool like Insomnia as it allows you to save your queries as you might need to do some testing and debugging.

I added a `validator` function to my post and delete routes as I don't want anyone to be able to do whatever they want. Here you could use an authentication library or check for a token, or leave it as is if you're testing.

That's pretty much it for the code. 

You can try it out for yourself by [cloning the git repo](https://github.com/m1rp/url-shortener-example/tree/master) 
 

<h2 id="ops">The deployment </h2>

Let's set up or database, to do that we're going to go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and set up a free account. 

Once that is done, we need to create a user to read from and write to our database. We can give a username and password. Then we go back to our cluster dashboard and setup a connection. We'll chose the option to connect our application, this will provide us with a code snippet to add to our application. We've already added the snippet so we need to add our user, password and endpoint to our env variables.

Now to deploy our service to [heroku](https://www.heroku.com).

We can start by creating a free account on their homepage. Once that is done, I'd advise either using [Heroku's CLI](https://devcenter.heroku.com/articles/heroku-cli), or going to the "Deploy" page and selection the deployoment method that allows you to connect to github (this will allow you to automate your deployement process).

Nearly there, not much left to configure! We need to add some Config Vars in the settings page. There are at least 4 that you'll need to provide, we defined them earlier in our app. 3 variables for connecting to the database, and one to specify the base URL of our shortened link

```json
BASE_URL=mysite.com/short-links/
DB_PASS=my-database-password
DB_USER=username
DB_ENDPOINT=mongo.endpoint
```

You might want something catchier, but you'll need to add this URL as a custom domain to you heroku application. you might have already purchased a domain that you can add here. I had to be a bit more "creative", I have a domain already registered to my blog that is hosted with [Netlify](https://www.netlify.com/), I needed to add a new DNS record entry linked to my heroku app and also add that domain in Heroku. I'm not an expert on this stuff, but [Heroku's Documentation](https://devcenter.heroku.com/articles/custom-domains) is pretty solid!

One issue you'll run into is with SSL certificates, I have not yet figured out a free way of getting these generated and applied to heroku.

## Wrapping up

I spent as much time writting this app as I did writting ABOUT it. But I've really enjoyed the whole process. Being able to mess about with something like this has been fun, I've learnt quite a bit, and being able to create and launch a service is really rewarding. The whole process has also prevented some burnout which is the biggest benefit.

If I were doing this again, I'd ditch TypeScript. For such a small app, in my opinion, there's nearly no benefit. I'd have much quicker to get something up and running if I hadn't wasted half a day remembering to install types and figuring out that a response in express has a `express.Application.Response` type. I felt like i was spending a lot of time just fighting the TypeScript compiler when I could have been writting code. 

I also re-discovered that Express is very minimal and un-opinionated, which is fine for my use case, but it does leave me feeling a bit lost when starting something from scratch (like: where do I put my routes? should I have controlers? what's a controller? Do I actually know what I'm doing? help).

Anyway, this post is getting way too long. I hope you've enjoyed reading it and hopefully you learned something too!
