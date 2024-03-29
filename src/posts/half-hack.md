---
title           : A Few Hours Of Python
slug            : half-hack
author          : Sam
tags            : [Python, dev] 
categories      : [Tech]
introduction    : Taking Some Time to Rediscover the Joys of Python
date            : "2021-09-03"
---

## Today I really wanted to write some Python. 

I can't explain why but coding in Python always brings me a bit of joy.

I was talking with a colleague and the topic of RSS feeds came up. I'd thought about coding a very basic RSS reader for a bit, but today I finally managed to get started.

For now, the [repo is public](https://github.com/m1rp/feed-me-py) , and I hope I'll be able to find both time and motivation to dig into it a bit more. I'm not entirely sure what I want to do with this.

it's basic at the moment but what the script does is:
- read some urls from a JSON file,
- fetch the RSS/Atom feed for each url
- for each feed only keep `title, content, url, updated date`,
- sort each feed by date
- create a list of these feeds
- save everything to a JSON file

Essentially I'm mapping a list of lists to a list of simpler lists. 'simple'.

I like that I could get something bare bones up and running swiftly without much python knowledge at all. There was one tricky bit that I ~~stole~~ took inspiration from [this blog post](https://waylonwalker.com/parsing-rss-python/#combining-feeds) :

```javascript
simplified_feeds[index].sort(key=lambda x: parse(x['updated']), reverse = True)
```

I can understand what's happening but I wouldn't have found this out without a ton of googling. What I'm doing here is sorting a feeds entries in chronological order. I'm not 100% sure about the key=lambda stuff.

What I found slightly unpleasant is that not all RSS  feeds us the same data model. that's why I added a conditional statement  to get the content, they aren't all called the same thing.

Anyway, I wanted to write some Python. I did. It was cool. I highly recommend it!