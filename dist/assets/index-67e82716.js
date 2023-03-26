(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))n(l);new MutationObserver(l=>{for(const s of l)if(s.type==="childList")for(const u of s.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&n(u)}).observe(document,{childList:!0,subtree:!0});function t(l){const s={};return l.integrity&&(s.integrity=l.integrity),l.referrerPolicy&&(s.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?s.credentials="include":l.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(l){if(l.ep)return;l.ep=!0;const s=t(l);fetch(l.href,s)}})();const G="/boggle/assets/wordlist-921c5af8.txt",S=document.getElementById("submit-word"),y=document.getElementById("board-div"),v=document.getElementById("start-btn"),R=document.getElementById("custom-game-btn"),i=document.getElementById("custom-game-prompt"),D=document.getElementById("custom-board"),W=document.getElementById("custom-time"),Y=document.getElementById("custom-min-length"),H=document.getElementById("custom-game-start-btn"),j=document.getElementById("word-list"),U=document.getElementById("score"),B=document.getElementById("time"),F=document.getElementById("game-over"),q=document.getElementById("play-again-btn"),K=document.getElementById("share-btn");let f=100,b=3,a="",g=[],r=[],d=0,C=[],T=[],h=!1,x=!1;const I={2:50,3:100,4:400,5:800,6:1400,7:1800,8:2200};let L=!1,k="mousedown",M="mouseover",w=!1;"ontouchstart"in window&&(w=!0,k="touchmove",M="click",S.classList.remove("hidden"));function X(){const e=[],o="ABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let t=0;t<4;t++){const n=[];for(let l=0;l<4;l++)n.push(o[Math.floor(Math.random()*o.length)]);e.push(n)}return e}function J(e){for(let o=0;o<e.length;o++)console.log(e[o].join(" | "))}function O(e){const o=document.getElementById("boggle-board");for(let t=0;t<e.length;t++){const n=o.insertRow();for(let l=0;l<e[t].length;l++){const s=n.insertCell();s.innerHTML=e[t][l],s.setAttribute("data-row",t),s.setAttribute("data-col",l),s.classList.add("cell"),T.push(s),s.addEventListener(M,function(u){if(!L&&!w){console.log("Not selecting word");return}E(u)})}}}let c=null;const m=new URLSearchParams(window.location.search);if(m.has("boardSeed")){const e=m.get("boardSeed");c=z(e)}else c=X();m.has("time")&&(f=parseInt(m.get("time")));m.has("minLength")&&(b=parseInt(m.get("minLength")));console.log("Boggle Board:",c);J(c);O(c);console.log(T);window.addEventListener(k,function(e){document.getElementById("boggle-board").getElementsByTagName("td"),e.target.classList.contains("cell")&&(E(e),L=!0)});function E(e){if(console.log(e.target.nodeName),!!e.target.classList.contains("cell")){if(e.target.style.backgroundColor==="yellow"){p(!1);return}if(a.length>0){const o=g[a.length-1],t=parseInt(o.getAttribute("data-row")),n=parseInt(o.getAttribute("data-col")),l=parseInt(e.target.getAttribute("data-row")),s=parseInt(e.target.getAttribute("data-col"));if(Math.abs(t-l)>1||Math.abs(n-s)>1){p(!1);return}}e.target.style.backgroundColor="yellow",a+=e.target.innerHTML,g.push(e.target),console.log(a),console.log(g)}}function p(e){a="",g=[],L=!1;const t=document.getElementById("boggle-board").getElementsByTagName("td");for(let n=0;n<t.length;n++)e||(t[n].style.backgroundColor="white");for(let n=0;n<t.length;n++)t[n].removeEventListener("mouseover",E)}window.addEventListener("mouseup",function(e){L&&(console.log(a),A(a),p(!0))});w&&S.addEventListener("click",function(e){A(a),p(!0)});async function Q(e){let o=await V(G);return o=o.split(`
`),console.log("Checking word: "+e),o.includes(e)?(console.log(e+" was there!"),!0):(console.log(e+" was not there!"),!1)}async function V(e){var o=null,t=new XMLHttpRequest;return t.open("GET",e,!1),t.send(),t.status==200&&(o=t.responseText,console.log(typeof o)),o}async function A(e){console.log("Checking word: "+e),console.log(g),r=g,e=e.toLowerCase();let o=await Q(e);if(console.log("Done checking word",o),o&&C.indexOf(e)===-1&&e.length>=b){console.log(e+" was there!"),d+=I[e.length],U.textContent="Score: "+d,console.log("Your Score is: "+d),C.push(e);const t=document.createElement("li");t.textContent=e+" - "+I[e.length],j.appendChild(t);for(let n=0;n<r.length;n++)console.log(r[n]),r[n].style.backgroundColor="green";setTimeout(function(){for(let n=0;n<r.length;n++)console.log(r[n]),r[n].style.backgroundColor="white";r=[]},500)}else{console.log(e+" was NOT there...");for(let t=0;t<r.length;t++)console.log(r[t]),r[t].style.backgroundColor="red";setTimeout(function(){for(let t=0;t<r.length;t++)console.log(r[t]),r[t].style.backgroundColor="white";r=[]},500)}}function P(){B.textContent="Time: "+f;var e=Date.now();let o=setInterval(function(){var t=Date.now()-e;let n=f-Math.floor(t/1e3);B.textContent="Time: "+n,n<=0&&(alert("Time's up! Your score is: "+d),clearInterval(o),Z())},1e3)}function Z(){y.classList.add("hidden"),F.classList.remove("hidden");const e=document.getElementById("final-score");e.textContent="Your final score is: "+d+"!";const t=new URLSearchParams(window.location.search).get("score");t!==null&&(d>t?e.textContent+=" You beat the other persons score of "+t+"!":d<t?e.textContent+=" You lost to the other persons score of "+t+"!":e.textContent+=" You tied with the other persons score of "+t+"!")}v.addEventListener("click",function(){y.classList.remove("hidden"),v.parentElement.classList.add("hidden"),P()});q.addEventListener("click",function(){location.reload()});function N(e){let o="";for(let t=0;t<e.length;t++)for(let n=0;n<e[t].length;n++){let s=e[t][n].charCodeAt(0);o+=s+"."}return o}function z(e){let o=[],t=[],n="";for(let l=0;l<e.length;l++){if(e[l]==="."){let s=String.fromCharCode(n);t.push(s),n=""}else n+=e[l];t.length===4&&(o.push(t),t=[])}return o}console.log(N(c));K.addEventListener("click",function(){let e=N(c),o=window.location.href;o=o.split("?")[0],o+="challenge/",o+="?boardSeed="+e,o+="&score="+d,x&&(o+="&time="+f,o+="&minLength="+b),navigator.clipboard.writeText(o).then(function(){console.log("Async: Copying to clipboard was successful!"),alert("Copied to clipboard!")},function(t){console.error("Async: Could not copy text: ",t)})});R.addEventListener("click",function(){i.classList.contains("inactive")?i.classList.remove("inactive"):i.classList.remove("hidden"),i.classList.add("active"),h=!0});document.addEventListener("keydown",function(e){e.key==="Escape"&&h&&(i.classList.remove("active"),i.classList.add("inactive"),h=!1)});function _(e){let o=[],t=e.split(".");for(let n=0;n<t.length;n++){const l=[];for(let s=0;s<4;s++){const u=t[n].charAt(s);l.push(u)}o.push(l)}return o}function $(){let e=document.getElementById("boggle-board");e.innerHTML=""}H.addEventListener("click",function(){let e=D.value,o=W.value,t=Y.value;if(e.length===19)c=_(e),$(),O(c);else if(e.length!==0){alert("Invalid board seed!");return}t.length!==0&&(t=parseInt(t),b=t),x=!0,i.classList.remove("active"),i.classList.add("inactive"),h=!1,f=o,y.classList.remove("hidden"),v.parentElement.classList.add("hidden"),P()});