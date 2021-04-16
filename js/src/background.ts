// This file is ran as a background script
// chrome.webRequest.onResponseStarted()
import  {MessasgeType} from './models'

chrome.runtime.onMessage.addListener((message: MessasgeType) => {
    switch (message.type) {
        case "START":
            console.log('send message')
            chrome.runtime.sendMessage(message)
            break;
        default:
            chrome.runtime.sendMessage(message)
            break
    }
})