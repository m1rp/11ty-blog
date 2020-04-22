const pluginRss = require("@11ty/eleventy-plugin-rss");
module.exports = function (eleventyConfig) {
    eleventyConfig.addCollection("posts", collection =>
        [...collection
            .getFilteredByGlob("src/posts/*.md")
            .filter(e => !e.data.draft || e.data.draft === false)
            .map(post => Object.assign(post, post.data.layout = "layouts/post.njk"))
            // .map(post => ({ ...post, post: { data: { layout: "layouts/post.njk" } } }))
            .reverse()
        ]
    );
    eleventyConfig.addPlugin(pluginRss)
    return {
        dir: {
            input: "src",
            output: "dist"
        },
        templateFormats: ["css", "njk", "md", "txt", "ttf"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        passthroughFileCopy: true
    }
};
