

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


export function saveToDisk(name,content){
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', name);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

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
