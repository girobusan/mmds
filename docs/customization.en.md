Design
============

You can change almost anything in main HTML. There are only few required elements:

### 1. Settings block ([optional](settings.en.md))

The first `script` tag in the HEAD element. User settings [may](settings.en.md) be defined here. 

```

  <script>
    window.settings = {
      hideEditor: false,
      menuFile: "sidebar.md"
    }
  </script>

```

### 2. Main script

The last `script` tag in the HEAD, include main MMDS script:

```

  <script defer src="mdsite.js"></script>

```

### 3. Content container

Any block level element with id = "content", document content will be displayed there:

```

  <article id="content"></article>

```
### 4. Menu element (optional)

Element with id="menu", for navigation:

```

<div id="menu"></div>

```

Some user scripts may have they own requirements, see the docs. 


## User scripts

If you want to add your own scripts, the best way to do so is to add them to `scripts` in the settings. That way they'll loaded right in time: _after_ the `DOMContentLoaded` event, but _before_ loading the first page.

```

  <script>
    window.settings = {
      ...
      scripts: ["my_script1.js" , "my_other_script.js"],
      ...
    }
  </script>

```
