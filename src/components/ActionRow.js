// import {h,Component , createRef} from "preact";
// import { useRef } from "preact/hooks";
import {html} from "htm/preact";
require("./actionrow.scss");
const MDS = window.MDS;

export function ActionRow(props){
   const qstr = window.location.search.match(/edit=true/);
   const show = !window.MDS.settings.hideEditor;
   if(show || qstr){
   return html`<div class="ActionRow">
   <input type="button" class="actions" 
   value=${window.MDS.editMode ? "view" : "edit"}
   onclick=${window.MDS.action.edit}
   >
   </input>
   <input type="button" class="actions" 
   value=${"save"}
   onclick=${window.MDS.action.save}
   >
   </input>
   </div>`
   }else{
   return "";

   }}

