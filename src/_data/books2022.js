const books = require("./books")
require('dotenv').config()
const books2022 = books.getBooks(process.env.BOOKSHELF_2022)
module.exports = books2022