import { Component, createRef } from "preact";
import {html} from "htm/preact";

import {CodeJar} from "codejar";
require("./prism/prism_fixed.scss");
require("./mded.scss")
const Prism =  require("./prism/prism.js")

// console.log(Prism);


export class BareMDE extends Component{
  constructor(props){
     super(props);
     this.previewThrottle = false;
     this.scrollThrottled = false;
     this.componentContainer = createRef();
     this.codeJarContainer = createRef();
     this.previewContainer = createRef();
     this.modified = props.modified;
     this.state ={ 
       fullscreen: props.fullscreen,
       showPreview: props.showPreview,
       content: props.content,
       // content: props.content || "# type here",
       // modified: props.modified ,
       spellCheck: props.spellCheck,
       syncScroll: true,
       // documentPath: props.documentPath
     }
     this.togglePreview = this.togglePreview.bind(this);
     this.toggleFullscreen = this.toggleFullscreen.bind(this);
     this.toggleSpellcheck = this.toggleSpellcheck.bind(this);
     this.saveFile = this.saveFile.bind(this);
     this.syncPreviewScroll = this.syncPreviewScroll.bind(this);
  }
  shouldComponentUpdate(p , s){
     //if content is reset, we have to reset.
     if(this.props.content!=p.content){
         this.jar.updateCode(p.content);
         this.modified = p.modified;
         this.doPreview();
     }
    if( s.syncScroll && !this.state.syncScroll ){
       this.syncPreviewScroll(true);
    }
     return true;
  }

  compomemtDidUpdate(oldS , oldP){
  console.log("Bare MDE updated" , oldP , this.props)
  //if(oldP.modified!=this.props.modified){
      
  //}
    if(oldP.content!=this.props.content){
      
      this.jar.updateCode(this.props.content); //???
      this.doPreview();
      
    }
    
  }
  componentDidMount(){
    // console.log("BareMDE did mount" , this.props.content)
    this.jar = CodeJar(this.codeJarContainer.current , 
    (e)=>Prism.highlightElement(e,false,null),
    {
      preserveIdent: true,
      spellcheck: this.state.spellCheck
    }

    );
    this.jar.updateCode(this.props.content);
    this.doPreview();
    this.jar.onUpdate( ()=>{

      if(this.props.indicateChanges&&!this.modified){ 
         this.setState({modified: true}) ;
         this.modified=true;
         }
       this.props.onUpdate(this.jar.toString());
       this.doPreview();
    } )
  }

  createToggler(propName){

    let t = function(){
       const v = !this.state[propName];
       const s = {};
       s[propName] = v;
       this.setState(s);
    }

    t = t.bind(this);
    return t;
    
  }
  syncPreviewScroll(force){
    if(!this.state.syncScroll && !force ){ return }
    if(!this.state.showPreview){ return }
    if(this.scrollThrottled){ 
      return }
      this.scrollThrottled = true;
      const doScroll = ()=>{
        //preview
        const previewFullH = this.previewContainer.current.scrollHeight;
        //editor
        const editorFullH = this.codeJarContainer.current.scrollHeight;
        const editorScrolled = this.codeJarContainer.current.scrollTop;

        const elementHeight = this.previewContainer.current.getBoundingClientRect().height;
        //if one of them can not scroll, do nothing
        if(previewFullH<=elementHeight || editorFullH<=elementHeight ){ return }

        const editorRatio = editorScrolled/( editorFullH - elementHeight );


        const scrollPreviewTo =  ( previewFullH-elementHeight ) * editorRatio;
        this.previewContainer.current.scrollTo({top: scrollPreviewTo , left:0 , behavior: "smooth"});
      }
      doScroll()

      window.setTimeout( ()=>{ this.scrollThrottled=false ; doScroll() } , 300 );


  }

  toggleSpellcheck(){

    this.jar.updateOptions({spellcheck: !this.state.spellCheck});
    this.codeJarContainer.current.spellcheck = !this.state.spellCheck;
    this.setState({spellCheck: !this.state.spellCheck})
  }

  toggleFullscreen(){
     // console.log("Toggle fullscreen");
     const v = !this.state.fullscreen;
     if(v){ this.componentContainer.current.style.zIndex = this.props.fullscreenZIndex }
     else{ this.componentContainer.current.style.zIndex = "unset"}
     this.setState({fullscreen: v});
  }
  togglePreview(){
     // console.log("Toggle preview");
     const v = !this.state.showPreview;
     this.setState({showPreview: v});
     this.doPreview(true);
  }
  saveFile(){
    console.info("saving...")
    if(this.props.indicateChanges&&this.state.modified)
    { this.setState({modified:false}) } 
  this.props.save(this.jar.toString());
  }
  doPreview(force){
    const redraw = ()=>{
      this.previewContainer.current.innerHTML = this.props.render(this.jar.toString())
      const imgs = this.previewContainer.current.querySelectorAll("*[src]");
      this.syncPreviewScroll();
      imgs.forEach(i=>{
        if(i.getAttribute("src").match(/^http(s)?:/)){
          return;
        }
        i.src = this.props.imageRewriter(i.getAttribute( "src" ));
      })
    }

    if(!this.state.showPreview&&!force){ return }
    if(!this.previewThrottle){
      // console.log("previewing...");
      redraw();
      this.previewThrottle = true;
      window.setTimeout(()=>{ this.previewThrottle=false; redraw()} , 300);

    }
    // else{
    //   console.log("throttled....")
    // }
    }

  render(){

    // buttons:
    // toggle preview , toggle fullscreen , <preview only?> , save

    return html`<div class="BareMDE BearMDE 
       ${ this.state.fullscreen ? 'fullscreen' : 'windowed' }
       ${ this.state.showPreview ? 'preview' : 'noPreview' }"
       ref=${this.componentContainer}
    >
      <div class="toolbar top 
       ${ this.state.fullscreen ? 'fullscreen' : 'windowed' }
       ${ this.state.showPreview ? 'preview' : 'noPreview' }
       ${ this.modified ? 'modified' : '' }
      ">
         <button class="previewToggle ${this.state.showPreview ? "on" : "off"}" 
         title="Toggle Preview" onclick=${this.togglePreview}> </button>



         <button class="fullscreenToggle ${this.state.fullscreen? "on" : "off"}" 
         title="Toggle Fullscreen" onclick=${this.toggleFullscreen}></button>
         
         <button class="spellcheckToggle ${this.state.spellCheck ? "on" : "off"}" 
         title="Toggle spellcheck" onclick=${this.toggleSpellcheck}></button>

         <button class="syncScrollToggle ${this.state.syncScroll ? "on" : "off"}" 
         title="Sync preview scroll" onclick=${()=>{ this.setState({syncScroll: !this.state.syncScroll}) }}></button>

       ${ this.props.externalPreview ?  html`<button class="externalPreview" 
       title=${this.props.externalPreviewTitle} onclick=${()=>{console.log('EP' , this.props.externalPreview) ;this.props.externalPreview()}}></button>` : ""
           
       }
         <button class="saveButton" title="Save File" onclick=${this.saveFile}></button>
        </div>
      <div class="workArea">
        <div  class="codeJar language-md" ref=${this.codeJarContainer} onscroll=${(e)=>this.syncPreviewScroll()}></div>
        <div class="preview ${this.props.previewClass}" ref=${this.previewContainer}></div>
      </div>
    </div>`
  }
}


BareMDE.defaultProps = {
   render: (m)=>`<div style='color:blue'>${m}</div>`,
   onUpdate: (c)=>console.log("Editor updated" ),
   save: (c)=>console.log("Dummy save function" , c.substring(0,200)+"..."),
   content: "write here", //text to display on mount
   modified: false,
   indicateChanges: true,
   previewClass: "markdownPreviewArea",
   fullScreen: false,
   showPreview: true,
   spellCheck: true,
   fullscreenZIndex: 1001,
   externalPreview: null,
   externalPreviewTitle: "External Preview",
   documentPath: 'default',
   imageRewriter: (p)=>p

}
