import {Component , createRef } from "preact";
// import { useRef } from "preact/hooks";
import {html} from "htm/preact";
import {ActionRow} from "./ActionRow";
import * as MDE from "easymde";
import {If} from "./If";
// require("./editor.scss")
require("easymde/dist/easymde.min.css");

const MDS = window.MDS;

export class ViewEdit extends Component{
  constructor(props){
    super(props);
    this.updater = this.updater.bind(this);
    this.text = createRef();
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

  updater(p,c){
    console.log("mds editmode" , MDS.editMode);
    this.setState({content: c , path: p}) 
  }

  render(){
     return html`<div class="ViewEdit">
     <${If} condition=${MDS.editMode}>
       editmode
     </${ If }>
     <${If} condition=${!MDS.editMode}>
    <div class="text" 
    ref=${this.text}
    dangerouslySetInnerHTML=${{ __html:this.state.content.html }} >
    </div>
     </${ If }>
     <${ActionRow} />
     </div>`
  }
}
