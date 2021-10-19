const Client = require("@notionhq/client")
require('dotenv').config()

const notion = new Client.Client({ auth: process.env.NOTION_KEY })
const BookshelfId = process.env.BOOKSHELF_ID

const bookInfoFromNotion = (input) => ({
    title: input.properties.Name.title[0]['plain_text'],
    link: input.properties.link.url,
    author:input.properties.author.rich_text[0]['plain_text'],
    reading: input.properties.reading.checkbox ? true : false,
    finished: input.properties.finished.checkbox ? true : false
})

module.exports = async () => await 
    notion.databases.query({
        database_id: BookshelfId,
    }).then(response => {
        const reading=[]
        response.results.forEach(result =>{
            if(result.properties.reading.checkbox === true){
                let book= bookInfoFromNotion(result)
                reading.push(book)
            }
        })
        return reading
    }).catch(function(error){
    console.error(error)
})
