//viewer
import {h, render} from "preact";
import { getContent } from "./mdops";
import { JustView} from "./components/JustView"
import {saveToDisk} from "./fileops";


window.MMDS = {
  version: VERSION,
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

  errorPage: function(p , errCode){
     console.info("Error" , errCode )
    if(errCode==404){
      return window.MMDS.page404(p);
    }

    return {
      html: "<h1>Fatal error</h1><p>Network down or host unreachable</p>",
      markdown: ""
    }
  },

  makePath: function(fn){
    const dp = window.MMDS.settings.mdDir ;
    return dp ? dp + "" + fn : fn;
  },

  //View updaters 
  updaters: {},
  updID: 1,
  addUpdater : function(f){
    const id =  window.MMDS.updID
    window.MMDS.updaters[id] =  f;
    window.MMDS.updID++;
    return id;
  },
  removeUpdater : function(id){
   delete(window.MMDS.updaters[id]);
  },

  //run given function once
  once(f){
     f(window.MMDS);
  },

  //run given function once WHEN window become active
  whenActive(f){
    const handler = function(){ f(); window.removeEventListener("focus" , this) }
       window.addEventListener("focus", handler) ;
    },

  updateViews : function(path,content){
    Object.values(window.MMDS.updaters).forEach(f=>f(path,content));
  },

  //re-run view updaters
  refresh(){
     window.MMDS.updateViews(window.MMDS.current.path,window.MMDS.current.content);
  },

  //force reload current file from server
  reload(){
     window.MMDS.showPath(window.MMDS.current.path , {cache: "reload"});
     if(window.MMDS.current.path===window.MMDS.settings.menuFile){
        window.MMDS.action.setMenu(window.MMDS.settings.menuFile , {cache:"reload"});
     }
  },

  //show given content
  showContent: function(p,c){ //show page
     // console.info("Showing" , p)
     window.MMDS.current = { path: p , content: c , saved: true }
     if(!window.MMDS.editMode){ window.scrollTo(0,0) } 
     window.MMDS.updateViews(p,c);
  },

  //show content of the file by given path
  showPath: function(p , fetchOpts){
  // console.log('showPath' , p);
    
    const filePath = window.MMDS.makePath(p || window.MMDS.settings.indexFile);
    getContent(filePath, fetchOpts)
    .then(r=>{
       if(r.error){ console.info("Error" , r.error) ;
         
         window.MMDS.showContent( p , MMDS.errorPage(p , r.error ) );
         return;
       }
       window.MMDS.showContent(p,r)
    })
    .catch(e=>{
      console.info("No such file" , filePath , e);
       window.MMDS.showContent( p , MMDS.page404(p) );
    })
  },

  //go to location 
  go: function(p){ //go to the location
     //check and handle external links
     if(( p.match(/^( http|ftp )(s)?\:/i) ) ||  //starts with http
     ( !p.match(/\.(md|markdown)$/i) )  || //does not end with md extension
       p.match(/\#/) //contains hash
     ){
         window.MMDS.cleanUp();
         window.location = p;
         return; 
     }
      
     if(p){
       window.MMDS.showPath( p );
       history.pushState({ path: p , isMMMDSstate:true } , null , "#!"+p) ; //no URL here
    //handle empty path (=>indexFile)
     }else{
       window.MMDS.showPath( window.MMDS.settings.indexFile );
       history.pushState({ path: window.MMDS.settings.indexFile , isMMMDSstate:true } , null , "#!"+window.MMDS.settings.indexFile) ; 

     }
  },

  //basic app actions
  action: {

    // window.MMDS.go, //must be moved here

    edit: ()=>{
      window.MMDS.editMode = true;
      const s = document.createElement("script");
      s.src= window.MMDS.settings.editorScript;
      document.body.appendChild(s)
    },
    save: ()=>{
      console.info("Saving without editing")  ;
      saveToDisk(window.MMDS.current.path, window.MMDS.current.content.markdown)

    },
    setMenu: (p , fetchOptions)=>{

      const sidebarNode = document.getElementById("menu");
      if(!p){ return };
      getContent(window.MMDS.makePath(window.MMDS.settings.menuFile) , fetchOptions)
      .then(r=>{sidebarNode.innerHTML=r.html; window.MMDS.refresh()})
    .catch( e=>console.log( "no sidebar" ,e ))

    }
  }
}




async function startSite(){
  console.info("My Markdown Site, version" , VERSION);
  const MMDS = window.MMDS;
  
  //read settings
  const sjr = await fetch("settings.json")
  .catch(e=>{console.log("Can not access settings.json")});

  const settingsJSON =sjr&&( sjr.status=='200' ) ? await sjr.json() :  ""
  const userSettings = settingsJSON || window.settings ;
  const settings =  userSettings ? Object.assign(MMDS.settings , userSettings) : MMDS.settings ;
  MMDS.settings = settings;
  // console.log("settings" , settings)
  
  //find  required DOM nodes
  const sidebarNode = document.getElementById("menu");
  const contentNode = document.getElementById("content");
  
  //add menu
  if(sidebarNode)
  {
    getContent(MMDS.makePath(MMDS.settings.menuFile))
    .then(r=>{sidebarNode.innerHTML=r.html})
  .catch( e=>console.log( "no sidebar" ,e ))
  }
  //
  //load custom scripts
  window.MMDS.settings.scripts.forEach( (s , i)=>{
    const sc = document.createElement("script") ;
    sc.setAttribute("src", MMDS.settings.userScriptsPath + s);
    console.info(i , "Loading user script:" , s);
    document.head.appendChild(sc);
  } )

  //let window title follow document header
  MMDS.addUpdater((p,c)=>{
    const ttr = /<h1>(.*?)<\/h1>/i ;
    const ttext = c.html.match(ttr) ;
    if(ttext){
      window.document.title = ttext[1].replace(/<[^>]+>/g , "") 
    }else{
      window.document.title = MMDS.settings.title + ": " + p;
    }

  })

  //add and show content
  if(contentNode){
    // console.log("Content node found")
    const JV = h(JustView , {base: MMDS.settings.mdDir})
    render( JV, contentNode )
    //
    //find and display start location
    if(window.location.hash){
      history.replaceState( { path: window.location.hash.substring(2) , isMMMDSstate: true} , null  );
      MMDS.showPath(window.location.hash.substring(2))
    }else{
      history.replaceState({ path: window.MMDS.settings.indexFile , isMMMDSstate:true } , null , "#!"+window.MMDS.settings.indexFile) ; 
      MMDS.showPath(MMDS.settings.indexFile)
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
    window.MMDS.go( h );
    console.log("link clicked" , h);
    evt.preventDefault();
    evt.stopPropagation();

  }
  function restoreState(s){
     console.log("restoring state...");
    if(!s.state.isMMMDSstate){ return }  // we restore only MMMDS states
    window.MMDS.showPath(s.state.path ) ;
  }  
  function syncHash(){
     console.log("hash changed...")
    window.MMDS.go(window.location.hash.substring(2) );
    }

    window.document.addEventListener("click", detectClicks);
    // window.addEventListener("popstate" , restoreState );
    window.addEventListener("hashchange" ,   syncHash);

    window.MMDS.cleanUp = ()=>{
       console.log("removing listeners...")
      // window.removeEventListener("popstate" , restoreState );
      window.removeEventListener("DOMContentLoaded", startSite);
    }

  }

  window.addEventListener("DOMContentLoaded", startSite);


