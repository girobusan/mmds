console.info("Current Link user script"),window.MDS.addUpdater((function(e,r){console.log("check if current link",e),e||(e=window.MDS.current.path),document.querySelectorAll("a").forEach((r=>{r.getAttribute("href")==e?r.classList.add("currentPage"):r.classList.remove("currentPage")}))}));