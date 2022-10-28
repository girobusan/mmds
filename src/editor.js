import {h,Component , createRef , render} from "preact";
// import { useRef } from "preact/hooks";
// import {html} from "htm/preact";
import { getContent } from "./mdops";
import { ViewEdit } from "./components/ViewEdit"

console.log("Editor!")

const container = document.getElementById("content");
const editor = h(ViewEdit , {
   base:window.MDS.settings.mdDir ,
   path: window.MDS.current.path || "",
   content: window.MDS.current.content
   })


render(null,container);
render(editor,container);
