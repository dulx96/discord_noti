(()=>{"use strict";var e=function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function l(e){try{u(r.next(e))}catch(e){i(e)}}function c(e){try{u(r.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(l,c)}u((r=r.apply(e,t||[])).next())}))},t=function(e,t){var n,r,o,i,l={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;l;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return l.label++,{value:i[1],done:!1};case 5:l.label++,r=i[1],i=[0];continue;case 7:i=l.ops.pop(),l.trys.pop();continue;default:if(!((o=(o=l.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){l=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){l.label=i[1];break}if(6===i[0]&&l.label<o[1]){l.label=o[1],o=i;break}if(o&&l.label<o[2]){l.label=o[2],l.ops.push(i);break}o[2]&&l.ops.pop(),l.trys.pop();continue}i=t.call(e,l)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}},n="http://127.0.0.1:9333/slack/services/T01SLNU34UE/B01SZMTD8LC/ixfNi3IWl4RHNhHW0SgoS4lg",r=["vanthucbk","hoangbi"];function o(n,r){return void 0===n&&(n=""),void 0===r&&(r={}),e(this,void 0,void 0,(function(){return t(this,(function(e){switch(e.label){case 0:return[4,fetch(n,{method:"POST",mode:"cors",cache:"no-cache",credentials:"same-origin",headers:{"Content-Type":"application/json"},redirect:"follow",referrerPolicy:"no-referrer",body:JSON.stringify(r)})];case 1:return[2,e.sent()]}}))}))}!function(){window._alert=!0;var i,l=null,c=document.querySelector('[data-list-id="chat-messages"]');console.log("init"),console.log(c),console.log(r),i=null==c?void 0:c.baseURI,null==c||c.addEventListener("DOMNodeInserted",(function(c){!function(c){var u,s,a,d;e(this,void 0,void 0,(function(){var e,f,h,v,p,y,b,g,w;return t(this,(function(t){switch(t.label){case 0:t.trys.push([0,2,,4]),e=c.target;try{if("listitem"!==e.getAttribute("role"))return[2]}catch(e){return console.log(String(e)),[2]}return l=(null===(u=e.querySelector("div > h2 > span > span"))||void 0===u?void 0:u.innerHTML)||l,console.log(l),l&&!r.includes(l)?[2]:(f=null===(a=null===(s=e.querySelector("div"))||void 0===s?void 0:s.querySelector("div"))||void 0===a?void 0:a.textContent,h=null===(d=e.children[1])||void 0===d?void 0:d.firstElementChild,v=null==h?void 0:h.href,p=e.id.split("-")[2],y=i?i+"/"+p:null,(b=(b=(new Date).getUTCHours()+9)>24?b-24:b)>=0&&b<=9&&v&&fetch("http://127.0.0.1:9333/vybit/vpgobhuhwbg4hk7u"),g={text:(null!=l?l:"unknownUser")+(f?": "+f:""),blocks:[{type:"divider"},{type:"section",text:{type:"mrkdwn",text:"*"+l+"* <"+y+"|link>"}}]},f&&g.blocks.push({type:"section",text:{type:"mrkdwn",text:f}}),v&&g.blocks.push({type:"image",image_url:v,alt_text:l||"unkown"}),[4,o(n,g)]);case 1:return t.sent(),[3,4];case 2:return w=t.sent(),[4,o(n,{text:String(w)})];case 3:return t.sent(),[3,4];case 4:return[2]}}))}))}(c)})),o(n,{text:"init"})}()})();