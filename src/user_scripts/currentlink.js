/*

User script for "My Markdown Site"
Adds currentPage class to all links to the
current page.


*/
console.info("Current Link user script");
function checkIfCurrentLink(p,c){
   console.log("check if current link" , p );
  if(!p){ p = window.MDS.current.path }
   var lnks = document.querySelectorAll("a");
   lnks.forEach(
     l=>{
       // console.log(p , ":" , l.getAttribute("href")  )
       if(l.getAttribute("href")==p){
         
         l.classList.add("currentPage")
       }else{
         l.classList.remove("currentPage")
       }
     }
   )  
}

window.MDS.addUpdater( checkIfCurrentLink );
