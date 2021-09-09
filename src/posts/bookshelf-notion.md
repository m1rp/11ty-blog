---
title           : Getting Data from Notion
slug            : notion-bookshelf
author          : Sam
tags            : [Node, dev, API] 
categories      : [Tech]
introduction    : Mucking About with the Notion API to Make a Bookshelf 
date            : "2021-09-09"
draft           : false
---
## I Really Like Notion
I've been using Notion on a semi regular basis for the past 3 years. I mostly use it to create various lists, plan holidays, and track progress. 

I get the most benefit from progress tracking. I mostly track how many books I have read in order to meet a goal I set. I wrote about this last year.

I've wanted to add this to the blog for a while but have it update automatically.

## Notion made their API public
I can finally share my "bookshelf" without too much copy pasting! hurray!

I went to look at the [notion API docs](https://developers.notion.com/docs/getting-started) and just skimmed the content because there's no way on earth I'm reading all that.

I've noticed that this is something I do all the time. It's a terrible habit, but it's just not how I learn. I cannot sit down and read through some docs, I'll get bored and do something else.

What I normally do is look for code examples, copy paste, and then mess about. I'll tweak things, look up a specific method in the api docs. Rince & Repeat until I have something that "works". 

## The Code

```javascript
const Client = require("@notionhq/client")
require('dotenv').config()
const fs = require('fs/promises')
//have these keys in your .env file
const notion = new Client.Client({ auth: process.env.NOTION_KEY })
const BookshelfId = process.env.BOOKSHELF_ID


async function init() {
  try {
    await notion.databases.query({
        database_id: BookshelfId,
        filter:{
            or:[{
                property: 'Name',
                text:{
                    is_not_empty:true
                }
            }
        ]
        }
    }).then(response =>{
        const titles=[]
        response.results.forEach(result =>{            
                const finished = result.properties.finished.checkbox ? "finished" : "started"
                titles.push([result.properties.Name.title[0]['plain_text'],result.properties.author.rich_text[0]['plain_text'],finished ])
            }
        )
        fs.writeFile("src/_data/bookshelf.json",JSON.stringify(titles,null, 2));

    })
  } catch (error) {
    console.error(error.body)
  }
}
module.exports = init
```

the bookshelf ID is the last part of the URL in the web page of the database you want. It's not very clear how to find this, and there's no way I know in notion's UI to get this ID.

We query notion for a specific database. The Filter here is completly useless. With or without it you'll get all your entries.
But If I wanted all entries that were checked as finished, this wouldn't be too complicated to add.

Once we have our entries, we map over the array and keep just the data points we're interested with (name, author, finished) and we write this to a file.

This file is in a special 11ty folder. Data in `_data` is globally accessible, So it can be used anywhere.


And here's it is being used!

### I'm currently reading :
{% for entry in bookshelf %}
{% if entry[2] === "started" %}
- <i>{{ entry[0] }}</i> , by {{ entry[1] }}
{% endif %}
{% endfor %}

### I'm finished reading : 
{% for entry in bookshelf %}
{% if entry[2] === "finished" %}
- <i>{{ entry[0] }}</i> , by {{ entry[1] }}
{% endif %}
{% endfor %}


