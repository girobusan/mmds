console.info("Link to script");
window.addEventListener("load", ()=>{
   const c = document.createElement("script");
   c.src = "../mdsite.js";
   window.document.body.appendChild(c);
})
