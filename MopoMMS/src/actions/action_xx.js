import {byteArrayValueResponse, byteArraytoHexString} from '../utils/utilConfig'
import {setStyleAlerAction} from './action_home'
import {format_params_xx_bms} from '../utils/inforDataXX_BMS'
import ValueStrings from '../utils/Strings'
import {status_ble, disconnectDevice, set_check_sume} from './actions'


export const add_byte_array_base_infor = (byteArray) => ({
    type: 'ADD_BYTE_ARRAY_BASE_INFOR',
    byteArray: byteArray
})

export const clear_byte_array_base_infor = () => ({
    type: 'CLEAR_BYTE_ARRAY_BASE_INFOR',
})

export function setNotify_XX_BMS (id, services, notify) {  // XX: XiaoXiang
    return (dispatch, getState, DeviceManager) => {
        try {
            DeviceManager.monitorCharacteristicForDevice(id, services, notify, (error, characteristic) => {
                if (error) {
                    // console.log("Notify error ==> " + error.message);
                    if (getState().Ble.statusBle == 3) {
                        dispatch(setNotify_XX_BMS(getState().Ble.deviceConnected.id));
                    }
                    if(("" + error).indexOf('was disconnected') > 0 && getState().Ble.statusBle == 0){
                        dispatch(setStyleAlerAction(ValueStrings.toast_maketext, ValueStrings.disconnect_device));
                    }
                    return;
                }

                byteArrayValueResponse(characteristic.value).then((response_data) => {
                    if(response_data[0] == 221 && response_data[response_data.length - 1] == 119){
                        dispatch(add_byte_array_base_infor(response_data));
                    } else {
                        if(response_data[0] == 221 && (response_data[1] == 3 || response_data[1] == 4)){
                            dispatch(add_byte_array_base_infor(response_data));
                        } else {
                            dispatch(add_byte_array_base_infor(getState().XX.dataByteArray.concat(response_data)));
                        }
                    }

                    if(getState().XX.dataByteArray[0] == 221 && getState().XX.dataByteArray[getState().XX.dataByteArray.length - 1] == 119){
                        console.log("Data response " + characteristic.deviceID + " ==> " + JSON.stringify(getState().XX.dataByteArray));

                        if(getState().XX.dataByteArray[1] == 6){
                            if(getState().XX.dataByteArray[2] == 0){
                                dispatch(set_check_sume(true));
                                dispatch(status_ble(4));
                            } else if (getState().XX.dataByteArray[2] == 128){
                                dispatch(setStyleAlerAction(ValueStrings.warning, "Can't connect device.\nPassword default for BMS is wrong."));
                                dispatch(disconnectDevice());
                            }
                        } else {
                            dispatch(status_ble(4));
                            dispatch(format_params_xx_bms(getState().XX.dataByteArray));
                        }
                    }
                });
            });
        } catch (error) {
            console.log("Set notify error ==> " + error);
        }  
    }
}

