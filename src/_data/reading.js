const Client = require("@notionhq/client")
require('dotenv').config()

const notion = new Client.Client({ auth: process.env.NOTION_KEY })
const BookshelfId = {
    "2021": process.env.BOOKSHELF_2021,
    "2022": process.env.BOOKSHELF_2022
  }

const bookInfoFromNotion = (input) => ({
    title: input.properties.Name.title[0]['plain_text'],
    link: input.properties.link.url,
    author:input.properties.author.rich_text[0] ? input.properties.author.rich_text[0]['plain_text'] : 'none',
    status: input.properties.status.select.name
})
const reading=[]
module.exports = function () {
    for (shelf of Object.values(BookshelfId)) {
        notion.databases.query({
            database_id: shelf,
        }).then(response => {
            response.results.forEach(result => {
                if (result.properties.status.select.name == "Reading") {
                    let book = bookInfoFromNotion(result)
                    reading.push(book)
                }
            })
        }).catch(function (error) {
            console.error(error)
        })
    }
    return reading
}
