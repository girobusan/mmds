window.MDS.addUpdater((p,c)=>{
   var lnks = document.querySelectorAll("a");
   lnks.forEach(

     l=>{
       if(l.getAttribute("href")==p){
         
         l.classList.add("currentPage")
       }else{
         l.classList.remove("currentPage")
       }
     }
   )
})
