// This file is injected as a content script

import  {MessasgeType} from './models'
declare global {
    interface Window { _alert: any; INIT_NOTI: any }
}

// Read a url from the environment variables
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL!
const VIBYT_WEBHOOK_URL = process.env.VIBYT_WEBHOOK_URL!
let CRITICAL_TIME_START: number | string = process.env.CRITICAL_TIME_START!
let CRITICAL_TIME_END:number | string = process.env.CRITICAL_TIME_END!

// Initialize

const VIP: string[] =  process.env.VIPS!.split(',')
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
    CRITICAL_TIME_START = parseInt(<string>CRITICAL_TIME_START)
    CRITICAL_TIME_END = parseInt(<string>CRITICAL_TIME_END)
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
            // if(messageElList.length > 0) {
            //     messageElList[1].remove()

            // }            
            // * get lastuser sent message
            lastUser = lastMessageEl.querySelector("div > h2 > span > span")?.innerHTML || lastUser
            // console.log(lastUser)
            // * filter if message from VIP
            if(lastUser && !VIP.includes(lastUser)) 
                return
            // * get message 
            const message:string | null | undefined = lastMessageEl.querySelector("div")?.querySelector("div")?.textContent
            
            // * detect if an image has sent 
            const wrapImageElement: HTMLAnchorElement | null = lastMessageEl.querySelector('a')
            // * dectect message is load, now not need yet, anchar is enough
            // let linkElement:HTMLAnchorElement | null = null
            // if(wrapImageElement !== null) {
            //     const checkTime =  10
            //     let checkedTime = 0
            //     const timeSleepPerCheck = 500
            //     while(linkElement !== null) {
            //         if (wrapImageElement.querySelector('img')) {
            //             linkElement = wrapImageElement
            //             break
            //         }
            //         checkedTime++
            //         if(checkedTime > checkTime) {
            //             break
            //         }
            //         await new Promise(r => setTimeout(r,timeSleepPerCheck))
            //     }
            // }
            const imageURL: string | undefined = wrapImageElement?.href

            const messageId:string = lastMessageEl.id.split("-")[2]
            const messageURL: string | null = baseURI ? baseURI + '/'+  messageId : null
            // * send message
            // * alert important
            let cur_hour_utc:number = new Date().getUTCHours()
            const is_critical_time: boolean = (CRITICAL_TIME_START <= CRITICAL_TIME_END) ? (cur_hour_utc >=CRITICAL_TIME_START && cur_hour_utc <=CRITICAL_TIME_END) : ((cur_hour_utc <=24 && cur_hour_utc >= CRITICAL_TIME_START) || (cur_hour_utc >=0 && cur_hour_utc <=CRITICAL_TIME_END))
            if(is_critical_time && imageURL) {
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
    if(window.INIT_NOTI) {
        postData(SLACK_WEBHOOK_URL, {text: "init - " + baseURI + ' - ' + VIP + ' - ' + 'CRITICAL_TIME' + ` ${CRITICAL_TIME_START}:${CRITICAL_TIME_END}`})
    }
}

watchNewMessage()
