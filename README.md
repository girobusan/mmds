:ru: [Русский](https://girobusan.github.io/mmds/#!index.ru.md)

My Markdown Site
================

100% client-side markdown CMS/viewer/editor written in Java Script. Current version is still experimental (but mostly works), but we're close to something useful. [See demo site](https://girobusan.github.io/mmds/#!index.en.md).


The purpose of it is to publish any set of markdown documents on any server in no time,
be able to quickly edit them in place, and be able to easily use the same markdown files anywhere else. The main alternatives are either server-side Content Management System (CMS) or Static Site Generator (SSG) like Jekill. Others are online services, like Notion. 

![Screenshot](docs/screen.png)

### Comparison

- *SSG:* resulting site may be static and more accessible (MMDS requires Java Script in browser), but you have to regenerate site after any edits or setup the automated workflow. Usually does not include markdown editor.
- *CMS:* more accessible site, usually includes editor and full-blown backend, but requires server setup and your need to perform additional task to get your text as separate files for use somewhere outside the CMS.
- *Online services:* a lot of useful functions, but your files are kept on they
servers only, when MMDS can work locally on your computer without Internet access. And it is not that easy to ban you from your own computer, you know.

Therefore, if you do not mind dependency on Java Script, MMDS do have some advantages: ability to edit files in place, no special requirements on 
server software or source files and almost no setup. 

### Use cases

* Documentation
* Temporary sites for projects
* Sites for learning courses (when site is started with the course, than filled as the course go, and finally closed, converted to pdf and handed to students)
* [ Neocities ](https://neocities.org/)


## Other projects of the same kind and comparison

* [CMS.js](https://github.com/chrisdiana/cms.js): CMS, which works entirely in browser
* [IMP!](https://github.com/girobusan/imp): my other project, single page CMS
* [MDWiki](https://github.com/Dynalon/mdwiki): client-side wiki-like web app
 
|  :wrench:             | CMS.js             | MDWiki             | MMDS               | IMP!                | 
|-----------------------|--------------------|--------------------|--------------------|---------------------|
| Multi page site       | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  :heavy_minus_sign: |
| Requires JS to view   | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  :heavy_minus_sign: |
| URLs for pages        | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |  inapplicable*      |
| Editor                | :heavy_minus_sign: | :heavy_minus_sign: | :heavy_check_mark: |  :heavy_check_mark: |
| Requires server setup | :heavy_check_mark: | :heavy_minus_sign: | :heavy_minus_sign: |  :heavy_minus_sign: |
| Automatic lists       | :heavy_check_mark: | :heavy_minus_sign: | :heavy_minus_sign: |  inapplicable*      | 
| Custom design         | themes and templates | CSS              | full control       |  full control       |
| Custom functions      | :question:         | Plugins            | User scripts       |  Any scripts        |
| Project status        | mature             |  dead              | just started       |  pretty mature      |

\* IMP! is CMS/Editor/Viewer for single page.

# Features

* Direct links to pages
* No restrictions on markdown content 
* Renders HTML inside markdown
* Totally customizable design (html + css + JS API for custom scripts)
* Embedded markdown editor 
* ...and, of course, you can use ANY markdown editor.
* Any server (no server setup required)


## License

- MIT

## Based on

- CodeJar
- Preact
- Markdown-it
- Prism
- ...

