window.MMDS.usr.bilingual={changeLang:(n,t)=>window.MMDS.usr.bilingual.extractLang(n)?n.replace(/\.([a-z]{1,3})\.([a-z]+)$/i,"."+t+".$2"):n,extractLang(n){var t=n.match(/\.([a-z]{1,3})\.[a-z]+$/i);return t?t[1]:""},switchTo:n=>{const t=window.MMDS.usr.bilingual,a=window.location.hash.substring(2);console.log("switch to",t.changeLang(a,n)),window.MMDS.go(t.changeLang(a,n))}},window.MMDS.addUpdater(((n,t)=>{const a=window.MMDS.usr.bilingual,e=a.extractLang(window.MMDS.settings.menuFile),i=a.extractLang(n);if(e!==i&&i){if(a.extractLang(window.MMDS.settings.menuFile)){const n=a.changeLang(window.MMDS.settings.menuFile,i);window.MMDS.settings.menuFile=n,window.MMDS.action.setMenu(n)}var s=document.querySelector("#langSwitch");s&&(s.setAttribute("class",i),s.querySelectorAll("a").forEach((n=>{n.classList.remove("currentLanguage")})),s.querySelector("."+i).classList.add("currentLanguage"))}})),console.info("Bilingual user script"),window.MMDS.once((function(n){const t=n.usr.bilingual,a=n.settings.usr.bilingual;var e=document.querySelector("#langSwitch");if(e&&(a||e.dataset.langs)){const n=a&&a.langs||e.dataset.langs;let i=t.extractLang(window.location.hash.substring(2));e.setAttribute("class",i),n.split(",").map((n=>n.toLowerCase())).map((n=>n.trim())).forEach((n=>{const t=document.createElement("a");t.innerHTML=n,t.setAttribute("class",n),n==i&&t.classList.add("currentLanguage"),t.addEventListener("click",(()=>{window.MMDS.usr.bilingual.switchTo(n)})),e.appendChild(t)}))}}));