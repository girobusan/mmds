# Settings
User  settings may be placed right inside main html file, or in separate `settings.json` file, alongside the `index.html`.
In main html file settings are placed in first SCRIPT tag in the HEAD section:
```
  <!--top of HEAD section-->
    <script>
    window.settings = {
      "hideEditor": false,
      "menuFile": "sidebar.md"
    }
  </script>
  <!--HEAD continues-->
```

The same settings in the `setings.json` file look like this:


```
  {
    "hideEditor": false,
    "menuFile": "sidebar.md"
  }
```

Please, note: if the `settings.json` present, all settings, defined in `index.html` are ignored.

| key |default value |what is it |
|--|--|--|
| title | "My MD Site" | Default window title |
| mdDir | "md/" |  Prefix (directory) for markdown files |
| indexFile | "index.md" | Index file |
| menuFile | "menu.md" | File to use as navigation |
| scripts | [] | List of user script paths | 
| hideEditor | false | Hide `edit` button and it's panel |\
| | |You'll have to add `?edit=true` to site url to edit |
| usr | {} | User scripts settings dictionary |
| editorFile* | "mdeditor.js" | Path to editor script |
| userScriptsPath* | "" | Path to user scripts |
[Settings explained]

<small>* experimental</small>
