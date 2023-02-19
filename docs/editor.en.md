Embedded markdown editor
=========================

To open document in editor click the `edit` button at the bottom of the page (depends on theme). This is minimalistic editor with syntax highlighting and preview panel (preview panel may not be opened by default).

![screenshot of the editor](pix/editor_screenshot.png)

Toolbar
-------

![toolbar](pix/toolbar3.png)  

Toolbar buttons, listed left to right:

1. Toggle preview panel
2. Toggle fullscreen
3. Enable spellcheck (it uses browser spellchecker engine)
3. Toggle preview scroll synchronization.
4. Exit edit mode
5. Save file (when there are unsaved changes, this button is highlighted) 

New file creation
----------------- 
In order to create new file inside MMDS, you have to create a link to non-existent file in some other file, like this:

```
[See more](see_more.md)
``` 
Than you can either:
1. Enable preview, click the link in the preview panel and you'll be presented with newly created file.
2. Exit editor, click the link in the view mode. You'll see the message "...press edit button to create...". Press the `edit` button, and you'll get your file. 