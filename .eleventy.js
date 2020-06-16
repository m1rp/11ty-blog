const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
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
    eleventyConfig.addCollection("til", collection =>
        [...collection
            .getFilteredByGlob("src/til/*.md")
            .filter(e => !e.data.draft || e.data.draft === false)
            .map(post => Object.assign(post, post.data.layout = "layouts/til.njk"))
            // .map(post => ({ ...post, post: { data: { layout: "layouts/post.njk" } } }))
            .reverse()
        ]
    );
    eleventyConfig.addCollection("tags", collection =>
        [...collection
            .getFilteredByGlob("src/til/*.md")
            .filter(e => !e.data.draft || e.data.draft === false)
            .map(post => (post.data.tags.forEach(elt=> {return elt} )))
        ]
    )
    console.log(eleventyConfig.collection)
    module.exports = function (eleventyConfig) {
        eleventyConfig.setDataDeepMerge(true);
    };
    eleventyConfig.addPlugin(pluginRss)
    eleventyConfig.addPlugin(syntaxHighlight);
    return {
        dir: {
            input: "src",
            output: "dist"
        },
        templateFormats: ["css", "njk", "md", "txt", "ttf", "pdf"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        passthroughFileCopy: true
    }
};
