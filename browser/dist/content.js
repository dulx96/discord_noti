(()=>{"use strict";var e=function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function l(e){try{c(r.next(e))}catch(e){i(e)}}function u(e){try{c(r.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(l,u)}c((r=r.apply(e,t||[])).next())}))},t=function(e,t){var n,r,o,i,l={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;l;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return l.label++,{value:i[1],done:!1};case 5:l.label++,r=i[1],i=[0];continue;case 7:i=l.ops.pop(),l.trys.pop();continue;default:if(!((o=(o=l.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){l=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){l.label=i[1];break}if(6===i[0]&&l.label<o[1]){l.label=o[1],o=i;break}if(o&&l.label<o[2]){l.label=o[2],l.ops.push(i);break}o[2]&&l.ops.pop(),l.trys.pop();continue}i=t.call(e,l)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}},n="http://127.0.0.1:9333/slack/services/T01SLNU34UE/B01TJ85TH9D/EJEopby1XxXCY5v7utjki9II",r=["vanthucbk","hoangbi"];function o(n,r){return void 0===n&&(n=""),void 0===r&&(r={}),e(this,void 0,void 0,(function(){return t(this,(function(e){switch(e.label){case 0:return[4,fetch(n,{method:"POST",mode:"cors",cache:"no-cache",credentials:"same-origin",headers:{"Content-Type":"application/json"},redirect:"follow",referrerPolicy:"no-referrer",body:JSON.stringify(r)})];case 1:return[2,e.sent()]}}))}))}!function(){window._alert=!0;var i=null,l=void 0,u=document.querySelector('[data-list-id="chat-messages"]');null===u&&o(n,{text:"chat box not detected - "+l}),l=null==u?void 0:u.baseURI,null==u||u.addEventListener("DOMNodeInserted",(function(u){!function(u){var c,a,s,d;e(this,void 0,void 0,(function(){var e,h,f,v,p,y,b,w,g;return t(this,(function(t){switch(t.label){case 0:t.trys.push([0,2,,4]),e=u.target;try{if("listitem"!==e.getAttribute("role"))return[2]}catch(e){return console.log(String(e)),[2]}return i=(null===(c=e.querySelector("div > h2 > span > span"))||void 0===c?void 0:c.innerHTML)||i,console.log(i),i&&!r.includes(i)?[2]:(h=null===(s=null===(a=e.querySelector("div"))||void 0===a?void 0:a.querySelector("div"))||void 0===s?void 0:s.textContent,f=null===(d=e.children[1])||void 0===d?void 0:d.firstElementChild,v=null==f?void 0:f.href,p=e.id.split("-")[2],y=l?l+"/"+p:null,(b=(b=(new Date).getUTCHours()+9)>24?b-24:b)>=0&&b<=9&&v&&fetch("http://127.0.0.1:9333/vybit/vpgobhuhwbg4hk7u"),w={text:(null!=i?i:"unknownUser")+(h?": "+h:""),blocks:[{type:"divider"},{type:"section",text:{type:"mrkdwn",text:"*"+i+"* <"+y+"|link>"}}]},h&&w.blocks.push({type:"section",text:{type:"mrkdwn",text:h}}),v&&w.blocks.push({type:"image",image_url:v,alt_text:i||"unkown"}),[4,o(n,w)]);case 1:return t.sent(),[3,4];case 2:return g=t.sent(),[4,o(n,{text:String(g)})];case 3:return t.sent(),[3,4];case 4:return[2]}}))}))}(u)})),o(n,{text:"init - "+l+" - "+r})}()})();