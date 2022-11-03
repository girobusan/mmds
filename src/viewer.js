//viewer
import {h, render} from "preact";
import { getContent } from "./mdops";
import { JustView} from "./components/JustView"
import {saveToDisk} from "./fileops";


window.MDS = {
  usr: {},
  editMode: false,
  current: null,

  //default settings
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

  makePath: function(fn){
    const dp = window.MDS.settings.mdDir ;
    return dp ? dp + "" + fn : fn;
  },

  //View updaters 
  updaters: {},
  updID: 1,
  addUpdater : function(f){
    const id =  window.MDS.updID
    window.MDS.updaters[id] =  f;
    window.MDS.updID++;
    return id;
  },
  removeUpdater : function(id){
   delete(window.MDS.updaters[id]);
  },

  //run given function once
  once(f){
     f(window.MDS);
  },

  //run given function once WHEN window become active
  whenActive(f){
    const handler = function(){ f(); window.removeEventListener("focus" , this) }
       window.addEventListener("focus", handler) ;
    },

  updateViews : function(path,content){
    Object.values(window.MDS.updaters).forEach(f=>f(path,content));
  },

  //re-run view updaters
  refresh(){
     window.MDS.updateViews(window.MDS.current.path,window.MDS.current.content);
  },

  //force reload current file from server
  reload(){
     window.MDS.showPath(window.MDS.current.path , {cache: "reload"});
  },

  //show given content
  showContent: function(p,c){ //show page
     // console.info("Showing" , p)
     window.MDS.current = { path: p , content: c , saved: true }
     if(!window.MDS.editMode){ window.scrollTo(0,0) } 
     window.MDS.updateViews(p,c);
  },

  //show content of the file by given path
  showPath: function(p , fetchOpts){
  // console.log('showPath' , p);
    
    const filePath = window.MDS.makePath(p || window.MDS.settings.indexFile);
    getContent(filePath, fetchOpts)
    .then(r=>{
       window.MDS.showContent(p,r)
    })
    .catch(e=>{
      console.info("No such file" , filePath , e);
       window.MDS.showContent( p , MDS.page404(p) );
    })
  },

  //go to location 
  go: function(p){ //go to the location
     //check and handle external links
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
    //handle empty path (=>indexFile)
     }else{
       window.MDS.showPath( window.MDS.settings.indexFile );
       history.pushState({ path: window.MDS.settings.indexFile , isMMDSstate:true } , null , "#!"+window.MDS.settings.indexFile) ; 

     }
  },

  //basic app actions
  action: {

    // window.MDS.go, //must be moved here

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
      if(!p){ return };
      getContent(window.MDS.makePath(window.MDS.settings.menuFile))
      .then(r=>{sidebarNode.innerHTML=r.html; window.MDS.refresh()})
    .catch( e=>console.log( "no sidebar" ,e ))

    }
  }
}




async function startSite(){
  console.info("My Markdown Site, version" , VERSION);
  const MDS = window.MDS;
  
  //read settings
  const sjr = await fetch("settings.json")
  .catch(e=>{console.log("Can not access settings.json")});

  const settingsJSON =sjr&&( sjr.status=='200' ) ? await sjr.json() :  ""
  const userSettings = settingsJSON || window.settings ;
  const settings =  userSettings ? Object.assign(MDS.settings , userSettings) : MDS.settings ;
  MDS.settings = settings;
  // console.log("settings" , settings)
  
  //find  required DOM nodes
  const sidebarNode = document.getElementById("menu");
  const contentNode = document.getElementById("content");
  
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
     console.log("restoring state...");
    if(!s.state.isMMDSstate){ return }  // we restore only MMDS states
    window.MDS.showPath(s.state.path ) ;
  }  
  function syncHash(){
     console.log("hash changed...")
    window.MDS.go(window.location.hash.substring(2) );
    }

    window.document.addEventListener("click", detectClicks);
    // window.addEventListener("popstate" , restoreState );
    window.addEventListener("hashchange" ,   syncHash);

    window.MDS.cleanUp = ()=>{
       console.log("removing listeners...")
      // window.removeEventListener("popstate" , restoreState );
      window.removeEventListener("DOMContentLoaded", startSite);
    }

  }

  window.addEventListener("DOMContentLoaded", startSite);


