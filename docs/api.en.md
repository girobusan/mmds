# Java Script API

All the functions, available to user scripts, are inside the `window.MMDS` object.

```
console.log("MMDS version: " + window.MMDS.version")
```

## See also
* [Content object](api_content.en.md)

## Fields and descriptions

| field | type |  description |
|---|---|---|
| `version` |  string | The version of the main script |
| `editMode`  | boolean  | Is MMDS in edit mode? |
| `current` | Object [content](api_content.en.md) | Content of the current document |
| `settings` | Object | Current settings |
| `page404` | Function | Function, which receives path to doc, and returns [content](api_content.en.md) of error page  |
| `makePath` | Function | Function, which converts path relative to source files directory to path, relative to main html file |
| `addUpdater` | Function | Function, which gets other function as an argument and adds it to the pool of updaters, returns updater id |
| `removeUpdater` | Function | Removes updater function by id | 
| `once` | Function | Gets other function as an argument and runs it once, with `window.MMDS` as an argument |
| `whenActive` | Function | Gets other function as argument, and runs it once, _when main window receives focus_ with `window.MMDS` as an argument|
| `updateViews` | Function | Updates all views, calls all updaters |
| `refresh` | Function | Refreshes _view_ of the document | 
| `reload` | Function | Reloads current document from disk |