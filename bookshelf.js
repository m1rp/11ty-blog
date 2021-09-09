
const Client = require("@notionhq/client")
require('dotenv').config()
const fs = require('fs/promises')

const notion = new Client.Client({ auth: process.env.NOTION_KEY })
const BookshelfId = process.env.BOOKSHELF_ID


async function init() {
  try {
    await notion.databases.query({
        database_id: BookshelfId,
        // filter:{
        //     or:[{
        //         property: 'Name',
        //         text:{
        //             is_not_empty:true
        //         }
        //     },{
        //         property: 'author',
        //         text:{
        //             is_not_empty:true
        //         }
        //     },

        // ]
        // }
    }).then(response =>{
        const titles=[]
        console.log(response)
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
