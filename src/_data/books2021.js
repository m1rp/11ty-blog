const books = require("./books")
require('dotenv').config()
const books2021 = books.getBooks(process.env.BOOKSHELF_2021)
module.exports = books2021