const API_ORIGIN = 'https://webmention.io/api/mentions.jf2'
const fetch = require('node-fetch')
module.exports = async function() {
    const domain = 'smcllw.me'
    const token = process.env.WEBMENTION_IO_TOKEN
    const url = `${API_ORIGIN}?domain=${domain}&token=${token}`
    console.log(url)
    try {
        const response = await fetch(url)
        if (response.ok) {
            const feed = await response.json()
            console.log(feed)
            return feed.length > 1 ? feed : ["NOOOOOO"];
        }
    } catch (err) {
        console.error(err)
        return null
    }
}