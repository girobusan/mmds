import {h,Component , createRef , render} from "preact";
// import { useRef } from "preact/hooks";
// import {html} from "htm/preact";
import { getContent } from "./mdops";
import { ViewEdit } from "./components/ViewEdit"

console.log("MMMDS editor, version" , VERSION);

const container = document.getElementById("content");
const editor = h(ViewEdit , {
   base:window.MMDS.settings.mdDir ,
   path: window.MMDS.current.path || "",
   content: window.MMDS.current.content
   })


render(null,container);
render(editor,container);
