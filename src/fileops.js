
var inited = false;
var dirHandler = null;
var fsHandler = null;

const tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

const replaceToTags = {
  '&amp;':'&',
  '&lt;': '<',
  '&gt;': '>'
}

export function escapeTags(s){
  const replacer=(tag)=>{return tagsToReplace[tag]||tag}
  return s.replace(/[&<>]/g , replacer);
}
export function unescapeTags(s){
  const replacer=(tag)=>{return replaceToTags[tag]||tag}
  return s.replace(/&amp;|&lt;|&gt;/g , replacer);
}

export async function startWorkingWithFiles(){
  if(inited){ return }
  console.log("Starting working with files...");
  if(window.isSecureContext){
  console.log("Context is secure, which is good")
  }else{

  console.log("Context is NOT secure, which is bad")
  }

  if('showDirectoryPicker' in window){ 
    console.info("FS Access API available... maybe.")
    if( confirm("Do you want to use local file access?") ){
        
        dirHandler = await window.showDirectoryPicker({mode:"readwrite"}).catch(e=>console.error(e));
        console.log("dir handler" , dirHandler);
    }
  }else{
    console.info("FS Access API not available... maybe.")
    fileHandlerEnabled = false;
  }
  inited = true;
}


export async function saveToDisk(name,content){
  if(dirHandler){ 
    console.info('Save using local file access' , dirHandler);
    //get file handler
    const fh = 
    await dirHandler.getFileHandle(name , {create: true}  )
    //write
    const wb = await fh.createWritable();
    await wb.write(content);
    await wb.close();
    return;

  }
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', name);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

}

function saveViaFS(name, content){
return true;
}


export function loadFromDisk(callback){
  var element = document.createElement("input");
  element.setAttribute("type", "file");
  element.addEventListener("change" , function(){
    element.files[0]
    .text()
    .then(r=>callback(r))
  });
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);


}
