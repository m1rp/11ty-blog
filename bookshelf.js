const Client = require("@notionhq/client")
require('dotenv').config()
const fs = require('fs/promises')

const notion = new Client.Client({ auth: process.env.NOTION_KEY })
const BookshelfId = process.env.BOOKSHELF_ID

const bookInfoFromNotion = (input) =>({
    title: input.properties.Name.title[0]['plain_text'],
    link:input.properties.link.url,
    author:input.properties.author.rich_text[0]['plain_text'],
    reading: input.properties.reading.checkbox ? true : false,
    finished: input.properties.finished.checkbox ? true : false
})

async function init() {
  try {
    await notion.databases.query({
        database_id: BookshelfId,
    }).then(response =>{
        const titles=[]
        const curentlyReading= []
        response.results.forEach(result =>{            
          const book = bookInfoFromNotion(result)
          if(book.reading === true){
            curentlyReading.push(book)
          };
          titles.push(book)
        })
        fs.writeFile("src/_data/bookshelf.json",JSON.stringify(titles,null, 2));
        fs.writeFile("src/_data/reading.json",JSON.stringify(curentlyReading,null, 2));


    })
  } catch (error) {
    console.error(error.body)
  }
}
module.exports = init
