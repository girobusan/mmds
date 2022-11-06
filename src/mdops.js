var emoji = require('markdown-it-emoji');
// import { parse as emoParse } from 'twemoji';
var md = require('markdown-it')({
  html:true,
  linkify: false,
  })
.use(require('markdown-it-checkbox'))
.use(emoji )
.use(require('markdown-it-multimd-table') , { 
  headerless: true,
  multiline: true
});

// md.renderer.rules.emoji = function(token, idx) {
//   // console.log(twemoji);
//   return emoParse(token[idx].content);
// };
//
export function getFile(p , fetchOpts){
   const fo = fetchOpts || {} ;
   // console.log("fetch with" , fo)
  return fetch(p , fo)
  .then(r=>{
     // console.log("request" , r )
    if(r.ok){ return r.text() }
    return {error: r.status , html: "Error " + r.status , markdown: "Error " + r.status} 
  })
  .catch(e=>{ console.log("request failed" , e) ;
      return { error: "Request failed" , html: "Error" , markdown: "error"  }
    });
}

export function getContent(p, fetchOpts){
// console.log("eee" , getFile(p));
  return getFile(p, fetchOpts)
  .then(r=>{
    // console.log("r is" ,r)
     if(r.error){ return r }
    
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
