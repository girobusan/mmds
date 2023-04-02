// const yaml = require('js-yaml');
// const frm = require('markdown-it-front-matter');
const matter = require("gray-matter");
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
    if(r.error){ return r }
    const withFM = matter(r);
    const r_out = {};
    r_out.html = md.render( withFM.content )
    r_out.markdown  = r;
    r_out.meta = withFM.data;

    // console.info("Return" , r_out.meta)

    return r_out; 
  })
  // .catch(e=>console.log("errororo",e))

    ;
}

export function renderMd(m){
  // console.log("Simple render!" , m)
  const withFM = matter(m);
  const r = md.render(withFM.content);
  return r;
}
