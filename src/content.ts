// This file is injected as a content script

import  {MessasgeType} from './models'

const DAY_TIME_URL = "https://discord.com/api/webhooks/826141168877961217/poya_Ecu8ahMm1pAMYupJN82iyVr6dhbMDUVGw5yu8hC36NspTIeIiYN1UR69toH4w2n"

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }
function watchNewMessage():void {
    let lastUser: string | null = null
    let baseURI: string | undefined = undefined
    function NewMessageProcess(node: Event):void  {
        const div = node.target as HTMLDivElement
        if(div.getAttribute("role") !== "listitem") 
            return
        // * get lastuser sent message
        lastUser = div.querySelector("div > h2 > span > span")?.innerHTML || lastUser
        console.log(lastUser)
        // * filter if message from VIP
        if(lastUser && !["vanthucbk","hoangbi"].includes(lastUser)) 
            return
        // * get message 
        const message:string | null | undefined = div.querySelector("div")?.querySelector("div")?.textContent
        const linkElement:HTMLLinkElement | undefined = div.children[1]?.firstElementChild as HTMLLinkElement
        const imageURL: string | undefined = linkElement?.href

        const messageId:string = div.id.split("-")[2]
        const messageURL: string | null = baseURI ? baseURI + '/'+  messageId : null
        // * send message
        const cur_hour:number = new Date().getHours()
        console.log(cur_hour)
        if(cur_hour >= 0 && cur_hour <= 9 && imageURL) {
            window.open("https://www.youtube.com/watch?v=rwCJvSKzQkc");
        }
        // * day time
        postData(DAY_TIME_URL, {username: lastUser, content: message, embeds: [{description:`[link](${messageURL})`, image: {url: imageURL}}]})
        // * emergency 
    }
    const chatBox: HTMLDivElement | null = document.querySelector('[data-list-id="chat-messages"]');
    console.log(chatBox)
    baseURI =  chatBox?.baseURI
    chatBox?.addEventListener('DOMNodeInserted', (e: Event) => {
        NewMessageProcess(e)
    })
}

watchNewMessage()
// chrome.runtime.onMessage.addListener((message: MessasgeType) => {
//     console.log('receive message')
//     switch (message.type) {
//         case "START":
//             watchNewMessage()
//             break;
//         default:
//             chrome.runtime.sendMessage(message)
//             break
//     }
// })