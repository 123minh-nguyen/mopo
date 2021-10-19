import {Platform, Alert} from 'react-native'
import {convertMacBleIOS, byteArrayValueSend, byteArrayValueResponse, byteArraytoHexString, getPasswordFromMAC} from '../utils/utilConfig'
import {getCMDPasswordFromMac} from '../utils/convertPasswordFromMac'
import {formatParams} from '../utils/inforDataBMS'
import {set_page_screen, setStyleAlerAction, setCloseAlerAction, update_date_state, addListNotify, setMsgOld, setStyleBMS} from './action_home'
import ValueStrings from '../utils/Strings'
import {model_data_convert} from '../reducer/BLEReducer'
import { getService } from "../services/servicesBLE";
import { format_params_axe_bms } from "../utils/inforDataAXE_BMS";
import {setNotify_XX_BMS} from './action_xx'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {processDataInterval} from './action_multi_bms_xx'
import BMSPasswdPairCMDEntity from '../utils/BMS_XX/BMSPasswdPairCMDEntity'
import {setAsyncStorage} from '../utils/AsyncStorageModel'

// 0: disconnect, 1: scan, 2: connecting, 3: connected, 4: read data
export const status_ble = (statusBle) => ({
    type: 'SET_STATUS_BLE',
    statusBle: statusBle
})

export const add_list_device = (device) => ({
    type: 'ADD_ITEM',
    device: device
})

export const update_list_device = (itemList) => ({
    type: 'UPDATE_LIST_ITEM',
    itemList: itemList
})

export const clear_list_device = () => ({
    type: 'CLEAR_LIST_ITEM',
})

export const add_device_connect = (device) => ({
    type: 'ADD_DEVICE_CONNECTED',
    device: device
})

export const clear_device_connect = () => ({
    type: 'CLEAR_DEVICE_CONNECTED',
})

export const set_check_sume = (isCheck) => ({
    type: 'SET_CHECK_SUME',
    checkSume: isCheck
})

export const add_data_response = (data) => ({
    type: 'DATA_RESPONSE',
    data: data
})

export const add_data_convert = (data) => ({
    type: 'ADD_DATA_CONVERT',
    data: data
})

export const set_services_ble = (servicesBle) => ({
    type: 'SET_SERVICES_BLE',
    servicesBle: servicesBle
})

const showAlert = (msg) => {
    Alert.alert(
        "",
        msg,
        [
          { text: "OK", onPress: () => console.log("Ok Pressed")}
        ],
        { cancelable: false }
    );
}

export const stopScan = () => {
    return (dispatch, getState, DeviceManager) => {
        DeviceManager.stopDeviceScan();
    }
}

const checkItem = (listDevice, id) => {
    return listDevice.some(item => item.id === id);
}

export const scanDevice = () => {
    return async (dispatch, getState, DeviceManager) => {
        dispatch(status_ble(1));
        await DeviceManager.startDeviceScan(['EEE0','0000ffe0-0000-1000-8000-00805f9b34fb','0000ff00-0000-1000-8000-00805f9b34fb'], null, (error, device) => {
            if (error) {
                console.log(error);
                
                if(("" + error).indexOf('BluetoothLE is powered off') > 0){
                    if(Platform.OS === 'ios'){
                        showAlert('Please turn on your Bluetooth.');
                    } else {
                        showAlert('Please turn on your Bluetooth.\nAnd make sure your "GPS" is turned on');
                    }
                } else if(("" + error).indexOf('Location services are disabled') > 0){
                    showAlert('Please turn on your GPS.');
                }

                dispatch(status_ble(0));
                dispatch(stopScan()); 
            }
    
            if (device !== null) {
                // console.log('Device: ' + device.name + ' ===> Mac: ' + device.id);
                if(!checkItem(getState().Ble.itemList, device.id)){
                    dispatch(add_list_device(device));
                }
            }
        })
    };
}

export const connectDeviceByMac = (strMac) => {
    return async (dispatch, getState, DeviceManager) => {
        dispatch(setStyleAlerAction(ValueStrings.connect_device, ValueStrings.connecting));
        dispatch(status_ble(1));

        setTimeout(() => { 
            if(getState().Ble.statusBle < 2){
                dispatch(status_ble(0));
                dispatch(stopScan());
                dispatch(disconnectDevice());
                dispatch(setStyleAlerAction(ValueStrings.warning, ValueStrings.can_not_find_device));
            }
        }, 10000);

        await DeviceManager.startDeviceScan(['EEE0','0000ffe0-0000-1000-8000-00805f9b34fb','0000ff00-0000-1000-8000-00805f9b34fb'], null, (error, device) => {
            if (error) {
                console.log(error);
                
                if(("" + error).indexOf('BluetoothLE is powered off') > 0){
                    if(Platform.OS === 'ios'){
                        showAlert('Please turn on your Bluetooth.');
                    } else {
                        showAlert('Please turn on your Bluetooth.\nAnd make sure your "GPS" is turned on');
                    }
                } else if(("" + error).indexOf('Location services are disabled') > 0){
                    showAlert('Please turn on your GPS.');
                }

                dispatch(status_ble(0));
                dispatch(stopScan()); 
                
                return;
            }
    
            if (device !== null) {
                // console.log('Device: ' + device.name + ' =====> Mac: ' + device.id);
                if(Platform.OS === 'ios'){
                    if(device.localName != null) {
                        if(convertMacBleIOS(device.manufacturerData) === strMac){
                            dispatch(connectDevice(device));
                        }
                    }
                } else {
                    if(device.name != null){
                        if(device.id === strMac){
                            dispatch(connectDevice(device));
                        }
                    }
                }
            }
        })
    };
}

export const connectDevice = (deviceConnect) => {
    return (dispatch, getState) => {
        dispatch(setStyleAlerAction(ValueStrings.connect_device, ValueStrings.connecting));

        if(getState().Ble.statusBle == 1){
            dispatch(stopScan());
        }

        if(getState().Ble.statusBle > 2 || getState().Ble.checkSume){
            dispatch(disconnectDevice());
            setTimeout(() => {
                dispatch(connect(deviceConnect));
            }, 1000);
        } else {
            dispatch(connect(deviceConnect));
        }
        dispatch(status_ble(2));
    }
}

export const connect = (deviceConnect) => {
    return (dispatch, getState) => {
        setTimeout(() => { 
            if(!getState().Ble.checkSume){
                if(getState().Ble.statusBle > 1){
                    dispatch(disconnectDevice());
                }
                dispatch(setStyleAlerAction(ValueStrings.warning, ValueStrings.can_not_connect_device));
            }
        }, 10000);

        deviceConnect
        .connect()
        .then((device) => {
            let allCharacteristics = device.discoverAllServicesAndCharacteristics();
            dispatch(add_device_connect({
                name: (Platform.OS === 'ios' ? deviceConnect.localName : deviceConnect.name),
                mac: (Platform.OS === 'ios' ? convertMacBleIOS(deviceConnect.manufacturerData) : deviceConnect.id),
                id: deviceConnect.id,
            }))
            return allCharacteristics;
        })
        .then((device) => {
            return device.services(device.id);
        })
        .then((services) => {
            getService(services).then(servicesBLE => {
                if(servicesBLE != undefined){
                    dispatch(set_services_ble(servicesBLE));
                    if(servicesBLE.services === 'eeeeeee0-eeee-eeee-eeee-eeeeeeeeeeee'){            // PCT: Powercentric
                        dispatch(setStyleBMS('PCT'));
                        dispatch(setNotify_PCT_BMS(deviceConnect.id, servicesBLE.services, servicesBLE.notify));
                    } else if (servicesBLE.services === '0000ffe0-0000-1000-8000-00805f9b34fb'){    // AXE: AXE
                        dispatch(setStyleBMS('AXE'));
                        dispatch(setNotify_AXE_BMS(deviceConnect.id, servicesBLE.services, servicesBLE.notify));
                        dispatch(set_check_sume(true));
                        dispatch(setCloseAlerAction());
                        dispatch(set_page_screen(0));
                    } else if (servicesBLE.services === '0000ff00-0000-1000-8000-00805f9b34fb'){    // XX: XiaoXiang
                        dispatch(setStyleBMS('XX'));
                        dispatch(status_ble(3));
                        dispatch(setNotify_XX_BMS(deviceConnect.id, servicesBLE.services, servicesBLE.notify));
                        dispatch(setCloseAlerAction());
                        dispatch(set_page_screen(0));
                    }
                    dispatch(status_ble(3));
                    dispatch(update_list_device(getState().Ble.itemList.filter(el => el.id != deviceConnect.id)));

                    setAsyncStorage(ValueStrings.key_last_connected_device, getState().Ble.deviceConnected.mac);
                } else {
                    if(getState().Ble.statusBle > 1){
                        dispatch(disconnectDevice());
                    }
                    dispatch(setStyleAlerAction(ValueStrings.warning, ValueStrings.can_not_connect_device));
                }
            });
        }, (error) => {
            console.log("Connect device error connect ", error.message);
        })
    }
}

export function disconnectDevice(){
    return (dispatch, getState, DeviceManager) => {
        if(getState().Ble.deviceConnected.id != undefined && getState().Ble.deviceConnected.id != null){
            dispatch(status_ble(0));
            DeviceManager.cancelDeviceConnection(getState().Ble.deviceConnected.id)
            .then((device) => {
                console.log("Disconnect device: ", device.id);
            })
            dispatch(clear_list_device());
            dispatch(clear_device_connect());
            dispatch(add_data_convert(new model_data_convert()));
            dispatch(set_check_sume(false));
            dispatch(setMsgOld(''));
            dispatch(update_date_state(getState().Home.updateDataState ? false : true));
        }
    }
}

export function setNotify_PCT_BMS (id, services, notify) {  // PCT: Powercentric
    return (dispatch, getState, DeviceManager) => {
        try {
            DeviceManager.monitorCharacteristicForDevice(id, services, notify, (error, characteristic) => {
                if (error) {
                    // console.log("Notify error ==> " + error.message);
                    if (getState().Ble.statusBle == 3) {
                        dispatch(setNotify_PCT_BMS(getState().Ble.deviceConnected.id));
                    }
                    if(("" + error).indexOf('was disconnected') > 0 && getState().Ble.statusBle == 0){
                        dispatch(setStyleAlerAction(ValueStrings.toast_maketext, ValueStrings.disconnect_device));
                    }
                    return;
                }

                byteArrayValueResponse(characteristic.value).then((response_data) => {
                    // console.log("Data response " + characteristic.deviceID + " ==> " + JSON.stringify(response_data));
                    if (response_data[3] == 84){
                        dispatch(checkPassPackPin(response_data, getState().Ble.deviceConnected.mac));
                    } else if (response_data[4] == 1 && response_data[5] == 85) {
                        dispatch(set_check_sume(true));
                        dispatch(status_ble(4));
                        dispatch(setCloseAlerAction());
                        dispatch(set_page_screen(0));
                    } else if (response_data[4] == 2 && response_data[5] == 85) {
                        dispatch(setStyleAlerAction(ValueStrings.toast_maketext, ValueStrings.can_not_control_output));
                    } else {
                        dispatch(formatParams(response_data));
                    }
                });
            });
        } catch (error) {
            // console.log("Set notify error ==> " + error);
        }  
    }
}

export function setNotify_AXE_BMS (id, services, notify) {
    return (dispatch, getState, DeviceManager) => {
        try {
            DeviceManager.monitorCharacteristicForDevice(id, services, notify, (error, characteristic) => {
                if (error) {
                    // console.log("Notify error ==> " + error.message);
                    if (getState().Ble.statusBle == 3) {
                        dispatch(setNotify_AXE_BMS(getState().Ble.deviceConnected.id));
                    }
                    return;
                }

                byteArrayValueResponse(characteristic.value).then((response_data) => {
                    if(response_data[0] == 1 && response_data[1] == 3 && response_data[2] == 110){
                        dispatch(add_data_response(response_data));
                    } else {
                        dispatch(add_data_response(getState().Ble.dataResponse.concat(response_data)));
                    }
                    if(getState().Ble.dataResponse.length == 115){
                        // console.log("Data response " + characteristic.deviceID + " ==> " + JSON.stringify(getState().Ble.dataResponse));
                        dispatch(status_ble(4));
                        dispatch(format_params_axe_bms(getState().Ble.dataResponse));
                    }
                });
            });
        } catch (error) {
            // console.log("Set notify error ==> " + error);
        }  
    }
}

export const checkPassPackPin = (byteData, mac) => {
    return (dispatch, getState) => {
        getCMDPasswordFromMac(byteData, mac).then(byte => {
            dispatch(sendData(getState().Ble.deviceConnected.id, byte));
        })
    }
}

export const checkPassPackPin_XX = () => {
    return (dispatch, getState, DeviceManager) => {
        let bmsPasswdPairCMDEntity = new BMSPasswdPairCMDEntity();
        if(getState().Ble.statusBle > 1){
            let my = setInterval(() => {
                if(getState().Ble.checkSume){
                    clearInterval(my);
                } else {
                    bmsPasswdPairCMDEntity.setPasswd(getPasswordFromMAC(getState().Ble.deviceConnected.mac));
                    dispatch(sendData(getState().Ble.deviceConnected.id, bmsPasswdPairCMDEntity.getCmdApi()));
                }
            }, 500);
        }
    }
}

export const sendData = (mac, byteArray) => {
    return (dispatch, getState, DeviceManager) => {
        byteArrayValueSend(byteArray).then(byteValue => {
            DeviceManager.writeCharacteristicWithResponseForDevice(
                mac,
                getState().Ble.servicesBle.services,
                getState().Ble.servicesBle.write,
                byteValue
            ).then((characteristic) => {
                // console.log("Data write " + characteristic.deviceID + " ==> " + byteArraytoHexString(byteArray));
            }).catch((error) => {
                // console.log("Data write error: " + error);
                if(("" + error).indexOf('is not connected') > 0 && getState().Ble.statusBle == 4){
                    dispatch(connectDeviceByMac(getState().Ble.deviceConnected.mac));
                    setTimeout(() => {
                        if(getState().Ble.statusBle < 2){
                            dispatch(stopScan());
                            dispatch(clearAllData());
                        }
                    }, 10000);
                }
            })
        })
    }
}

export const clearAllData = () => {
    return (dispatch, getState, DeviceManager) => {
        dispatch(addListNotify( 2, ValueStrings.ms_error, "- " + ValueStrings.bms_disconnected_bluetooth));
        dispatch(set_check_sume(false));
        dispatch(status_ble(0));
        dispatch(clear_list_device());
        dispatch(clear_device_connect()); 
        dispatch(add_data_convert(new model_data_convert()));
        dispatch(set_page_screen(1));
        dispatch(setMsgOld(''));
        dispatch(setStyleAlerAction(ValueStrings.warning, ValueStrings.bms_disconnected_bluetooth));
    }
}

export const setIntervalReadData = () => {
    return (dispatch, getState) => {
        setInterval(() => { 
            if(getState().Home.isMultiBMS){
                if(getState().MultiBMS.deviceConnected.length > 0){
                    dispatch(processDataInterval());
                    setTimeout(() => { dispatch(update_date_state(getState().Home.updateDataState ? false : true))}, 1500);
                }
            } else {
                if(getState().Ble.checkSume){
                    if(getState().Home.styleBMS === 'PCT'){             // PCT BMS
                        dispatch(sendData(getState().Ble.deviceConnected.id, [125,0,0,125]));
                    } else if(getState().Home.styleBMS === 'AXE'){      // AXE BMS
                        dispatch(sendData(getState().Ble.deviceConnected.id, [1,3,16,0,0,55,0,220]));
                    } else if(getState().Home.styleBMS === 'XX'){      // XX BMS
                        dispatch(sendData(getState().Ble.deviceConnected.id, [221,165,3,1,0,255,252,119]));
                        setTimeout(() => { dispatch(sendData(getState().Ble.deviceConnected.id, [221,165,4,1,0,255,251,119]))}, 1000);
                    }
                    setTimeout(() => { dispatch(update_date_state(getState().Home.updateDataState ? false : true))}, getState().Home.styleBMS === 'AXE' ? 350 : 1500); //1500
                } else if(getState().Ble.statusBle > 2){
                    if(getState().Home.styleBMS === 'XX'){
                        let bmsPasswdPairCMDEntity = new BMSPasswdPairCMDEntity();
                        bmsPasswdPairCMDEntity.setPasswd(getPasswordFromMAC(getState().Ble.deviceConnected.mac));
                        dispatch(sendData(getState().Ble.deviceConnected.id, bmsPasswdPairCMDEntity.getCmdApi()));
                    }
                }
            }
        }, getState().Home.styleBMS === 'AXE' ? 700 : 2000) // 2000
    }
}

export const checkConnectMulti = () => {
    try {
        AsyncStorage.getItem(ValueStrings.key_is_connect_multi).then((value) => {
            let connectMulti = JSON.parse(value)
            if(connectMulti != null && connectMulti != undefined && connectMulti.isMulti){
                return true;
            }
            return false;
        }).catch(e => {
            return false;
        });
    } catch (error) {
        return false;
    }
}

export const setOnOfOutput = (val) => {
    return (dispatch, getState) => {
        if(getState().Home.styleBMS === 'PCT'){
            if(val){
                dispatch(sendData(getState().Ble.deviceConnected.id, [125,1,16,2,125])); // ON
            } else {
                dispatch(sendData(getState().Ble.deviceConnected.id, [125,1,16,1,125])); // OFF
            }
        } else if(getState().Home.styleBMS === 'AXE'){
            if(val){
                dispatch(sendData(getState().Ble.deviceConnected.id, [1,6,48,3,0,165,182,177])); // ON
            } else {
                dispatch(sendData(getState().Ble.deviceConnected.id, [1,6,48,3,0,90,246,241]));  // OFF
            }
        } else if(getState().Home.styleBMS === 'XX'){
            if(val){
                dispatch(sendData(getState().Ble.deviceConnected.id, [-35,90,-31,2,0,0,-1,29,119])); // ON
            } else {
                dispatch(sendData(getState().Ble.deviceConnected.id, [-35,90,-31,2,0,2,-1,27,119])); // OFF
            }
        }
    }
}

export const sendReset = () => {
    return (dispatch, getState) => {
        dispatch(sendData(getState().Ble.deviceConnected.id, [125,1,16,3,125]));
    }
}
