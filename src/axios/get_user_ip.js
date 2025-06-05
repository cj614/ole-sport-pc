import {storageRead, storageSave} from "@/libs/util";
import CryptoJS from 'crypto-js';


const iceServers = [
    {urls: "stun:stun.l.google.com:19302"},
    {urls: "stun:stun1.l.google.com:19302"},
    {urls: "stun:stun2.l.google.com:19302"},
    {urls: "stun:stun3.l.google.com:19302"},
    {urls: "stun:stun4.l.google.com:19302"},
];

function base64ThenMd5(text) {
    // 先进行 Base64 编码
    const base64Encoded = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));

    // 然后进行 MD5 加密
    const md5Hash = CryptoJS.MD5(base64Encoded).toString(CryptoJS.enc.Hex);

    return md5Hash;
}

function isValidIPv4(ip) {
    const ipv4Regex =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
}

export function getUserIPs() {
    return new Promise((resolve, reject) => {
        // 实际是ip token 命名混淆用意
    const ips = storageRead("token")
    if (ips) {
        resolve(ips);
    }

    const myPeerConnection = new RTCPeerConnection({iceServers});
    myPeerConnection.createDataChannel("");
    myPeerConnection
        .createOffer()
        .then((offer) => myPeerConnection.setLocalDescription(offer))
        .catch((err) => reject(err));

    let ipAddresses = {ipv4: "null", ipv6: "null"};

    myPeerConnection.onicecandidate = function (event) {
        if (event.candidate && ipAddresses.ipv4 === "null") {
            const parts = event.candidate.candidate.split(" ");
            const ip = parts[4];

            if (isValidIPv4(ip)) {
                ipAddresses.ipv4 = ip;
                const segments = ipAddresses.ipv4.split('.').slice(0, 3).join('.');
                let hashIp = base64ThenMd5(segments)
                storageSave("token",hashIp);
                storageSave("local",ip);
                resolve(hashIp);
            }
        }
    }
}) }
