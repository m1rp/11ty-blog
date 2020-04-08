
module.exports = function(eleventyConfig) {
    // Filter source file names using a glob
    eleventyConfig.addCollection("posts", function(collection) {
        let posts = collection.getFilteredByGlob("src/posts/*.md").filter(each => each.exclude===false)
        posts.forEach(post => post.data.layout="layouts/post.njk")
        return posts
    });
   return {
       dir: {
            input: "src",
            output: "dist"
    }
}
};
