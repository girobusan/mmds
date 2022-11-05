import {html} from "htm/preact";
require("./actionrow.scss");

export function ActionRow(props){
  const MMDS = window.MMDS;
  const qstr = window.location.search.match(/edit=true/);
  const show = !MMDS.settings.hideEditor;
  if(show || qstr){
    return html`<div class="ActionRow">
    <input type="button" class="actions" 
    value=${MMDS.editMode ? "view" : "edit"}
    onclick=${MMDS.action.edit}
    >
    </input>
    <input type="button" class="actions" 
    value=${"save"}
    onclick=${()=>{
      MMDS.action.save() ;
    }}
    >
    </input>
    <input type="button" class="actions" 
    value=${"reload"}
    onclick=${MMDS.reload}
    >
    </input>
    </div>`
    }else{
      return "";

    }}

