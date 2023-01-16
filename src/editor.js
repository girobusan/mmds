import {h, render} from "preact";
import { ViewEdit } from "./components/ViewEdit"

export function goEditMode(){
  console.log("MMMDS editor, version" , VERSION);

  const container = document.getElementById("content");
  const editor = h(ViewEdit , {
    base:window.MMDS.settings.mdDir ,
    path: window.MMDS.current.path || "",
    content: window.MMDS.current.content
  })


  render(null,container);
  render(editor,container);
}
