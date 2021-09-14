
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
        const curentlyReading= []
        response.results.forEach(result =>{            
                const finished = result.properties.finished.checkbox ? "finished" : "started"
                const reading = result.properties.reading.checkbox ? true : false
                if(reading){
                  curentlyReading.push([result.properties.Name.title[0]['plain_text'],result.properties.author.rich_text[0]['plain_text'],finished, reading ])
                };
                titles.push([result.properties.Name.title[0]['plain_text'],result.properties.author.rich_text[0]['plain_text'],finished, reading ])
            }
        )
        fs.writeFile("src/_data/bookshelf.json",JSON.stringify(titles,null, 2));
        fs.writeFile("src/_data/reading.json",JSON.stringify(curentlyReading,null, 2));


    })
  } catch (error) {
    console.error(error.body)
  }
}
module.exports = init
