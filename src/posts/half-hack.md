---
title           : A Few Hours Of Python
draft : true
slug            : half-hack
author          : Sam
tags          : 
    - Python
    - dev
categories    : [Tech]
introduction    : Taking Some Time to Rediscover the Joys of Python
date            : "2021-09-03"
---

## Today I really wanted to write some Python. 

I can't really explain why but coding in Python always brings me a bit of joy.

I was talking with a coleague and the topic of RSS feeds came up. I'd thought about coding a very basic RSS reader for a bit, but today I finally managed to get started.

For now, the [repo is public](https://github.com/m1rp/feed-me-py) , and I hope I'll be able to findboth time and motivation to dig into it a bit more. I'm not entirely sure what I want to do with this.

it's extremely basic at the moment but what the script does is:
- read some urls from a JSON file,
- fetch the RSS/Atom feed for each url
- for each feed only keep `title, content, url, updated date`,
- sort each feed by date
- create a list of these feeds
- save everything to a JSON file