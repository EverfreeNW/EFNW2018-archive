# [Everfree Northwest 2018 Website (Archive)](http://2018.everfreenw.com)

This is the open source version of Everfree Northwest 2018's convention website with code by @PixelyUnicorn and art by [@ImDrunkOnTea](https://twitter.com/ImDrunkOnTea). It's built with Jekyll and hosted on GitHub Pages. **This site is archived and no longer actively maintained. Issues or pull requests may not be monitored.**

Code contributors include @JoeyH3 @TaikoDragon @LatentLogic.

## Licensing

Feel free to inspect the code structure, and reuse what is appropriate. But please respect that the files in the following directories are Copyright Pegasi Northwest and the origial creator or artist. You may not reuse anything therein without written permission:

- _data/
- _posts/
- icons/
- images/
- pages/
- events.json

All other directories and files are under the MIT License (where applicable). If you end up building something cool with this code, please let us know!

My Little Pony: Friendship is Magic and related media belong exclusively to Hasbro, Inc. and/or its subsidiaries.

## Development Structure

| Directory |  |
| --- | --- |
| ````_includes/```` | Contents of `<head>`, navigation, and footer. |
| ````_layouts/```` | Page layout templates. |
| ````_sass/```` | Partial stylesheets. Modify _site.scss for site styles. |
| ````icons/```` | Icon font! See icons/demo.html for a full list. |
| ````images/```` | Static assets necessary to display the site. Sorted by folder accordingly. |
| ````styles/```` | Stylesheet compiler, don't touch this file. |
| ````scripts/```` | Javascript (isn't exactly organized, maybe next year). |

| File |  |
| --- | --- |
| ````404.html```` | 404 page. Easter egg, maybe? |
| ````CNAME```` | Sets up a CNAME record for the domain the site is on. |
| ````_config.yml```` | Site settings and commonly used phrases.  |
| ````_prose.yml```` | Configuration for [prose.io](http://prose.io/). |
| ````feed.xml```` | RSS feed for blog posts. |
| ````robots.txt```` | Bot access settings, please change before deploying to production. |

NOTE: The code used to generate the schedule, vendors, and transaction pages are not open source, so HTML outputs are used instead. We hope to change that in a future year.

### Running the site locally

Make sure you have `ruby` and `bundler` installed, then...

````bash
# Install gems (first time only)
bundle install

# run server on localhost:4000. SCSS and page content compiled automatically on save.
bundle exec jekyll serve --port 4000 --watch --incremental
````

## Content Structure

| Directory |  |
| --- | --- |
| ````_data/```` | Data files. |
| ````_posts/```` | Blog post content. |
| ````icons/```` | Images, pdfs, and other misc static content. |
| ````images/```` | Image assets for the website. |
| ````pages/```` | Page content. |

| File |  |
| --- | --- |
| ````events.json```` | Data file for event calendar. |

### Pages

<!-- **Blog posts can be easily edited and managed online via http://prose.io/#user/repo.** -->

Put published posts in ````_posts/```` and unpublished posts in ````_drafts/````.

The first part of the file starts & ends with three dashes. This is your yaml configuration.

Then comes the markdown. Cheatsheet here: https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

````markdown
---
layout: page
title: Ponystock
permalink: /events/ponystock/
redirect_from: /ponystock/

cover: # Cover photo from asset generator
  name: Ponystock # Name of cover photo
  extension: png # File extension
  artist: Talons of Ice and Fire # Full artist name
  offset: 55vw # Height offset (optional)

background: "#210B24" # Page background color, quotation required
reef: false # Show reef at bottom of page

thumb:	/images/news/volunteer.png # (This is not necessary as it is auto-generated from cover) Card image for social media and chat apps
preview: Ponystock is an event worth staying up all night for! Featuring musicians covering all genres of music from acoustic, to rock, to electronic, and more! # Short 140 character or less card description for social media and chat apps
preview-tweet: Ponystock is an event worth staying up all night for! # Shorter 80 character or less card description for Twitter mobile apps

timeline-data: ps-musicians # Use timeline-data, cards-data, artcards-data for displaying content from the linked data file
---

You can start typing content here. <b>HTML is supported</b> and so is **markdown syntax.**
Try to use bold text and refrain from using _italics_ whenever possible.

Below are your headers, use them sparingly.

## Header 2

### Header 3

Images are pretty easy.

![Image description for screen readers go here: Ashleigh Ball!](/media/guests/ab_headshot.jpg)

So are links: [Click here for Google!](http://google.com/)

Here is a button with an action: [Go register today! <icon>&gt;</icon>](https://everfreenw.com/register){:class="button"}

> I am a rock.
> - Maud Pie

You can make tables too, if you're inclined.

| Column Header 1 | Column Header 2 |
| -- | -- |
| Hi! | You get the point |
| Yo! | What's up? |

Lists are easy, just number or bullet them appropriately, like this:

- Item 1
- Item 2

1. Item 1
2. Item 2

You can embed anything by copying and pasting an embed code, or really any arbitary HTML:
<iframe width="560" height="315" src="https://www.youtube.com/embed/rMFWc_FMhqs"
frameborder="0" allowfullscreen></iframe>
````

### Blog Posts

Like pages, but also supports markdown ````.md```` or html ````.html````.

````markdown
---
layout: post
title:	"Staffing Applications Live!"
date:	2017-09-18 00:00:00 # Publish date in UTC

thumb:	/images/news/volunteer.png # Card image for social media and chat apps

preview: "Staffing Everfree Northwest 2018 is coming along nicely, and Department Directors have been chosen! With this we are also excited to announce that our general staff applications are open!" # Short 140 character or less card description that for social media and chat apps
---

Start typing content here!
````

