/*

User script for "My Markdown Site"
Basic utility for managing multilingual documents sets
Assumes, that all documents named with lang prefix:

myfile.es.md and myfile.uk.md have the same content, 
former one in Spanish, latter - in Ukrainian.

Also document set should have separate menu files for
each language, like:

menu.ar.md - navigation in Arabic
menu.cv.md - navigation in Chuvash



*/
//API
window.MMDS.usr.bilingual = {
  changeLang(p,lang){
    const B = window.MMDS.usr.bilingual;
    if(!B.extractLang(p)){return p}
    // console.log("replace to" , lang);
    return p.replace( /\.([a-z]{1,3})\.([a-z]+)$/i , "." + lang + ".$2"   )

  },
  extractLang(p){
    var findLang = p.match(/\.([a-z]{1,3})\.[a-z]+$/i);
    if(!findLang){ return "" }
    return findLang[1];
  },
  switchTo: (lc)=>{
    const B = window.MMDS.usr.bilingual;
    const cp = window.location.hash.substring(2);
    console.log("switch to" ,  B.changeLang(cp, lc));
    window.MMDS.go(B.changeLang(cp, lc));
  }
}

//Sidebar must follow main document language

window.MMDS.addUpdater( (p,c)=>{
  const B = window.MMDS.usr.bilingual;
  const sbL = B.extractLang( window.MMDS.settings.menuFile );
  const pathL= B.extractLang( p );
  console.log("We're inside Bilingual updater" , sbL , pathL);
  if(sbL === pathL || !pathL){return}
  //change menufile
  const newM = B.changeLang( window.MMDS.settings.menuFile , pathL );
  window.MMDS.settings.menuFile = newM;
  //force load menufile
  window.MMDS.action.setMenu(newM);
  //update langswitch if prsent
  var langSwitchContainer = document.querySelector("#langSwitch");
  if(langSwitchContainer){
    langSwitchContainer.setAttribute("class", pathL);
    langSwitchContainer.querySelectorAll("a")
      .forEach( e=> { e.classList.remove("currentLanguage")} );
    const cl = langSwitchContainer.querySelector("." + pathL)
    cl.classList.add("currentLanguage");
    // .classList.add("current");

  }


} )
//Create switcher
console.info("Bilingual user script")
window.MMDS.once(function(mds)
  {
    const B = mds.usr.bilingual;
    // console.log("lang switch!")
    var langSwitchContainer = document.querySelector("#langSwitch");
    if(langSwitchContainer && langSwitchContainer.dataset.langs){
      let currentLang = B.extractLang(window.location.hash.substring(2)) ;
      langSwitchContainer.setAttribute("class", currentLang);
      let lng = langSwitchContainer.dataset.langs.split(",").map(e=>e.toLowerCase());
      lng.forEach( l=>{
        const e = document.createElement("a");
        e.innerHTML = l;
        e.setAttribute("class", l)
        // e.setAttribute("href", )
        e.addEventListener("click", ()=>{window.MMDS.usr.bilingual.switchTo(l)  })
        langSwitchContainer.appendChild(e);
      } )
    }
  }
)


