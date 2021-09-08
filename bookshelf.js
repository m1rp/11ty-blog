const Client = require("@notionhq/client")
require('dotenv').config()

const notion = new Client.Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID
const BookshelfId = process.env.BOOKSHELF_ID

async function getItems() {
  try {
    await notion.databases.query({
        database_id: BookshelfId,
        filter:{
            or:[{
                property: 'Name',
                text:{
                    is_not_empty:true
                }
            },{
                property: 'author',
                text:{
                    is_not_empty:true
                }
            },

        ]
        }
    }).then(response =>{
        const titles=[]
        response.results.forEach(
            result =>{            
                const finished = result.properties.finished.checkbox ? "finished" : "started"
                titles.push([result.properties.Name.title[0]['plain_text'],result.properties.author.rich_text[0]['plain_text'],finished ])
            }
        )
        console.log(titles)
    })
    console.log("Success!")
  } catch (error) {
    console.error(error.body)
  }
}
getItems()
