import {Component , createRef } from "preact";
// import { useRef } from "preact/hooks";
import {html} from "htm/preact";
import {ActionRow} from "./ActionRow";
// import * as MDE from "easymde";
import {If} from "./If";
import {renderMd} from "../mdops";
import { saveToDisk } from "../fileops";
// require("./editor.scss")
// require("easymde/dist/easymde.min.css");
require("./viewedit.scss");
// require("../style/nofont.scss");
//bare MDE
import { BareMDE } from "./mde/BareMDE";


// const MMDS = window.MMDS;

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
      editMode: true,
      content: this.props.content,
      path: this.props.path,
      edited: {}
  }
  this.updater= this.updater.bind(this);
  };
  componentWillMount(){
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

    this.MMDS.addUpdater(this.updater);
  }
  componentDidUpdate(){
     console.log("ViewEdit updated");
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
     
    // this.updateMdEditor();
  }

  updater(p,c){
    console.log("UPDATER!" );
    this.setState({content: c , path: p}) 
    // if(this.easyMDE){
    //    console.log("Update editor content...")
    //    this.easyMDE.value(this.checkContent(p, c).markdown);
    // }
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
  checkContent(path,content){
    console.log("Checking" , path);
    if(this.notSaved[path]){ 
       console.log("this one has not saved changes" , this.notSaved)
       return this.notSaved[path] 
       }
    console.log("This file was not changed")
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
        autoDownloadFontAwesome: false,
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
                  window.MMDS.action.save();
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

          const stateObj = {};
          stateObj[this.state.path] = {markdown: cm , html: renderMd(cm)};

          // this.setState({edited: Object.assign(this.state.edited)  , stateObj});

          me.edited(me.state.path , stateObj[this.state.path]);
          // this.handleInput("text", easyMDE.value()) 
        }
      this.easyMDE.codemirror.on("inputRead" , changeHandler);
      // this.easyMDE.codemirror.on("cursorActivity" , changeHandler);
      this.easyMDE.codemirror.on("keyHandled" , changeHandler);


        // console.log("MDE" , easyMDE);

        }
}
