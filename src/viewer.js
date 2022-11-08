//viewer
import {h, render} from "preact";
import { getContent } from "./mdops";
import { JustView} from "./components/JustView"
import {saveToDisk} from "./fileops";


window.MMDS = new function(){
  var my = this;
  this.version= VERSION;
  this.usr= {};
  this.editMode= false;
  this.current= null;

  //default settings
  this.settings= {
    "title": "MD Site",
    "mdDir": "md/",
    "indexFile": "index.md",
    "menuFile": "menu.md",
    "scripts": [],
    "editorScript": "mdeditor.js",
    "hideEditor": false,
    "userScriptsPath" : "",
    "usr" : {}
  };

  this.page404 =  function(l){
    return{
      html: `<h1>${l}</h1><p>This page is not created yet. Click "edit" to create it.</p>`,
      markdown: ""
    }
  },

  this.errorPage = (p , errCode) =>{
    console.info("Error: " , errCode )

    if(errCode===404){
      return this.page404(p);
    }
    if(typeof(errCode)==='number'){
      return {
        html: "<h1>Error " + errCode + "</h1><p>Something went wrong</p>",
        markdown: ""
      }
    }

    return {
      html: "<h1>Fatal error</h1><p>Network down or host unreachable</p>",
      markdown: ""
    }
  };

  this.makePath= (fn)=>{
    const dp = window.MMDS.settings.mdDir ;
    return dp ? dp + fn : fn;
  };

  //View updaters 
  this._updaters= {};
  this._handlers= {};
  var updID =  1;
  this.addUpdater = (f)=>{
    updID++;
    this._updaters[updID] =  f;
    return updID;
  };
  this.removeUpdater = (id)=>{
    delete(my._updaters[id]);
  };

  this.on = (evtID , f)=>{
    console.log("setting listener" , evtID)
    // const mmds = window.MMDS;
    updID+=1;
    if(!this._handlers[evtID]){ this._handlers[evtID] = {} };
    this._handlers[evtID][updID] = f;
    return updID;
  };

  this.off = (evtID , handlerID)=>{
    try{
      delete(this._handlers[evtID][handlerID]);
    }catch{
      console.error("Can not delete handler" , handlerID , "for" , evtID);
    }
  },

  this.fire = (evtID , evtArgs)=>{
    console.log("firing" , evtID );
    if(!this._handlers[evtID] ){return};
    Object.values( this._handlers[evtID] ) 
    .forEach( ff=>ff(evtArgs) )
    ;
  };

  //run given function once
  this.once = (f)=>{
    f(this);
  },

  //run given function once WHEN window become active
  this.whenActive = (f)=>{
    const handler = function(){ f(my); window.removeEventListener("focus" , this) }
    window.addEventListener("focus", handler) ;
  };

  this.updateViews = (path,content)=>{
    Object.values(this._updaters).forEach(f=>f(path,content));
  },

  //re-run view updaters
  this.refresh = ()=>{
    this.updateViews(this.current.path , this.current.content);
  };

  //force reload current file from server
  this.reload = ()=>{
    this.showPath(this.current.path , {cache: "reload"});
    if(this.current.path===this.settings.menuFile){
      this.action.setMenu(this.settings.menuFile , {cache:"reload"});
    }
  };

  //show given content
  this.showContent= (p,c)=>{ //show page
    // console.info("Showing" , p)
    this.current = { path: p , content: c , saved: true }
    if(!this.editMode){ window.scrollTo(0,0) } 
    this.updateViews(p,c);
    this.fire("ready");
  },

  //show content of the file by given path
  this.showPath = (p , fetchOpts)=>{
    // console.log('showPath' , p);

    const filePath = this.makePath(p || this.settings.indexFile);
    return getContent(filePath, fetchOpts)
    .then(r=>{
      if(r.error){ console.info("Error" , r.error) ;

        this.showContent( p , this.errorPage(p , r.error ) );
        return;
      }
      this.showContent(p,r)
    })
    .catch(e=>{
      console.info("No such file" , filePath , e);
      this.showContent( p , this.page404(p) );
    })
  },

  //go to location 
  this.go =  (p)=>{ //go to the location
    //check and handle external links
    if(( p.match(/^( http|ftp )(s)?\:/i) ) ||  //starts with http
    ( !p.match(/\.(md|markdown)$/i) )  || //does not end with md extension
    p.match(/\#/) //contains hash
    ){
      this.cleanUp();
      window.location = p;
      return; 
    }

    if(p){
      this.showPath( p );
      history.pushState({ path: p , isMMMDSstate:true } , null , "#!"+p) ; //no URL here
      //handle empty path (=>indexFile)
    }else{
      this.showPath( this.settings.indexFile );
      history.pushState({ path: this.settings.indexFile , isMMMDSstate:true } , null , "#!"+this.settings.indexFile) ; 

    }
  },

  //basic app actions
  this.action = {


    edit: ()=>{
      this.editMode = true;
      const s = document.createElement("script");
      s.src= this.settings.editorScript;
      document.body.appendChild(s)
    },
    save: ()=>{
      console.info("Saving without editing")  ;
      saveToDisk(this.current.path, this.current.content.markdown)

    },
    setMenu: (p , fetchOptions)=>{

      const sidebarNode = document.getElementById("menu");
      if(!p){ return };
      getContent(this.makePath(this.settings.menuFile) , fetchOptions)
      .then(r=>{sidebarNode.innerHTML=r.html; this.refresh()})
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

  MMDS.on("ready" , ()=>console.log("ready fired"));

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


