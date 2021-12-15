const API_ORIGIN = 'https://webmention.io/api/mentions.jf2'
const fetch = require('node-fetch')

const domain = 'smcllw.me'
const token = process.env.WEBMENTION_IO_TOKEN
const url = `${API_ORIGIN}?domain=${domain}&token=${token}`

module.exports = async () => { 
    try{
        const response = await fetch(url)
        const data = await response.json()
        let final = data.children.map(element => {
            if (element['wm-property'] == 'like-of'){
                return {"photo": element.author.photo,"link": element.author.url}
            }else {
                return {}
            }
        });
        console.log(final)
        return final
    }
    catch (err){
        console.error(err)
    } 
}