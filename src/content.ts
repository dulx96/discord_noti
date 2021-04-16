// This file is injected as a content script

import  {MessasgeType} from './models'
declare global {
    interface Window { _alert: any; }
}

// Read a url from the environment variables
const SLACK_WEBHOOK_URL = "http://127.0.0.1:9333/slack/services/T01SLNU34UE/B01TJ85TH9D/EJEopby1XxXCY5v7utjki9II";
const VIBYT_WEBHOOK_URL = "http://127.0.0.1:9333/vybit/vpgobhuhwbg4hk7u";

// Initialize

// const DAY_TIME_URL = "https://discord.com/api/webhooks/826141168877961217/poya_Ecu8ahMm1pAMYupJN82iyVr6dhbMDUVGw5yu8hC36NspTIeIiYN1UR69toH4w2n"
// const VIP: string[] = ["trinhlinh3712", "Lê Xuân Du"]
const VIP: string[] = ["vanthucbk","hoangbi"]
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
    return response; // parses JSON response into native JavaScript objects
  }
function watchNewMessage():void {
    window._alert = true
    let lastUser: string | null = null
    let baseURI: string | undefined = undefined
    let prevLastMessageEl: Element | null = null
    async function NewMessageProcess(node: Event):Promise<void>  {
        try {
            const chatBox = document.querySelector('[data-list-id="chat-messages"]')
            const messageElList = chatBox!.querySelectorAll('[role="listitem"]')
            const lastMessageEl = messageElList[messageElList.length - 1]
            if(prevLastMessageEl === lastMessageEl) {
                return
            }
            prevLastMessageEl = lastMessageEl

            // * scroll 
            lastMessageEl.scrollIntoView({ behavior: "smooth", block: "end" })
            chatBox!.firstElementChild?.remove()

            
            // * get lastuser sent message
            lastUser = lastMessageEl.querySelector("div > h2 > span > span")?.innerHTML || lastUser
            // console.log(lastUser)
            // * filter if message from VIP
            if(lastUser && !VIP.includes(lastUser)) 
                return
            // * get message 
            const message:string | null | undefined = lastMessageEl.querySelector("div")?.querySelector("div")?.textContent
            const linkElement:HTMLLinkElement | undefined = lastMessageEl.children[1]?.firstElementChild as HTMLLinkElement
            const imageURL: string | undefined = linkElement?.href

            const messageId:string = lastMessageEl.id.split("-")[2]
            const messageURL: string | null = baseURI ? baseURI + '/'+  messageId : null
            // * send message
            // * alert important
            let cur_hour_tz:number = new Date().getUTCHours() + 9
            cur_hour_tz = cur_hour_tz > 24 ? cur_hour_tz-24 : cur_hour_tz
            
            if(cur_hour_tz >= 0 && cur_hour_tz <= 9 && imageURL) {
                fetch(VIBYT_WEBHOOK_URL);
            }
            // * day time
            // postData(DAY_TIME_URL, {username: lastUser, content: message, embeds: [{description:`[link](${messageURL})`, image: {url: imageURL}}]})
            let slack_data:any = {
                text: (lastUser?? 'unknownUser') + (message ? ': ' + message : ''),
                blocks: [
                    {
                        "type": "divider"
                    },
                    {
                        type: "section",
                        text: {
                            type: "mrkdwn",
                            text: `*${lastUser}* <${messageURL}|link>`
                        }
                    },
                
                ]
            }
            if(message) {
                slack_data.blocks.push( {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: message
                    }
                })
            }
            if(imageURL) {
                slack_data.blocks.push({
                    type: "image",
                    image_url: imageURL,
                    alt_text: lastUser || 'unkown'
                })
            }
            await postData(SLACK_WEBHOOK_URL, slack_data)
        } catch(error) {
            await postData(SLACK_WEBHOOK_URL, {text: String(error)})
        }
    }
    const chatBox: HTMLDivElement | null = document.querySelector('[data-list-id="chat-messages"]');
    if(chatBox===null) {
        postData(SLACK_WEBHOOK_URL, {text: "chat box not detected - " + baseURI})  
    }
    baseURI =  chatBox?.baseURI
    chatBox?.addEventListener('DOMNodeInserted', (e:Event) => {NewMessageProcess(e)} )
    postData(SLACK_WEBHOOK_URL, {text: "init - " + baseURI + ' - ' + VIP})
}

watchNewMessage()