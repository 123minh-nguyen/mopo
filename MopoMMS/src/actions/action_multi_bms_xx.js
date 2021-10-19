import {byteArrayValueResponse, byteArrayValueSend, byteArraytoHexString, convertMacBleIOS, getPasswordFromMAC, roundNumber} from '../utils/utilConfig'
import {readData} from '../utils/BMS_XX/BluetoothLeEntityBMS'
import {formatParams} from '../utils/BMS_XX/BMSBaseInfoCMDEntity'
import {LogBox, Platform, Alert} from 'react-native'
import ValueStrings from '../utils/Strings'
import BMSPasswdPairCMDEntity from '../utils/BMS_XX/BMSPasswdPairCMDEntity'
import {status_ble, add_data_convert} from './actions'
import {
    setStyleAlerAction, 
    setCloseAlerAction, 
    addListNotify, 
    setMsgOld, 
    setListPackStyle, 
    clearListPackStyle, 
    updateSwithOnOff, 
    setProtectPack, 
    updateListNotify,
    set_page_screen,
    checkSwithOnOff,
} from './action_home'

export const addListMac = (mac) => ({
    type: "ADD_LIST_MAC",
    mac: mac
})

export const claerListMac = () => ({
    type: "CLEAR_LIST_MAC",
})

export const addListItem = (device) => ({
    type: "ADD_LIST_ITEM",
    device: device
})
  
export const claerListItem = () => ({
    type: "CLEAR_LIST_ITEM",
})

export const addDeviceConnect = (device) => ({
    type: "ADD_DEVICE_CONNECTED",
    device: device
})

export const claerDeviceConnect = () => ({
    type: "CLEAR_DEVICE_CONNECTED",
})

// Byte Array
export const addDataList = (data) => ({
    type: "ADD_DATA_LIST",
    data: data
})

export const updateDataList = (dataList) => ({
    type: "UPDATE_DATA_LIST",
    dataList: dataList
})

export const claerDataList = () => ({
    type: "CLEAR_DATA_LIST",
})

// Data Convert
export const addListDataConver = (dataConvert) => ({
    type: "ADD_LIST_DATA_CONVERT",
    dataConvert: dataConvert
})

export const updateListDataConver = (listDataConvert) => ({
    type: "UPDATE_LIST_DATA_CONVERT",
    listDataConvert: listDataConvert
})

export const claerListDataConver = () => ({
    type: "CLEAR_LIST_DATA_CONVERT",
})

// add total
export const addTotal = (total) => ({
    type: "ADD_TOTAL",
    total: total
})

export const claerTotal = () => ({
    type: "CLEAR_TOTAL"
})

export const startScan = () => {
    return (dispatch, getState, DeviceManager) => {
        dispatch(status_ble(1));
        dispatch(scan());
    };
};

export const stopScan = () => {
    return (dispatch, getState, DeviceManager) => {
        DeviceManager.stopDeviceScan()
        if(getState().MultiBMS.listDeviceScanning.length < getState().MultiBMS.listMac.length){
            // show message aler not found enough device
            dispatch(setStyleAlerAction(ValueStrings.toast_maketext, ValueStrings.can_not_connect_device));
            dispatch(autoDisconnect());
            dispatch(status_ble(0));
        }
    };
};

export const clearListItem = () => {
    return (dispatch, getState, DeviceManager) => {
        dispatch(claerListItem());
    };
}

const checkItem = (listData, val) => {
    return listData.some(item => val.id === item.id);
}

const checkMacItem = (listData, val) => {
    return listData.some(item => val === item);
}

const showAlert = (msg) => {
    Alert.alert(
        "",
        msg,
        [
            { text: "OK", onPress: () => console.log("Cancel Pressed")}
        ],
        { cancelable: false }
    );
}

export const scan = () => {
    return async (dispatch, getState, DeviceManager) => {
        let listMac = getState().MultiBMS.listMac;
        dispatch(setStyleAlerAction(ValueStrings.connect_device, ValueStrings.connecting));
        dispatch(status_ble(1));
        await DeviceManager.startDeviceScan(['0000ff00-0000-1000-8000-00805f9b34fb', '0000ffe0-0000-1000-8000-00805f9b34fb'], null, (error, device) => {
            if (error) {
                DeviceManager.stopDeviceScan();
                dispatch(claerListMac()); 
                if(("" + error).indexOf('BluetoothLE is powered off') > 0){
                    if(Platform.OS === 'ios'){
                        showAlert('Please turn on your Bluetooth.');
                    } else {
                        showAlert('Please turn on your Bluetooth.\nAnd make sure your "GPS" is turned on');
                    }
                }
            }

            if (device !== null && (device.id != undefined || device.id != null)) {
                if(Platform.OS === 'ios'){
                    if(checkMacItem(listMac, convertMacBleIOS(device.manufacturerData)) && !checkItem(getState().MultiBMS.listDeviceScanning, device)){
                        if(device.localName != null){
                            console.log("Log cycle scan device: " + convertMacBleIOS(device.manufacturerData) + "/ name: " + device.localName);
                            dispatch(addListItem(device));
                        }
                    }
                } else {
                    if(checkMacItem(listMac, device.id) && !checkItem(getState().MultiBMS.listDeviceScanning, device)){
                        if(device.name != null){
                            console.log("Log cycle scan device: " + device.id + "/ name: " + device.name);
                            dispatch(addListItem(device));
                        }
                    }
                }
                
                if(getState().MultiBMS.listDeviceScanning.length === listMac.length){
                    DeviceManager.stopDeviceScan();
                    dispatch(autoConnectDevice());
                }
            }
        })
    };
};

export function autoConnectDevice(){
    return (dispatch, getState, DeviceManager) => {
        dispatch(connectDevice(getState().MultiBMS.listDeviceScanning[getState().MultiBMS.deviceConnected.length]));
    }
}

export function connectDevice (deviceConnect) {
    return async (dispatch, getState, DeviceManager) => {
        deviceConnect.connect()
        .then((device) => {
            return deviceConnect.discoverAllServicesAndCharacteristics();
        })
        .then((device) => {
            dispatch(status_ble(3));
            dispatch(addDeviceConnect(deviceConnect));
            dispatch(setNotify(deviceConnect.id));
            if(getState().MultiBMS.deviceConnected.length < getState().MultiBMS.listDeviceScanning.length){
                dispatch(autoConnectDevice());
            } else {
                dispatch(checkPassPackPin());
            }
        })
        .catch((error) => {
            console.log("Log cycle error connect ", error.message);
            dispatch(autoConnectDevice());
        });
    }
}

export function autoDisconnect(){
    return (dispatch, getState, DeviceManager) => {
        if(getState().MultiBMS.deviceConnected.length > 0){
            let listDevice = getState().MultiBMS.deviceConnected;
            listDevice.forEach(item => {
                DeviceManager.cancelDeviceConnection(item.id)
                .then((device) => {
                    console.log("Log cycle disconnect device: ", device.id);
                    dispatch(status_ble(0));
                })
            });

            setTimeout(() => {
                dispatch(claerListItem());
                dispatch(claerListMac()); 
                dispatch(claerDeviceConnect());
                dispatch(claerDataList());
                dispatch(claerListDataConver());
                dispatch(claerTotal());
                dispatch(clearListPackStyle());
                dispatch(setMsgOld(''));
            }, 1000);
        }
    }
}

export function setNotify (macDevice) {
    return (dispatch, getState, DeviceManager) => {
        var checkPassPackPin = 0;
        try {
            DeviceManager.monitorCharacteristicForDevice(macDevice,'0000ff00-0000-1000-8000-00805f9b34fb', '0000ff01-0000-1000-8000-00805f9b34fb', (error, characteristic) => {
                if (error) {
                    console.log("Log Cycle set notify error.message: " + error.message);
                    return;
                }

                byteArrayValueResponse(characteristic.value, characteristic.deviceID).then((response_data, id) => {
                    console.log("Log response: " + characteristic.deviceID + " ==>> "+ JSON.stringify(response_data));
                    if(response_data[0] == 221 && response_data[response_data.length - 1] == 119){
                        if(response_data[1] == 6){
                            if(response_data[2] == 0){
                                checkPassPackPin++;
                                dispatch(status_ble(4));
                                dispatch(setCloseAlerAction());
                                dispatch(set_page_screen(0));
                            } else if (response_data[2] == 128){
                                dispatch(setStyleAlerAction(ValueStrings.warning, "Can't connect device.\nPassword default for BMS is wrong."));
                                dispatch(autoDisconnect());
                            }
                        }
                    } else {
                        if(checkPassPackPin > 0){
                            dispatch(upDataList(response_data, characteristic.deviceID));
                        }
                    }
                });
            });
        } catch (error) {
            console.log("Log Cycle set notify error: " + error);
        }  
    }
}

export const checkPassPackPin = () => {
    return (dispatch, getState, DeviceManager) => {
        let bmsPasswdPairCMDEntity = new BMSPasswdPairCMDEntity();
        let listDevice = getState().MultiBMS.listDeviceScanning;
        if(listDevice.length > 0){
            let my = setInterval(() => {
                listDevice.forEach(item => {
                    setTimeout(function() { 
                        bmsPasswdPairCMDEntity.setPasswd(Platform.OS === 'ios' ? getPasswordFromMAC(convertMacBleIOS(item.manufacturerData)) : getPasswordFromMAC(item.id));
                        dispatch(sendData(item.id, bmsPasswdPairCMDEntity.getCmdApi()));
                    }, 200);
                });
            }, 1000);
            setTimeout(() => {clearInterval(my)}, 3300);
        }
    }
}

export const sendData = (macAddress, byteArray) => {
    return (dispatch, getState, DeviceManager) => {
        byteArrayValueSend(byteArray).then(byteValue => {
            DeviceManager.writeCharacteristicWithResponseForDevice(
                macAddress,
                '0000ff00-0000-1000-8000-00805f9b34fb',
                '0000ff02-0000-1000-8000-00805f9b34fb',
                byteValue
            ).then((characteristic) => {
                console.log("Log cycle write: " + characteristic.deviceID + " ==> " + byteArraytoHexString(byteArray));
            }).catch((error) => {
                console.log("Log Cycle characteristic error: " + error);
                if(getState().Ble.statusBle === 0){
                    dispatch(claerListItem());
                    dispatch(claerListMac()); 
                    dispatch(claerDeviceConnect());
                    dispatch(claerDataList());
                    dispatch(claerListDataConver());
                    dispatch(claerTotal());
                    dispatch(clearListPackStyle());
                    dispatch(setMsgOld(''));
                }
            })
        });
    }
}

export const processDataInterval = () =>{
    return (dispatch, getState) => {
        let listDevice = getState().MultiBMS.listDeviceScanning;
        let dataList = getState().MultiBMS.dataList;
        if(listDevice.length > 0 && getState().MultiBMS.deviceConnected.length > 0 && listDevice.length == getState().MultiBMS.deviceConnected.length){
            
            listDevice.forEach(item => {
                setTimeout(function() { dispatch(sendData(item.id, [-35,-91,3,1,0,-1,-4,119]));}, 200);
            });

            if(dataList.length > 0 && dataList.length == listDevice.length){
                dispatch(convertData(dataList));
            }
        }
    }
}

export const checkItemInData = (listData, mac) => {
    return listData.some(item => item.mac === mac);
}

export const upDataList = (byteArray, id) => {
    return (dispatch, getState) => {
        let dataList = getState().MultiBMS.dataList;
        if(dataList.some(item => item.mac === id)){
            let index = dataList.findIndex(el => el.mac === id);
            if(byteArray[0] === 221){
                dataList[index] = {...dataList[index], byteArray: byteArray};
            } else {
                dataList[index] = {...dataList[index], byteArray: dataList[index].byteArray.concat(byteArray)};
            }
            dispatch(updateDataList(dataList));
        } else if(byteArray[0] === 221) {
            dispatch(addDataList({mac: id, byteArray: byteArray}));
        }
    }
}

export const checkGetDataSuccess = () => {
    return (dispatch, getState) => {
        setTimeout(() => {
            if(getState().MultiBMS.dataList.length < getState().MultiBMS.itemList.length){
                dispatch(claerDeviceConnect());
                dispatch(claerDataList());
                dispatch(claerListDataConver());
                dispatch(claerTotal());
                dispatch(clearListPackStyle());
            }
        }, getState().MultiBMS.itemList.length * 5000);
    }
}

export const convertData = (dataList) => {
    return (dispatch, getState) => {
        dataList.forEach(item => {
            formatParams(item).then(value => {
                dispatch(upListDataConvert(value.data, value.mac))
            })
        })
    }
}

export const upListDataConvert = (data, macAddress) => {
    return (dispatch, getState) => {
        if(data != null && data != undefined){
            let dataListConvert = getState().MultiBMS.listDataConvert;
            if(checkItemInData(dataListConvert, macAddress)){
                let index = dataListConvert.findIndex(el => el.mac === macAddress);
                dataListConvert[index] = {...dataListConvert[index], data: data};
                dispatch(updateListDataConver(dataListConvert));
            } else {
                dispatch(addListDataConver({mac: macAddress, data: data}));
            }
            
            if(dataListConvert.length > 0){
                dispatch(calTotal(dataListConvert));
            }
        }
    }
}

export const checkDataPackPin = (dataListConvert) => {
    return (dispatch, getState) => {
        var vol_max = 0;
        var vol_min = 1000;
        var vol_difference_potect = false;
        var under_voltage = false;
        var over_or_under_tem = false;
        var system_error_auto_return = false;
        var ic_font_end_error = false;

        try {
            if(dataListConvert !== null && dataListConvert.length > 0){
                dataListConvert.forEach(el => {
                    if(vol_max < el.data.totalVoltage) { vol_max = el.data.totalVoltage;}
                    if(vol_min > el.data.totalVoltage) { vol_min = el.data.totalVoltage;}
                    el.data.protectionStateList.forEach(itemProtect => {
                        if(itemProtect.isProtect === true){
                            if(itemProtect.protectionTypes === 'Cell under voltage'){ under_voltage = true;}
                            if(itemProtect.protectionTypes === 'Pack under voltage'){ under_voltage = true;}
                
                            if(itemProtect.protectionTypes === 'Charging over temperature'){ over_or_under_tem = true;}
                            if(itemProtect.protectionTypes === 'Charging low temperature'){ over_or_under_tem = true;}
                            if(itemProtect.protectionTypes === 'Discharge over temperature'){ over_or_under_tem = true;}
                            if(itemProtect.protectionTypes === 'Discharge low temperature'){ over_or_under_tem = true;}
                
                            if(itemProtect.protectionTypes === 'Charging over current'){ system_error_auto_return = true;}
                            if(itemProtect.protectionTypes === 'Discharge over current'){ system_error_auto_return = true;}
                            if(itemProtect.protectionTypes === 'Short circuit'){ system_error_auto_return = true;}
                
                            if(itemProtect.protectionTypes === 'IC front-end error'){ ic_font_end_error = true;}
                        }
                    })
                })
                if((vol_max - vol_min) > 2) {vol_difference_potect = true;}

                dispatch(setProtectPack({
                    vol_difference_potect: vol_difference_potect,
                    under_voltage: under_voltage,
                    over_or_under_tem: over_or_under_tem,
                    system_error_auto_return: system_error_auto_return,
                    ic_font_end_error: ic_font_end_error,
                }));
        
                dispatch(checkAlertProtectPack({
                    vol_difference_potect: vol_difference_potect,
                    under_voltage: under_voltage,
                    over_or_under_tem: over_or_under_tem,
                    system_error_auto_return: system_error_auto_return,
                    ic_font_end_error: ic_font_end_error,
                }));
            }
        } catch (e) { console.error(e)}
    }
}

export const checkAlertProtectPack = (protectPack) => {
    return (dispatch, getState) => {
        if(protectPack !== null){
            if(protectPack.vol_difference_potect === true) {
                if(getState().Home.msgOld !== ValueStrings.difference_voltage){
                    dispatch(setStyleAlerAction(ValueStrings.warning, ValueStrings.difference_voltage));
                }
                dispatch(setNotification(ValueStrings.difference_voltage));
            }
            else if(protectPack.under_voltage === true) {
                dispatch(setStyleAlerAction(ValueStrings.warning, ValueStrings.under_voltage_protection))
                dispatch(setNotification(ValueStrings.under_voltage_protection));
            }
            else if(protectPack.over_or_under_tem === true) {
                dispatch(setStyleAlerAction(ValueStrings.warning_question, ValueStrings.over_or_under_tem_potect))
                dispatch(setNotification(ValueStrings.over_or_under_tem_potect));
            }
            else if(protectPack.system_error_auto_return === true) {
                dispatch(setStyleAlerAction(ValueStrings.warning, ValueStrings.system_error_auto_return))
                dispatch(setNotification(ValueStrings.system_error_auto_return));
            }
            else if(protectPack.ic_font_end_error === true) {
                dispatch(setStyleAlerAction(ValueStrings.warning, ValueStrings.system_error))
                dispatch(setNotification(ValueStrings.system_error));
            }
            else {dispatch(setCloseAlerAction())}
        }
    }
}

export const setNotification = (msg) => {
    return (dispatch, getState) => {
        if(getState().Home.msgOld !== msg){
            if(msg === ValueStrings.difference_voltage){
                dispatch(addListNotify(getState().Home.accountInfo.UserID, ValueStrings.ms_difference_voltage, ValueStrings.difference_voltage))
            } else if(msg === ValueStrings.under_voltage_protection){
                dispatch(addListNotify(getState().Home.accountInfo.UserID, ValueStrings.ms_under_voltage_protection, ValueStrings.under_voltage_protection))
            } else if(msg === ValueStrings.over_or_under_tem_potect){
                dispatch(addListNotify(getState().Home.accountInfo.UserID, ValueStrings.ms_over_or_under_tem_potect, ValueStrings.over_or_under_tem_potect))
            } else if(msg === ValueStrings.system_error_auto_return){
                dispatch(addListNotify(getState().Home.accountInfo.UserID, ValueStrings.ms_system_error_auto_return, ValueStrings.system_error_auto_return))
            } else if(msg === ValueStrings.system_error){
                dispatch(addListNotify(getState().Home.accountInfo.UserID, ValueStrings.ms_system_error, ValueStrings.system_error))
            }
            dispatch(updateListNotify(getState().Home.accountInfo.UserID, null));
            dispatch(setMsgOld(msg))
        }
    }
}

export const calTotal = (listDataConvert) => {
    return (dispatch, getState) => {
        var itemDevice;
        var total_soc = 0;
        var total_vol = 0;
        var total_current = 0;
        var total_tem = 0;
        itemDevice
        try{ 
            if(listDataConvert !== null && listDataConvert != undefined && listDataConvert.length > 0) {
                listDataConvert.forEach(element => {
                    itemDevice = getState().MultiBMS.listDeviceScanning.filter(e => e.id == element.mac)[0];
                    total_soc += element.data.rsoc;
                    total_vol += element.data.totalVoltage;
                    total_current += element.data.current;
                    element.data.tempList.forEach(item => {
                        if(total_tem < item){
                            total_tem = item;
                        }
                    })

                    if(Platform.OS === 'ios'){
                        dispatch(setListPackStyle(
                            itemDevice.localName, 
                            convertMacBleIOS(itemDevice.manufacturerData), 
                            element.mac, 
                            element.data.charSwithOnOff, 
                            element.data.disSwithOnOff,
                            element.data.rsoc,
                            element.data.totalVoltage,
                            element.data.current,
                            element.data.tempList,
                            element.data.remaindPower,
                            element.data.nominalPower,
                            element.data.cycleTimes,
                            element.data.protectionStateList,
                        ))
                    } else {
                        dispatch(setListPackStyle(
                            itemDevice.name, 
                            itemDevice.id, 
                            element.mac, 
                            element.data.charSwithOnOff, 
                            element.data.disSwithOnOff,
                            element.data.rsoc,
                            element.data.totalVoltage,
                            element.data.current,
                            element.data.tempList,
                            element.data.remaindPower,
                            element.data.nominalPower,
                            element.data.cycleTimes,
                            element.data.protectionStateList,
                        ))
                    }
                });
        
                dispatch(addTotalObject({
                    soc: (total_soc / listDataConvert.length), 
                    vol: (total_vol / listDataConvert.length), 
                    curent: total_current, 
                    tem: total_tem,
                }));

                dispatch(updateSwithOnOff());

                dispatch(checkDataPackPin(listDataConvert));
            }
        } catch(e) { 
            console.error(e); 

            dispatch(autoDisconnect());
            dispatch(setStyleAlerAction(ValueStrings.warning, "Can't connect device"))
        }
    }
}

export const addTotalObject = (totalObject) => {
    return (dispatch, getState) => {
        dispatch(addTotal(totalObject));
        dispatch(addDataConvert(totalObject));
    }
}

export const addDataConvert = (totalObject) => {
    return (dispatch, getState) => {
        var data_convert = getState().Ble.dataConvert;
        data_convert.total_voltage = roundNumber(totalObject.vol, 1);
        data_convert.soc = totalObject.soc;
        data_convert.current = roundNumber(totalObject.curent, 1);
        data_convert.temp_max = totalObject.tem;
        data_convert.cycle_count = 0;
        dispatch(add_data_convert(data_convert));
    }
}

export const writeOnOffOutput_bms_xx = (val) => {
    return(dispatch, getState) => {
        let listDevice = getState().MultiBMS.listDeviceScanning;
        if(listDevice.length > 0){
            let my = setInterval(() => {
                listDevice.forEach(item => {
                    if(!val){
                        dispatch(sendData(item.id, [-35,90,-31,2,0,2,-1,27,119])); // OFF
                    } else {
                        dispatch(sendData(item.id, [-35,90,-31,2,0,0,-1,29,119])); // ON
                    }
                });
            }, 500);
            if(val){
                dispatch(checkSwithOnOff(listDevice));
            }
            setTimeout(() => {clearInterval(my)}, 1600);
        }
    }
}