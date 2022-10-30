//viewer
import {h, render} from "preact";
import { getContent } from "./mdops";
import { JustView} from "./components/JustView"

console.log("viewer");
const page404 = function(l){
  return{
    html: `<h1>No such page: ${l}</h1>Oops...`,
    markdown: ""
  }
}


window.MDS = {
  settings: {
    title: "MD Site",
    mdDir: "md/",
    indexFile: "index.md",
    menuFile: "menu.md",
    scripts: [],
    editorScript: "mdedit.js",
    // hideEditor: false
  },
  updaters: {},
  updID: 1,
  editMode: false,
  current: null,

  makePath: function(fn){
    const dp = window.MDS.settings.mdDir ;
    // return fn;
    return dp ? dp + "" + fn : fn;
  },
  addUpdater : function(f){
    const id =  window.MDS.updID
    window.MDS.updaters[id] =  f;
    window.MDS.updID++;
    return id;
  },
  removeUpdater : function(id){
   delete(window.MDS.updaters[id]);
  },
  updateViews : function(path,content){
    Object.values(window.MDS.updaters).forEach(f=>f(path,content));
  },
  showContent: function(p,c){ //show page
     // console.info("Showing" , p)
     window.MDS.current = { path: p , content: c , saved: true }
     
     window.MDS.updateViews(p,c);
  },
  showPath: function(p){
  // console.log('showPath' , p);
    
    const filePath = window.MDS.makePath(p || window.MDS.settings.indexFile);
    getContent(filePath)
    .then(r=>{
       window.MDS.showContent(p,r)
    })
    .catch(e=>{
      console.info("No such file" , filePath , e);
      //show 404 page?
       window.MDS.showContent( p , page404(p) );
    })
  },
  go: function(p){ //go to the location
     //check if external
     if(( p.match(/^( http|ftp )(s)?\:/i) ) ||  //starts with http
     ( !p.match(/\.(md|markdown)$/i) )  || //does not end with md extension
       p.match(/\#/) //contains hash
     ){
         window.location = p;
         return; 
     }
    
    // const filePath = window.MDS.makePath(p);
    // console.log("Browse to" , filePath) 
       window.MDS.showPath( p  )
       history.pushState(p , null , "#!"+p) ; //no URL here
  },

  action: {
    edit: ()=>{
      window.MDS.editMode = true;
      const s = document.createElement("script");
      s.src= window.MDS.settings.editorScript;
      document.body.appendChild(s)
    },
    setMenu: (p)=>{

      const sidebarNode = document.getElementById("menu");
      getContent(window.MDS.makePath(window.MDS.menuFile))
      .then(r=>{sidebarNode.innerHTML=r.html})
    .catch( e=>console.log( "no sidebar" ,e ))
    }
  }
}




function startSite(){
  console.log("Starting...");
  const MDS = window.MDS;
  //
  //read settings
  const settings = Object.assign(MDS.settings , window.settings) ;
  MDS.settings = settings;
  //
  //find DOM nodes
  const sidebarNode = document.getElementById("menu");
  const contentNode = document.getElementById("content");
  //
  //add menu
  if(sidebarNode)
  {
    getContent(MDS.makePath("sidebar.md"))
    .then(r=>{sidebarNode.innerHTML=r.html})
  .catch( e=>console.log( "no sidebar" ,e ))
  }
  //
  //add and show content
  if(contentNode){
    // console.log("Content node found")
    const JV = h(JustView , {base: MDS.settings.mdDir})
    render( JV, contentNode )
    if(window.location.hash){
       history.replaceState(window.location.hash.substring(2), null );
       MDS.showPath(window.location.hash.substring(2))
    }else{
       MDS.showPath(MDS.settings.indexFile)
    }
  }else{
     console.error("Content node not found")
  }
  //load custom scripts
  window.MDS.settings.scripts.forEach( s=>{
    const sc = document.createElement("script") ;
    sc.setAttribute("src", s);
    document.head.appendChild(sc);
  } )

}

function detectClicks(evt){
  
  const t = evt.target;
  // console.log(t.parentNode)
  
  const h =t.getAttribute("href") || (t.parentNode.getAttribute && t.parentNode.getAttribute("href") ) ;
  if(!h || h.startsWith("data:")){ return } //no link
  //goo!
  window.MDS.go( h );
  console.log("link clicked" , h);
  evt.preventDefault();
  evt.stopPropagation();

}

window.addEventListener("DOMContentLoaded", startSite);
window.addEventListener("click", detectClicks);
window.addEventListener("popstate" , (s)=>{if(s){ window.MDS.showPath(s.state ) } });
window.addEventListener("hashchange" , ()=>{window.MDS.go(window.location.hash.substring(2) )  });
window.addEventListener("error", (e)=>console.log("Error in window" , e))

