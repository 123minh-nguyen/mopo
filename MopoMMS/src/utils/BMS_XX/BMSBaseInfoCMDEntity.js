import {addArray} from '../utilConfig'
import {roundNumber} from '../utilConfig'

export const DEFAULT_DELIMITER = "-";
export const protectionTypes = [ 
    "Cell over voltage", "Cell under voltage", "Pack over voltage",
    "Pack under voltage", "Charging over temperature", "Charging low temperature",
    "Discharge over temperature", "Discharge low temperature", "Charging over current",
    "Discharge over current", "Short circuit", "IC front-end error",
    "Software locking MOS", "Charge timeout Close"];

export function formatParams(datas) {
    return new Promise(async (resolve, reject) => {
        try{
            var content = getData(datas.byteArray)
            if(datas.byteArray[3] == content.length){
                var ntcTempList = [];
                for (var i = 0; i < (content[22] & 255); i++) {
                    if (content.length - 1 >= ((i * 2) + 22) + 2) {
                        ntcTempList = addArray(ntcTempList, content[((i * 2) + 22) + 1])
                        ntcTempList = addArray(ntcTempList, content[((i * 2) + 22) + 2])
                    }
                }
                let current = ((content[2] << 8) + (content[3] & 255));
                console.log('current: ' + current);
                if(current > 32767){
                    current = current - 65535;
                }
                resolve({ mac: datas.mac, data: {
                    totalVoltage: roundNumber(((content[0] << 8) + (content[1] & 255)) / 100, 1),
                    rsoc: content[19] & 255,
                    current: roundNumber(current / 100, 1),
                    remaindPower: ((content[4] << 8) + (content[5] & 255)) / 100,
                    nominalPower: ((content[6] << 8) + (content[7] & 255)) / 100,
                    cycleTimes: (content[8] << 8) + (content[9] & 255),
                    tempList: formatTemp(ntcTempList),
                    charSwithOnOff: ((content[20] & 1) == 1) ? true : false,
                    disSwithOnOff: ((content[20] & 2) == 2) ? true : false,
                    protectionStateList: formatProtectionState([content[16], content[17]]),
                }})
            }
        } catch (e){
            reject(e);
        }
    })
}

export function getData(datas = []) {
    return datas.slice(4, datas.length - 3);
}

export function formatTemp(tempByteList) {
    var data = [];
    for (var i = 0; i < tempByteList.length; i += 2) {
        let l = tempByteList[i + 1] & 255;
        data = addArray(data, ["Temp" + DEFAULT_DELIMITER + (data.length + 1), (((((tempByteList[i] & 255) * 256) + l) - 2731)) / 10.0]);
    }
    return data;
}

export function formatProtectionState(protectionState = []) {
    var protectionStateList = [];
    var protectionStateIndex = -1;
    var b = 0;
    var index = 0;
    var isProtect = false;
    for (i = 0; i < protectionTypes.length; i++) {
        b = 0;
        index = 0;
        isProtect = false;
        if (i < 8) {
            b = protectionState[1];
            index = i;
        } else {
            b = protectionState[0];
            index = i - 8;
        }
        if ((((b & 255) >> index) & 1) == 1) {
            isProtect = true;
            protectionStateIndex = i;
        }
        protectionStateList = addArray(protectionStateList, {protectionTypes: protectionTypes[i], isProtect: isProtect});
    }
    return protectionStateList;
}

