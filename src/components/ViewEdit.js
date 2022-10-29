import {Component , createRef } from "preact";
// import { useRef } from "preact/hooks";
import {html} from "htm/preact";
import {ActionRow} from "./ActionRow";
import * as MDE from "easymde";
import {If} from "./If";
import {renderMd} from "../mdops";
// require("./editor.scss")
require("easymde/dist/easymde.min.css");
require("./viewedit.scss");

const MDS = window.MDS;

export class ViewEdit extends Component{
  constructor(props){
    super(props);
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

    MDS.addUpdater(this.updater);
  }
  componentDidUpdate(){
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
    if(this.easyMDE){
       console.log("Update editor content...")
       this.easyMDE.value(c.markdown);
    }
  }

  render(){
     return html`<div class="ViewEdit">
     <div class=${"editorContainer " + (MDS.editMode ? "" : "hidden")}>
     <textarea 
     class="editorArea"
     ref=${this.mdEditorNode}>
     </textarea>
     </div>
     <${If} condition=${!MDS.editMode}>
    <div class="text" 
    ref=${this.text}
    dangerouslySetInnerHTML=${{ __html:this.state.content.html }} >
    </div>
     </${ If }>
     <${ActionRow} />
     </div>`
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
        sideBySideFullscreen: false,
        toolbar: ["bold", "italic", "heading", "|", "quote" ,
          "unordered-list" , "ordered-list" ,  "|" , "link" , "image" , "|",
          "preview" , "side-by-side" , "fullscreen" , "|" , "guide" , "|",
          // {
            //   name: "export",
            //   action: ()=>{ saveToDisk(this.state.filename.replace(/.htm(l)?$/ , ".md"),
              //     this.state.text)
              //   },
              //   className: "fa fa-download",
              //   title: "Export markdown"
              // },
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

      this.easyMDE.value( this.state.content.markdown );
      this.easyMDE.codemirror.on("change" , 
        ()=>{
          console.log(me.easyMDE.value())
          // this.handleInput("text", easyMDE.value()) 
        } )


        // console.log("MDE" , easyMDE);

        }
}
