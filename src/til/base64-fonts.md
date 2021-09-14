---
title        : "Base 64 encoded fonts"
slug         : "base64-fonts"
tags         : ["CSS", "Fonts"]
categories   : ["til"]
author       : "Sam"
date         : "2021-09-14"
---

## The Problem

I struggle referencing fonts in a CSS file. I struggle with getting fonts setup in general.

Sometimes your referencing the path to where your font is locally, but that doesn't quite match where it would be on your server (for example if your CSS file is being used on multiple projects hosted in different places, or just on different domains).

I'm generally quite lazy about this stuff and just reach for google fonts and do what they tell me to do. This isn't always an option, you'll also dependent on a external ressource that might not be available somewhere (google stuff isnt easily available in China for example).

This is the problem I faced at work. Multiple projects referencing the same CSS files and the fonts got lost somewhere for 2 out of 3 projects.

## The Solution

It turns out you can change your font file into a Data URLs by base 64 encoding it.

That's a lot of words. Let's try to break it down a bit.

Here's what [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs?ref=morsewall.com) has to say:

>Data URLs, URLs prefixed with the data: scheme, allow content creators to embed small files inline in documents.

So that means we're actually embedding the font in the CSS file. We can do that by encoding the file. we can do this by using the `base64` command line tool (on unix systems). Browsers can encode and decode base 64, that's why we're using this format.

```bash
base64 -w 0 font.woff2 > font.base64    
```
The `-w 0` argument is to remove whitespace and linebreaks.

In the `font.base64` file there'll be a massive string of gibberish. We can copy/paste that gibberish into our css file where we define our font:

```css
@font-face {
    font-family: 'My Cool Font';
    src: url(data:application/font-woff2;base64,<this is where the gibberish lives>) format('woff2');
    font-weight: 300;
    font-display: swap;
}
```

And that's it!

## Further Reading

[Zach's deep dive and demos](https://www.zachleat.com/web/comprehensive-webfonts/#critical-foft-with-data-uri)

[CSS tricks article](https://css-tricks.com/data-uris/)

[Zell Liew and his thoughts](https://css-tricks.com/the-best-font-loading-strategies-and-how-to-execute-them/)
