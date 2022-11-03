//viewer
import {h, render} from "preact";
import { getContent } from "./mdops";
import { JustView} from "./components/JustView"
import {saveToDisk} from "./fileops";


window.MDS = {
  usr: {},
  settings: {
    "title": "MD Site",
    "mdDir": "md/",
    "indexFile": "index.md",
    "menuFile": "menu.md",
    "scripts": [],
    "editorScript": "mdeditor.js",
    "hideEditor": false,
    "userScriptsPath" : "",
    "usr" : {}
  },
  page404:  function(l){
  return{
    html: `<h1>${l}</h1><p>This page is not created yet. Click "edit" to create it.</p>`,
    markdown: ""
  }
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
  once(f){
     // console.log("run once");
     f(window.MDS);
  },
  whenActive(f){
    const handler = function(){ f(); window.removeEventListener("focus" , this) }
       window.addEventListener("focus", handler) ;
    },
  updateViews : function(path,content){
    Object.values(window.MDS.updaters).forEach(f=>f(path,content));
  },
  refresh(){
     window.MDS.updateViews(window.MDS.current.path,window.MDS.current.content);
  },
  reload(){
     window.MDS.showPath(window.MDS.current.path , {cache: "reload"});
  },
  showContent: function(p,c){ //show page
     // console.info("Showing" , p)
     window.MDS.current = { path: p , content: c , saved: true }
     if(!window.MDS.editMode){ window.scrollTo(0,0) } 
     window.MDS.updateViews(p,c);
  },
  showPath: function(p , fetchOpts){
  // console.log('showPath' , p);
    
    const filePath = window.MDS.makePath(p || window.MDS.settings.indexFile);
    getContent(filePath, fetchOpts)
    .then(r=>{
       window.MDS.showContent(p,r)
    })
    .catch(e=>{
      console.info("No such file" , filePath , e);
      //show 404 page?
       window.MDS.showContent( p , MDS.page404(p) );
    })
  },
  go: function(p){ //go to the location
     //check if external
     if(( p.match(/^( http|ftp )(s)?\:/i) ) ||  //starts with http
     ( !p.match(/\.(md|markdown)$/i) )  || //does not end with md extension
       p.match(/\#/) //contains hash
     ){
         window.MDS.cleanUp();
         window.location = p;
         return; 
     }
      
     if(p){
       window.MDS.showPath( p );
       history.pushState({ path: p , isMMDSstate:true } , null , "#!"+p) ; //no URL here
     }else{
      console.log("replace state")
       window.MDS.showPath( window.MDS.settings.indexFile );
       history.replaceState({ path: window.MDS.settings.indexFile , isMMDSstate:true } , null , "#!"+window.MDS.settings.indexFile) ; 

     }
  },

  action: {
    
    edit: ()=>{
      window.MDS.editMode = true;
      const s = document.createElement("script");
      s.src= window.MDS.settings.editorScript;
      document.body.appendChild(s)
    },
    save: ()=>{
    console.info("Saving without editing")  ;
    saveToDisk(window.MDS.current.path, window.MDS.current.content.markdown)

    },
    setMenu: (p)=>{

      const sidebarNode = document.getElementById("menu");
      getContent(window.MDS.makePath(window.MDS.settings.menuFile))
      .then(r=>{sidebarNode.innerHTML=r.html; window.MDS.refresh()})
      
    .catch( e=>console.log( "no sidebar" ,e ))

    }
  }
}




async function startSite(){
  console.info("My Markdown Site, version" , VERSION);
  const MDS = window.MDS;
  //
  //read settings
  const sjr = await fetch("settings.json")
  .catch(e=>{console.log("Can not access settings.json")});

  const settingsJSON =sjr&&( sjr.status=='200' ) ? await sjr.json() :  ""

  // console.log("what we've got" , settingsJSON );
  const userSettings = settingsJSON || window.settings ;

  const settings =  userSettings ? Object.assign(MDS.settings , userSettings) : MDS.settings ;
  MDS.settings = settings;
  // console.log("settings" , settings)
  //
  //find DOM nodes
  const sidebarNode = document.getElementById("menu");
  const contentNode = document.getElementById("content");
  //
  //add menu
  if(sidebarNode)
  {
    getContent(MDS.makePath(MDS.settings.menuFile))
    .then(r=>{sidebarNode.innerHTML=r.html})
  .catch( e=>console.log( "no sidebar" ,e ))
  }
  //
  //load custom scripts
  window.MDS.settings.scripts.forEach( (s , i)=>{
    const sc = document.createElement("script") ;
    sc.setAttribute("src", MDS.settings.userScriptsPath + s);
    console.info(i , "Loading user script:" , s);
    document.head.appendChild(sc);
  } )
  //let window title follow document header
  MDS.addUpdater((p,c)=>{
    const ttr = /<h1>(.*?)<\/h1>/i ;
    const ttext = c.html.match(ttr) ;
    if(ttext){
      window.document.title = ttext[1].replace(/<[^>]+>/g , "") 
    }else{
      window.document.title = MDS.settings.title + ": " + p;
    }

  })
  //add and show content
  if(contentNode){
    // console.log("Content node found")
    const JV = h(JustView , {base: MDS.settings.mdDir})
    render( JV, contentNode )
    //
    //find and display start location
    if(window.location.hash){
       history.replaceState( { path: window.location.hash.substring(2) , isMMDSstate: true} , null  );
       MDS.showPath(window.location.hash.substring(2))
    }else{
       history.replaceState({ path: window.MDS.settings.indexFile , isMMDSstate:true } , null , "#!"+window.MDS.settings.indexFile) ; 
       MDS.showPath(MDS.settings.indexFile)
    }
  }else{
     console.error("Content node not found")
  }

  //add listeners
  function detectClicks(evt){

    const t = evt.target;

    const h =t.getAttribute("href") || (t.parentNode.getAttribute && t.parentNode.getAttribute("href") ) ;
    if(!h || h.startsWith("data:")){ return } //no link
    //goo!
    window.MDS.go( h );
    console.log("link clicked" , h);
    evt.preventDefault();
    evt.stopPropagation();

  }
  function restoreState(s){
    if(!s.state.isMMDSstate){ return }
    window.MDS.showPath(s.state.path ) ;
  }  
  function syncHash(){
    window.MDS.go(window.location.hash.substring(2) );
    }

    window.document.addEventListener("click", detectClicks);
    window.addEventListener("popstate" , restoreState );
    window.addEventListener("hashchange" ,   syncHash);

    window.MDS.cleanUp = ()=>{

      // window.removeEventListener("click", detectClicks);
      window.removeEventListener("popstate" , restoreState );
      // window.removeEventListener("hashchange" ,   syncHash);
      window.removeEventListener("DOMContentLoaded", startSite);
      // delete(window.MDS);
    }

  }
    window.addEventListener("DOMContentLoaded", startSite);


