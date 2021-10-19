export function readData (datas = []) {
    if(datas !== null && datas.length > 1){
        if(datas[0] === 221){
            global.readContentDevice = datas;
            global.readCompleteDevice = false;
        } else {
            if (global.readContentDevice !== null && global.readContentDevice.length > 0) {
                let abc = global.readContentDevice;
                global.readContentDevice = abc.concat(datas);
            }
        }
        if (global.readContentDevice[0] === 221 && global.readContentDevice[global.readContentDevice.length - 1] === 119 && global.readContentDevice.length === global.readContentDevice[3] + 7) {
            global.readCompleteDevice = true;
        }
    }
}