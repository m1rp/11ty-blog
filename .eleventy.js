
module.exports = function (eleventyConfig) {
    eleventyConfig.addCollection("posts", collection =>
        [...collection
            .getFilteredByGlob("src/posts/*.md")
            .filter(e => !e.data.draft || e.data.draft === false)
            .reverse()
        ]
    );

    return {
        dir: {
            input: "src",
            output: "dist"
        },
        templateFormats: ["css", "njk", "md", "txt"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        passthroughFileCopy: true
    }
};
