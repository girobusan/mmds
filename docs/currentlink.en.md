 # Highlight link to current document

This is a nice touch to your website. In order to achieve this, we will use custom script `currentpage.js`. 

For this we'll need to add the `scripts ` parameter to `settings.json` file. This parameter must contain list of the paths to enabled scripts. The script `currentpage.js` must be in the root of your site, or (in latest versions) in the `scripts` subdirectory:

```
 {
   "title" : "My awesome site",
   "mdDir" : "docs/",
   "indexFile": "main.en.md",
   "menuFile": "sidebar.en.md",
   "scripts" : [ "scripts/currentpage.js"]   
 }
 
```

## How does it work

When this script is loaded, links to current page will have class `currentPage`. Just use this class in your styles. 
