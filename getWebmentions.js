function getLikes(webmentions, url) {    
   return webmentions
        .filter(entry => entry['wm-target'] === url)
        .filter(entry =>entry['wm-property'] === 'like-of')
        
        
}
module.exports = {getLikes}