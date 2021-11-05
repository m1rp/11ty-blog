---
title        : "Trigger a Netlify build from an Iphone"
introduction : "you can use the Shortcuts app to ping specific endpoints"
slug         : "netlify-build-shortcut"
tags         : ["netlify"]
categories   : ["til"]
author       : "Sam"
date         : "2021-11-05"
---

## Problem
I set up [Zapier job](https://zapier.com/) to listen for changes on a [Notion](https://www.notion.so) database in order to trigger a rebuild of my blog on [Netlify](https://www.netlify.com/). 

This didn't quite work. Well it worked once, and then kind of stopped. This in without a shadow of a doubt something I misconfigured. I didn't want to spend too much time trying to sort this out.

And then I remembered that ios now comes with a [Shortcuts](https://support.apple.com/guide/shortcuts/welcome/ios) app. This seemed like the perfect oportunity to have a quick play with something new and shiny (to me at least)


## Solution

### Generate an endpoint in Netlify
In the `Build & Deploy` page in Netlify's settings page there's a section of the page for generating `Build hooks`. 

You can create a hook for a specific branch of you site (you could trigger builds exclusively for a development branch for example), and give that hook a name. Once you click on `Save`, you should get a new entry that looks like `https://api.netlify.com/build_hooks/someRandomGibberish` . 

There's a little downwards facing chevron that you can click that will show you an example [cURL](https://curl.se/) request to trigger the build. At this point you can copy the url for the hook that was created.

### Creating a Shortcut
The Shortcut is composed of 2 parts but only does 1 task: send a POST request to the Netlify hook url.

To start, you need to create a new shortcut. You can give it a name, and you can add actions.

The first action you want to add is called `URL`. There's a search bar to find the actions you want. in this action you add the url of the Netlify hook.

The second action to add is called `Get contents of URL`. By default the `GET` method is selected and you can change that to a `POST` method. you you want or need you can also add headers and a body (the body can be used to provide a message to the build I think).


And that's it, you can add this action to your home screen and trigger a build from you phone!


[Netlify hooks doumentation](https://docs.netlify.com/configure-builds/build-hooks/)