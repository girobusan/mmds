/*
 *
 * User script for MMDS
 * marks links to unsaved files
 *
 */

console.info("`Mark unsaved` user script")

window.MMDS.addUpdater(
  ()=>{
    const className = "unsavedDoc";
    const l = document.querySelectorAll("a");
    const m = window.MMDS.listUnsaved ? window.MMDS.listUnsaved() : [];
    console.log("search for unsaved");
    
    if(m.length==0){ 
       l.forEach(a=>a.classList.remove(className)) 
       return};

    l.forEach( (a)=>{
      const h = a.getAttribute("href");
      console.log("href" , h , "array" , m);
      
      if(m.indexOf(h)!=-1){
       a.classList.add(className)
      }else{
       a.classList.remove(className)
      }
    } );

  }
)
