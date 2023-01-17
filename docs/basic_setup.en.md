# First Site


Here is a list of files in the `dist` directory:
* **index.html** — main file, which will be opened in browser
* **mdsite.js** — main script
* **view.css** — default page style
* **scripts/currentpage.js** — user script, which highlights link to current document in menu
* **scripts/bilingual.js** — user script for creating multilanguage site
* **md** — *directory*  with markdown files


## Creating settings file
let's start with creating settings file — `settings.json`. Let's add the site title:

```
 {
    "title" : "My awesome site"
 }
```
You can change the directory for marjkdown files, if you do not like the default  `md` directory.

```
 {
  "title" : "My awesome site",
  "mdDir" : "docs/"
 }
```
Please, note: the directory name must end with slash (`/`).


## Menu and start page

The two special files must reside in source files directory: the index file, which will be opened by default, and menu file (this one is optional), which will be displayed on every page. Usually it contains the list of links to other files.

By default MMDS will look for `index.md` as index file, and `menu.md` as menu. You may create and name your index and menu files accordingly, or choose other names if you wish in the `settings.json`:

```
 {
   "title" : "My awesome site",
   "mdDir" : "docs/",
   "indexFile": "main.md",
   "menuFile": "sidebar.md"
 }
```

Please, ensure that those files are present in source files directory. You may pre-fill menu file with list of links to planned documents, and than run MMDS and create and fill those files in the wiki fashion, by clicking orn the link and than using `edit` button. MMDS will allow you to create linked file in place.

Now you may run local server (see. [ previous ](getting_started.en.md)), and see the results.
 