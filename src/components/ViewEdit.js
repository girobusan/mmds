import {Component , createRef } from "preact";
// import { useRef } from "preact/hooks";
import {html} from "htm/preact";
import {ActionRow} from "./ActionRow";
import {If} from "./If";
import {renderMd} from "../mdops";
import { saveToDisk } from "../fileops";
require("./viewedit.scss");
//bare MDE
import { BareMDE } from "./editor/BareMDE";

export class ViewEdit extends Component{
  constructor(props){
    super(props);
    this.MMDS = window.MMDS;
    this.notSaved={};
    this.updater = this.updater.bind(this);
    this.text = createRef();
    this.mdEditorNode = createRef();
    this.componentContainer = createRef();
    this.state = {
      content: this.props.content,
      path: this.props.path,
    }
    this.updater= this.updater.bind(this);
  };
  componentWillMount(){
    const my = this;
    // const MMDS = window.MMDS;
    this.MMDS.action.edit = ()=>{ 
      // console.log("new and improved function")
      this.MMDS.editMode = !this.MMDS.editMode 
      this.setState({editMode: this.MMDS.editMode})
    };
    this.MMDS.action.save = ()=>{
      console.info("Saving from editor");
      saveToDisk( this.state.path, this.checkContent(this.state.path, this.state.content).markdown);
      this.saved(this.state.path);
      this.MMDS.whenActive( this.MMDS.reload );

    }

    this.MMDS.listUnsaved = ()=>{
      return Object.keys(this.notSaved);
    }

    this.MMDS.addUpdater(this.updater);
    window.onbeforeunload =  
    ()=>{  console.log(my.notSaved) ; return Object.keys(my.notSaved).length==0 ? undefined : "Some files are not saved" }
    ;
  }
  fixImages(){

  }
  componentDidUpdate(){
    // console.log("ViewEdit updated");
    if(this.text.current)
    {
      const imgs = this.text.current.querySelectorAll("*[src]");
      // console.log("found" ,imgs )
      imgs.forEach(i=>{
        if(i.getAttribute("src").match(/^http(s)?:/)){
          return;
        }
        if(i.getAttribute("src").startsWith(this.props.base)){
          return;}
          i.src = this.props.base + i.getAttribute("src")
      })
    }
    this.MMDS.fire("editor_redraw");
  }
  componentDidMount(){

    // this.updateMdEditor();
  }

  updater(p,c){
    // console.log("UPDATER!" );
    this.setState({content: c , path: p}) 
  }
  checkContent(path,content){
    // console.log("Checking content at" , path);
    if(!path){ 
      console.log("empty path")
      return content || {markdown: "" , html: "One moment, please..."} }
      if(this.notSaved[path]){ 
        // console.log("This one has not saved changes" , this.notSaved)
        return this.notSaved[path] 
      }
      // console.log("This file was not changed")
      return content;
  }

  render(){
    // console.log("RENDER VIEWEDIT: \n", this.checkContent(this.state.path, this.state.content).markdown.substring(0,150))
    // const theMD = this.checkContent(this.state.path, this.state.content).markdown;
    return html`<div class="ViewEdit ${this.isEdited(this.state.path) ? "edited" : "notEdited"}"
    ref=${this.componentContainer}
    >
    <${ If } condition=${this.isEdited(this.state.path)&&( !this.MMDS.editMode )}> 
    <small class="notSavedWarning">${this.state.path} has unsaved changes <input type="button" value="save" onclick=${window.MMDS.action.save}>
    </input></small>
    </${ If }>
    <${ If } condition=${this.MMDS.editMode}>
    <div class=${"editorContainer " }>
    <${BareMDE} 
    content=${this.checkContent(this.state.path, this.state.content).markdown } 
    render=${renderMd}
    save=${window.MMDS.action.save}
    externalPreview=${window.MMDS.action.edit}
    showPreview=${false}
    externalPreviewTitle="Hide Editor"
    onUpdate=${(c)=>this.edited(this.state.path , {markdown: c , html: renderMd(c)})}
    modified=${this.isEdited(this.state.path)}
    documentPath=${this.state.path}
    imageRewriter=${ (p)=>p.startsWith(this.props.base) ? p : this.props.base + p }
    />
    </div>
    </${ If }>
    <${If} condition=${!this.MMDS.editMode}>
    <div class="text" 
    ref=${this.text}
    dangerouslySetInnerHTML=${{ __html:this.checkContent(this.state.path, this.state.content).html }} >
    </div>
    </${ If }>
    <${ActionRow} />
    </div>`
    }
    edited(path,content){
      // console.info("we touched" , path);
      this.notSaved[path] = content;
      this.componentContainer.current.classList.add("edited"); // :FIXME
    }
    saved(path){
      delete(this.notSaved[path])
    }

    isEdited(path){
      // console.log("Is it edited?" , path)
      if(this.notSaved[path]){return true}
      return false;
    }
    }
