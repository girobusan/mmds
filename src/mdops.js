const yaml = require('js-yaml');
const frm = require('markdown-it-front-matter');
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
    const r_out = {};

    md.use(frm , (f)=>{
      try{
        r_out.fm = yaml.load(f);
        console.info("Frontmatter found" , r_out.fm);
      }catch(e){
        console.error("Can not parse frontmatter:" , e)
      }
    } );
    // console.log("r is" ,r)
    if(r.error){ return r }
    r_out.html = md.render( r )
    r_out.markdown  = r;

    return r_out; 
  })
  // .catch(e=>console.log("errororo",e))

    ;
}

export function renderMd(m){
  const r = {};
  md.use(frm , (f)=>{
    try{
       r.fm = yaml.load(f);
    }catch(e){
       console.error("Can not parse frontmatter:" , e)
    }
  } );
  r.html = md.render(m);
  return r.html;
}
