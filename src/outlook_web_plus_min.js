"use strict";let startTimer=null,hideLeftRail=!0,hideTopIcons=!0,hideFirstemailAd=!0;const regex=/\s\(\d+ emails\)/,regexEmail=/\s\(\d+ email\)/,defaultMs=100;let observer=null,emailsText="emails",addEmailCalculator=!0,emailCalculatorColor="green",alignTitle=!0,addcustomBackground=!0,customBackground="https://wallpapercave.com/wp/wp2757894.gif",topbarTransparency=!0,supportAndRateButton=!0;const start=async()=>{if(null!==document.getElementById("o365header")){let e=await new Promise(e=>{chrome.storage.local.get(null,a=>e(a))});loadVariables(e),clearInterval(startTimer),await Promise.all([cleanLeftRail(defaultMs),cleanFirstEmailAd(defaultMs),emailCalculator(defaultMs),emailCalculatorReloader(defaultMs),resizeHandler(defaultMs),alignFolderTitle(defaultMs),emailFolderListeners(defaultMs),backgroundChanger(defaultMs),topbarTransparencyChanger(defaultMs)]),cleanTopBarIcons(300),addSupportAndRate(300)}};startTimer=setInterval(start,200),chrome.storage.onChanged.addListener(function(e){let a=Object.keys(e)[0];switch(a){case"hideLeftRail":hideLeftRail=e.hideLeftRail.newValue,cleanLeftRail();break;case"hideTopIcons":hideTopIcons=e.hideTopIcons.newValue,cleanTopBarIcons();break;case"hideFirstemailAd":hideFirstemailAd=e.hideFirstemailAd.newValue,cleanFirstEmailAd();break;case"addEmailCalculator":addEmailCalculator=e.addEmailCalculator.newValue,emailCalculator();break;case"emailCalculatorColor":emailCalculatorColor=e.emailCalculatorColor.newValue,emailCalculator();break;case"alignTitle":alignTitle=e.alignTitle.newValue,alignFolderTitle();break;case"addcustomBackground":addcustomBackground=e.addcustomBackground.newValue,backgroundChanger();break;case"customBackground":customBackground=e.customBackground.newValue,backgroundChanger();break;case"topbarTransparency":topbarTransparency=e.topbarTransparency.newValue,topbarTransparencyChanger();break;case"supportAndRateButton":supportAndRateButton=e.supportAndRateButton.newValue,addSupportAndRate()}});const loadVariables=e=>{hideFirstemailAd=void 0===e.hideFirstemailAd?hideFirstemailAd:e.hideFirstemailAd,hideLeftRail=void 0===e.hideLeftRail?hideLeftRail:e.hideLeftRail,hideTopIcons=void 0===e.hideTopIcons?hideTopIcons:e.hideTopIcons,addEmailCalculator=void 0===e.addEmailCalculator?addEmailCalculator:e.addEmailCalculator,alignTitle=void 0===e.alignTitle?alignTitle:e.alignTitle,addcustomBackground=void 0===e.addcustomBackground?addcustomBackground:e.addcustomBackground,customBackground=void 0===e.customBackground?customBackground:e.customBackground,topbarTransparency=void 0===e.topbarTransparency?topbarTransparency:e.topbarTransparency,supportAndRateButton=void 0===e.supportAndRateButton?supportAndRateButton:e.supportAndRateButton,"string"==typeof e.emailCalculatorColor&&(emailCalculatorColor=e.emailCalculatorColor),chrome.storage.local.set({hideLeftRail,hideFirstemailAd,hideTopIcons,addEmailCalculator,emailCalculatorColor,alignTitle,addcustomBackground,customBackground,topbarTransparency,supportAndRateButton})},resizeHandler=()=>{let e=!1,a=!1,l=!1,t=()=>{let t=window.innerWidth;t<=1050&&!e?(topbarTransparencyChanger(),cleanLeftRail(),cleanTopBarIcons(),e=!0):t>1050&&e&&(topbarTransparencyChanger(),cleanLeftRail(),cleanTopBarIcons(),e=!1),t<=770&&!a?(alignFolderTitle(),emailCalculator(),a=!0):t>770&&a&&(alignFolderTitle(),emailCalculator(),a=!1),t<542&&!l?(emailFolderListeners(),l=!0):t>=542&&l&&(emailFolderListeners(),l=!1)};window.addEventListener("resize",t),t()},emailCalculatorReloader=()=>{document.addEventListener("click",e=>{let a=e.target.parentNode.parentNode.parentNode;(a.classList.contains("is-checked")||a.id.startsWith("ok-")||a.classList.contains("_EhYJ")||a.classList.contains("ac0xq")||a.classList.contains("p4pwT")||a.parentNode.classList.contains("BPfgd"))&&(emailCalculator(),alignFolderTitle())},{capture:!0})},emailCalculator=(e=0)=>{let a=0,l=()=>{a++;let e=document.querySelector(".jXaVF"),l=e?e.innerText:null,o=document.querySelector(".wk4Sg"),r=document.getElementById("EmptyState_MainMessage");if(window.location.href.includes("calendar")&&clearInterval(t),e&&o){let n=parseInt(o.title.match(/-\s(\d+)/)[1]);observer||(observer=new MutationObserver(e=>{for(let a of e)"attributes"===a.type&&"title"===a.attributeName&&emailCalculator()})).observe(o,{attributes:!0}),1==n&&(regexEmail.test(l)?e.innerHTML=l.replace(regexEmail,`<b class="mailColor" style="color: ${emailCalculatorColor}; display: ${addEmailCalculator?"inline":"none"}"> (${n} ${emailsText.slice(0,-1)})</b>`):e.innerHTML=`${l} <b class="mailColor" style="color: ${emailCalculatorColor}; display: ${addEmailCalculator?"inline":"none"}"> (${n} ${emailsText.slice(0,-1)})</b>`,clearInterval(t)),n>1&&(regex.test(l)?e.innerHTML=l.replace(regex,`<b class="mailColor" style="color: ${emailCalculatorColor}; display: ${addEmailCalculator?"inline":"none"}"> (${n} ${emailsText})</b>`):e.innerHTML=`${l} <b class="mailColor" style="color: ${emailCalculatorColor}; display: ${addEmailCalculator?"inline":"none"}"> (${n} ${emailsText})</b>`,clearInterval(t))}(a>200||r&&e)&&(regexEmail.test(l)?e.innerHTML=l.replace(regexEmail,`<b class="mailColor" style="color: ${emailCalculatorColor}; display: ${addEmailCalculator?"inline":"none"}"> (0 ${emailsText.slice(0,-1)})</b>`):e.innerHTML=`${l} <b class="mailColor" style="color: ${emailCalculatorColor}; display: ${addEmailCalculator?"inline":"none"}"> (0 ${emailsText.slice(0,-1)})</b>`,clearInterval(t))},t=setInterval(l,e)},cleanLeftRail=()=>{let e=document.getElementById("LeftRail");e.style.display=hideLeftRail?"none":"block"},alignFolderTitle=(e=0)=>{let a=()=>{let e=document.querySelector(".IG8s8");e&&(alignTitle?e.style.paddingLeft="0px":e.style.paddingLeft="16px",clearInterval(l))},l=setInterval(a,e)},cleanTopBarIcons=(e=0)=>{let a=()=>{let e=document.getElementById("owaMeetNowButton_container"),a=document.getElementById("teams_container"),t=document.getElementById("owaNoteFeedButton_container");e&&a&&t&&(e.style.display=hideTopIcons?"none":"block",a.style.display=hideTopIcons?"none":"block",t.style.display=hideTopIcons?"none":"block",clearInterval(l))},l=setInterval(a,e)},cleanFirstEmailAd=(e=0)=>{let a=0,l=()=>{let e=document.getElementById("OwaContainer");e&&(e.style.display=hideFirstemailAd?"none":"block",clearInterval(t)),a>=60&&clearInterval(t),a++},t=setInterval(l,e)},emailFolderListeners=(e=0)=>{let a=()=>{let e=document.querySelectorAll(".C2IG3");e&&(e.forEach(e=>{e.addEventListener("click",()=>{observer&&(observer.disconnect(),observer=null),setTimeout(alignFolderTitle,0),setTimeout(emailCalculator,0),setTimeout(cleanFirstEmailAd,0)})}),clearInterval(l))},l=setInterval(a,e)},backgroundChanger=(e=0)=>{let a=()=>{let e=document.querySelector(".o365sx-navbar");e&&addcustomBackground&&(e.style.backgroundImage=`url("${customBackground}")`,e.style.backgroundPosition="center",e.style.backgroundRepeatX="repeat"),addcustomBackground||(e.style.backgroundImage=""),clearInterval(l)},l=setInterval(a,e)},topbarTransparencyChanger=(e=0)=>{let a=()=>{let e=document.querySelector(".o365sx-appName"),a=document.querySelectorAll(".o365sx-button"),t=document.querySelector(".nUPgy");if(e&&12==a.length&&t){let o=getComputedStyle(e),r=o.backgroundColor,n=i(r,topbarTransparency?0:.8);function i(e,a){let l=e.match(/#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i),t=e.match(/rgb\((\d+), (\d+), (\d+)\)/i),o=e.match(/rgba\((\d+), (\d+), (\d+), (0(\.\d+)?|1(\.0)?)\)/i);return t?`rgba(${t[1]}, ${t[2]}, ${t[3]}, ${a})`:o?`rgba(${o[1]}, ${o[2]}, ${o[3]}, ${a})`:l?`rgba(${parseInt(l[1],16)}, ${parseInt(l[2],16)}, ${parseInt(l[3],16)}, ${a})`:void 0}e.style.backgroundColor=n,t.style.backgroundColor=n,a.forEach(e=>{e.style.backgroundColor=n}),clearInterval(l)}},l=setInterval(a,e)},addSupportAndRate=(e=0)=>{let a=()=>{let e=document.getElementById("headerButtonsRegionId"),a=document.getElementById("rateAndSupport_container");if(e){if(supportAndRateButton&&9==e.children.length){let t=document.createElement("div");t.id="rateAndSupport_container",t.classList.add("M3pcB5evSAtYMozck1WU7A=="),t.style.display="block";let o=document.createElement("a");o.style.width="48px",o.style.height="48px",o.style.display="flex",o.style.justifyContent="center",o.style.alignItems="center",o.href=navigator.userAgent.toLowerCase().indexOf("firefox")>-1?"https://addons.mozilla.org/fr/firefox/addon/outlook-web-plus/reviews":"https://chromewebstore.google.com/detail/outlook-web-plus/jgomcpcjiffhcbmodgkekfenhhmjphpn/reviews",o.target="_blank";let r=document.createElement("img");r.src="https://raw.githubusercontent.com/rztprog/outlook-web-plus/main/icons/stars_rating.png",o.appendChild(r),t.appendChild(o),e.insertBefore(t,e.firstChild);return}a&&(supportAndRateButton?a.style.display="block":a.style.display="none",clearInterval(l))}},l=setInterval(a,e)};