
function getLikes(webmentions, url) {
        let absoluteURL = `https://smcllw.me${url}`
   return webmentions
        .filter(entry => entry.link === absoluteURL)        
}
// module.exports = {getLikes}