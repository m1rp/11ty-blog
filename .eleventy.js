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
            .map(post => Object.assign(post, post.data.layout = "layouts/post.njk"))
            // .map(post => ({ ...post, post: { data: { layout: "layouts/post.njk" } } }))
            .reverse()
        ]
    );
  
    eleventyConfig.addCollection("tagList", function(collection)  {
        let tagSet = new Set();
        collection.getAll().forEach(function(item) {
          if( "tags" in item.data ) {
            let tags = item.data.tags;
    
            tags = tags.filter(function(item) {
              switch(item) {
                // this list should match the `filter` list in tags.njk
                case "all":
                case "nav":
                case "post":
                case "posts":
                  return false;
              }
    
              return true;
            });
    
            for (const tag of tags) {
              tagSet.add(tag);
            }
          }
        });
        return [...tagSet]
    })
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
