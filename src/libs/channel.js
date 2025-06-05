import Adjust from "@adjustcom/adjust-web-sdk";
import CONFIG from "../config/config";
import {getChannel} from "../api/app";
import {storageRead, storageSave} from "@/libs/util";

// 初始化渠道
export default async function InitChannel(channelId) {
    let channel = getChannelData();
    console.log("channelId----", channelId);
    if (Object.keys(channel).length === 0) {
        const {Data} = await getChannel(channelId)
        channel = Data;
        storageSave('channel', JSON.stringify(channel));
    }
    if (channel && channel.pixel_token) {
        loadFacebookPixelScript(channel.pixel_token);
    }

    if (channel && channel.adjust_token) {
        // Adjust web sdk 初始化
        Adjust.initSdk({
            appToken: channel.adjust_token,
            // environment:
            environment: CONFIG.ENV === 'DEVELOP' ? 'sandbox' : 'production',
            logLevel: "verbose",
        });
    }
}


function loadFacebookPixelScript(pixelId) {
    if (!window.fbq) {
        // 如果 fbq 已经存在，说明 Facebook Pixel 已经初始化，无需重复初始化
        (function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod
                    ? n.callMethod.apply(n, arguments)
                    : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = "2.0";
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

        // Facebook Pixel 初始化和跟踪页面视图事件
        window.fbq("init", pixelId);  // 替换为你的 Pixel ID
        window.fbq("track", "PageView");
    }
}


// 提供外部访问 channel 数据的方法
export function getChannelData() {
    const data = storageRead("channel")
    if (data) {
        return JSON.parse(data)
    }
    return {};
}

export function trackEvent(eventName) {
    if (window.fbq) {
        window.fbq("track", eventName);
    }
    if (getChannelData().adjust_event_token) {
        const eventToken = getChannelData().adjust_event_token[eventName];
        if (eventToken) {
            Adjust.trackEvent({
                eventToken: eventToken
            })
        }
    }
}

export function getAdjustWebUuid() {
    return Adjust.getWebUUID()
}