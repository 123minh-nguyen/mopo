import Base64 from './Base64'
import NetworkUtils from '../utils/NetworkUtils'
import {Alert} from 'react-native'

export const convertMacBleIOS = (strValue) => {
    if(strValue !== null){
        strValue = Base64.atob(strValue)
        var byteArray = [];
        for (var i = 0; i < strValue.length; ++i) {
            byteArray.push(strValue.charCodeAt(i));
        }
        strValue = '';
        byteArray.forEach(function(byte) {
            strValue += ('0' + (byte & 0xFF).toString(16)).slice(-2).toUpperCase() + ':';
        });

        return strValue.substring(strValue.length - 18, strValue.length-1);
    }
    return null
}

export function addArray(data = [], newData = []){
    return data.concat(newData);
}

export function byteArraytoHexString (byteArray) {
    if(byteArray !== null){
        var s = '';
        byteArray.forEach(function(byte) {
            s += ('0' + (byte & 0xFF).toString(16)).slice(-2) + ' ';
        });
        return s.substring(0, s.length-1);
    }
    return "";
}

export function chartoHexString (charCode) {
    var s = '';
    for(i = 0; i < charCode.length; i++){
        s += charCode.charCodeAt(i) + ' '
    }
    return s.substring(0, s.length-1);
}

export function byteArrayValueResponse (strValue) {
    return new Promise(async (resolve, reject) => {
        try{
            if(strValue !== null && strValue.length > 0){
                strValue = Base64Decode(strValue);
                resolve(toUTF8Array(strValue));
            }
        } catch (e){
            reject(e);
        }
    })
}

function convert(input) {
    value = "";
    for (var i = 0; i < input.length; i++) {
        value += input[i].charCodeAt(0).toString(2) + " ";
    }
    return value;
}

function Base64Decode(str) {
    if (!(/^[a-z0-9+/]+={0,2}$/i.test(str)) || str.length%4 != 0) throw Error('Not base64 string');

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, d=[];

    for (var c=0; c<str.length; c+=4) {  // unpack four hexets into three octets
        h1 = b64.indexOf(str.charAt(c));
        h2 = b64.indexOf(str.charAt(c+1));
        h3 = b64.indexOf(str.charAt(c+2));
        h4 = b64.indexOf(str.charAt(c+3));

        bits = h1<<18 | h2<<12 | h3<<6 | h4;

        o1 = bits>>>16 & 0xff;
        o2 = bits>>>8 & 0xff;
        o3 = bits & 0xff;

        d[c/4] = String.fromCharCode(o1, o2, o3);
        // check for padding
        if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
        if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
    }
    str = d.join('');
    return str;
}

function toUTF8Array(str) {
    var out = [], p = 0;
    for (var i = 0; i < str.length; i++) {
        out[p++] = str.charCodeAt(i);
    }
    return out;
};

// function stringToBytes(str){
//     let reader = new FileReader();
//     let done = () => {};

//     reader.onload = event =>
//     {
//         done(new Uint8Array(event.target.result), str);
//     };
//     reader.readAsArrayBuffer(new Blob([str], { type: "application/octet-stream" }));

//     return { done: callback => { done = callback; } };
// }

export function byteArrayValueSend(byteArray) {
    return new Promise(async (resolve, reject) => {
        try{
            if(byteArray !== null){
                var bytesView = new Uint8Array(byteArray);
                resolve(Base64.btoa(String.fromCharCode.apply(null, bytesView)));
            }
        } catch (e){
            reject(e);
        }
    })
}

export function roundNumber(num, scale) {
    if(!("" + num).includes("e")) {
        return +(Math.round(num + "e+" + scale)  + "e-" + scale);
    } else {
        let arr = ("" + num).split("e");
        var sig = ""
        if(+arr[1] + scale > 0) {
            sig = "+";
        }
        return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
}

const formatStringNumber = (val, al) => {
    if((val + "").length < al){
        var str = '';
        for(i = 0; i < (al - (val + "").length); i++){
            str += "0";
        }
        return str + val + "";
    } else {
        return val + "";
    }
}

export function intStrToBytes(str){
    retBytes = [];
    for (i = 0; i < str.length; i++) {
        retBytes[i] = parseInt(str.substring(i, i + 1), 16);
    }
    return retBytes;
}

export function getDate(){
    let date_time = new Date();
    return formatStringNumber(date_time.getFullYear(), 4) + "/" + formatStringNumber((date_time.getMonth() + 1), 2) + "/" + formatStringNumber(date_time.getDate(), 2) + " " + formatStringNumber(date_time.getHours(), 2) + ":" + formatStringNumber(date_time.getMinutes(), 2) + ":" + formatStringNumber(date_time.getSeconds(), 2)
}

export function getNumberToDate(date){
    let old_day = new Date(date);
    let to_day = new Date();
    return Math.trunc(((((to_day - old_day)/1000)/60)/60)/24);
}

export function getIdByDateTime(){
    let date_time = new Date();
    return formatStringNumber(date_time.getFullYear(), 4) + "" + formatStringNumber((date_time.getMonth() + 1), 2) + "" + formatStringNumber(date_time.getDate(), 2) + "" + formatStringNumber(date_time.getHours(), 2) + "" + formatStringNumber(date_time.getMinutes(), 2) + "" + formatStringNumber(date_time.getSeconds(), 2) 
}

//////////////////////////
const MIN_VALUE = 0x80000000;
const digits = "0123456789ABCDEF";
const INIT_CRC32 = 0xAFC01B29;
export function getPasswordFromMAC(mac){
    macs = mac.replace(/:/g, "").toUpperCase();
    macStr = "" + getDecimal(hexStr2Bytes(macs));
    console.log('' + macStr.substring(macStr.length - 6))
    return macStr.substring(macStr.length - 6);
}

export function getDecimal(byteData){
    hex = crc32Compute_U(byteData, 6, INIT_CRC32).toString(16).toUpperCase();
    val = 0;
    for (i = 0; i < hex.length; i++)
    {
        c = hex.charAt(i);
        d = digits.indexOf(c);
        val = 16*val + d;
    }
    return val;
}

export function crc32Compute_U(pData_U, size_U, pCrc_U) {
    var crc_U = ~pCrc_U;
    for(i_U = 0; compareUnsigned(i_U, size_U) < 0; i_U++) {
        crc_U = crc_U ^ toUnsignedInt(pData_U[i_U]);
        for(j_U = 8; compareUnsigned(j_U, 0) > 0; j_U--) {
            crc_U = crc_U >>> 1 ^ 0xEDB88320 & ((crc_U & 1) != 0 ? 0xFFFFFFFF : 0);
        }
    }
    return ~crc_U;
}

export function compareUnsigned(x, y){
    return compare(x + MIN_VALUE, y + MIN_VALUE);
}

export function compare(x, y){
    return (x < y) ? -1 : ((x == y) ? 0 : 1);
}

export function toUnsignedInt(val){
    return val & 0xff;
}

const hexStr2Bytes = (src) => {
    src = src.toUpperCase();
    iLen = src.length / 2;
    ret = [];
    for (i = 0; i < iLen; i++) {
        m = (i * 2) + 1;
        ret[i] = (parseInt(src.substring(i * 2, m) + src.substring(m, m + 1), 16) & 255);
    }
    return ret;
}

export function checkNetwork(){
    if((new NetworkUtils()).isNetworkAvailable()){
        return true;
    } else {
        Alert.alert(
            "",
            "Please check your network.",
            [
              { text: "OK", onPress: () => console.log("Cancel Pressed")}
            ],
            { cancelable: false }
        );
        return false;
    }
}