const Client = require("@notionhq/client")
require('dotenv').config()

const notion = new Client.Client({ auth: process.env.NOTION_KEY })

const bookInfoFromNotion = (input) => ({
    title: input.properties.Name.title[0]['plain_text']|| 'none',
    link: input.properties.link.url,
    author:input.properties.author.rich_text[0] ? input.properties.author.rich_text[0]['plain_text'] : 'none',
    status: input.properties.status.select.name
})
const isFinishedOrReading = (input) => {
  if(input.name == "Reading"){
    return input
  }else if(input.name == "Finished"){
    return input
  }
}

 const getBooks = async (bookshelfId) => await 
  notion.databases.query({
    database_id: bookshelfId,
  }).then(response => {
      const titles=[]
      response.results.forEach(result =>{
        if(isFinishedOrReading(result.properties.status.select)){
          const book = bookInfoFromNotion(result)
          titles.push(book)
        }
      })
      return titles
    }).catch(function(error){
      console.error(error)
    })
    
exports.getBooks = getBooks