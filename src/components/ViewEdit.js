import {Component , createRef } from "preact";
// import { useRef } from "preact/hooks";
import {html} from "htm/preact";
import {ActionRow} from "./ActionRow";
import * as MDE from "easymde";
import {If} from "./If";
import {renderMd} from "../mdops";
import { saveToDisk } from "../fileops";
// require("./editor.scss")
require("easymde/dist/easymde.min.css");
require("./viewedit.scss");

const MDS = window.MDS;

export class ViewEdit extends Component{
  constructor(props){
    super(props);
    this.notSaved={};
    this.updater = this.updater.bind(this);
    this.text = createRef();
    this.mdEditorNode = createRef();
    this.state = {
      editMode: true,
      content: this.props.content,
      path: this.props.path
  }};
  componentWillMount(){
    MDS.action.edit = ()=>{ 
    // console.log("new and improved function")
    MDS.editMode = !MDS.editMode 
    this.setState({editMode: MDS.editMode})
    };
    MDS.action.save = ()=>{
       console.info("Saving from editor");
       saveToDisk( this.state.path, this.easyMDE.value());
       this.saved(this.state.path);
       MDS.whenActive( MDS.reload );

    }

    MDS.addUpdater(this.updater);
  }
  componentDidUpdate(){
    if(this.easyMDE){
       console.log("Update editor content...")
       this.easyMDE.value(this.checkContent(this.state.path, this.state.content).markdown);
    }
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
  }
  componentDidMount(){
    this.updateMdEditor();
  }

  updater(p,c){
    console.log("mds editmode" , MDS.editMode);
    this.setState({content: c , path: p}) 
    // if(this.easyMDE){
    //    console.log("Update editor content...")
    //    this.easyMDE.value(this.checkContent(p, c).markdown);
    // }
  }

  render(){
     return html`<div class="ViewEdit">
     <${ If } condition=${this.isEdited(this.state.path)}> 
     <small class="notSavedWarning">${this.state.path} has unsaved changes</small>
     </${ If }>
     <div class=${"editorContainer " + (MDS.editMode ? "" : "hidden")}>
     <textarea 
     class="editorArea"
     ref=${this.mdEditorNode}>
     </textarea>
     </div>
     <${If} condition=${!MDS.editMode}>
    <div class="text" 
    ref=${this.text}
    dangerouslySetInnerHTML=${{ __html:this.checkContent(this.state.path, this.state.content).html }} >
    </div>
     </${ If }>
     <${ActionRow} />
     </div>`
  }
  edited(path,content){
    console.info("we touched" , path);
    this.notSaved[path] = content;
  }
  saved(path){
    delete(this.notSaved[path])
  }
  checkContent(path,content){
    console.log("Checking" , path);
    if(this.notSaved[path]){ 
       console.log("this one has not saved changes" , this.notSaved)
       return this.notSaved[path] 
       }
    console.log("this file was not changed")
    return content;
  }
  isEdited(path){
     console.log("Is it edited?" , path)
     if(this.notSaved[path]){return true}
     return false;
  }
  updateMdEditor(){
    if(!this.mdEditorNode.current){return}
    const me = this;

    this.easyMDE = new MDE(
      {
        element: this.mdEditorNode.current ,
        syncSideBySidePreviewScroll: false,
        previewRender: (m ,p)=>{
          return renderMd(m);
        },
        spellChecker: true,
        sideBySideFullscreen: true,
        toolbar: ["bold", "italic", "strikethrough" ,"heading", "|", "quote" ,
          "unordered-list" , "ordered-list" ,  "|" , "link" , "image" , "|",
          "preview" , "side-by-side" , "fullscreen" , "|" , "guide" , "|",
          {
              name: "export",
              action: ()=>{
                  window.MDS.action.save();
                },
                className: "fa fa-save no-disable",
                title: "Save"
              },
              // {
                //   name: "import",
                //   action: ()=>{
                  //     loadFromDisk((t)=>{ easyMDE.value(t);this.setState({text:t}) })
                  //   },
                  //   className: "fa fa-upload",
                  //   title: "Import markdown"
                  // }

        ]
      });

      this.easyMDE.value( this.checkContent(this.state.path , this.state.content).markdown );
      const changeHandler = ()=>{
          console.log("edited...")
          const cm = me.easyMDE.value();
          me.edited(me.state.path , {markdown: cm , html: renderMd(cm)})
          // this.handleInput("text", easyMDE.value()) 
        }
      this.easyMDE.codemirror.on("inputRead" , changeHandler);
      // this.easyMDE.codemirror.on("cursorActivity" , changeHandler);
      this.easyMDE.codemirror.on("keyHandled" , changeHandler);


        // console.log("MDE" , easyMDE);

        }
}
