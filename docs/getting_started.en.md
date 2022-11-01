
Getting started
===========

In order to view and edit markdown via MMDS on your local computer, you have to launch local server from the directory, where main MMDS file (by default — `index.html`) resides. For example, if you have python3 installed:
```
python3 -m http.server
```
Or, if you prefer node.js (first line installs server module, you have to do it once):
```
$ npm install http-server -g 
$ http-server
```

First run
--------------
1. Download latest release
1. Unpack
1. Distribution is in  `dist` folder

Launch local server from `dist` folder, browse to it's address. 
By default, markdown files are in `dist/md` directory, try to put some of your files there and edit `sidebar.md` file.

### Editing files
To start editing, click `edit` button at the bottom of the page. Pages will be loaded in edit mode. The editor has a pretty convenient feature — side by side editing, you will see the source text and it's rendering at the same time.

Then you may press the `view` button to switch back to view mode. If file was edited, but wasn't saved, you'll see a warning. 

Save button is on the tools panel of the editor, it has a floppy disk icon. For now, you may need to reload page after saving.

### Settings
The best way to add user settings is by creating `settings.json` file near the `index.html`. For detailed instructions on settings, go [there](settings.en.md).




