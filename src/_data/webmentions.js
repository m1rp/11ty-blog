const API_ORIGIN = 'https://webmention.io/api/mentions.jf2'
const fetch = require('node-fetch')

const domain = 'smcllw.me'
const token = process.env.WEBMENTION_IO_TOKEN
const url = `${API_ORIGIN}?domain=${domain}&token=${token}`

module.exports = async () => { 
    try{
        const response = await fetch(url)
        const data = await response.json()
        let final = data.children.filter(element => element['wm-property'] == 'like-of')
        final = final.map(element =>({"photo": element.author.photo,"link": element["like-of"], "author": element.author.name}))
        return final
    }
    catch (err){
        console.error(err)
    } 
}