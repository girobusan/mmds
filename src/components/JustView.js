import {Component , createRef } from "preact";
import {html} from "htm/preact";
import {ActionRow} from "./ActionRow";



export class JustView extends Component{
 
  constructor(props){
  // console.log("Just View");
  super(props);
  this.state={ html: props.html }
  this.updater = this.updater.bind(this);
  this.text = createRef();
  //??
  this.updaterRef = window.MMDS.addUpdater(this.updater);
  }

  componentWillUnmount(){
    console.info("removing JustView component");
    window.MMDS.removeUpdater(this.updaterRef);
  }
  updater(p,c){
     // console.log("JustView updated");
    this.setState({html: c.html}) 
  }

  componentDidUpdate(){
     const imgs = this.text.current.querySelectorAll("*[src]");
     // console.log("found" ,imgs )
     imgs.forEach(i=>{
       if(i.getAttribute("src").match(/^http(s)?:/)){
           return;
       }
       if(i.getAttribute("src").startsWith(this.props.base)){
         return;
       }
       i.src = this.props.base + i.getAttribute("src")
     })
  }

  render(){
    return html`
    <div class="JustView">
    <div class="text" 
    ref=${this.text}
    dangerouslySetInnerHTML=${{ __html:this.state.html }} >
    </div>
    <${ ActionRow } />
    </div>`
  }
  

}

JustView.defaultProps={
  html: "Wait a moment..."
}
