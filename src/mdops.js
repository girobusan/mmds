var emoji = require('markdown-it-emoji');
var md = require('markdown-it')({
  html:true,
  linkify: true,
  })
.use(require('markdown-it-checkbox'))
.use(emoji )
.use(require('markdown-it-multimd-table') , { 
  headerless: true,
  multiline: true
});
//
export function getFile(p , errf){
  return fetch(p)
  .then(r=>{
    if(r.ok){ return r.text() }
    throw new Error("no file");
  })
  // .catch(e=>console.log(e));
}

export function getContent(p){
// console.log("eee" , getFile(p));
  return getFile(p)
  .then(r=>{
    // console.log("r is" ,r)
    
    return { 
      markdown: r ,
      html: md.render(r) ,
       }
     })
    // .catch(e=>console.log("errororo",e))
    
     ;
}

export function renderMd(m){
 return md.render(m);
}
