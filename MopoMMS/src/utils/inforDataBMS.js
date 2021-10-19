import {add_data_convert} from '../actions/actions'
import {update_date_state, addListNotify, setMsgOld, setStyleAlerAction} from '../actions/action_home'
import ValueStrings from '../utils/Strings'
import {roundNumber} from '../utils/utilConfig'

const diagnosticTypes = [
    "Fault  - Cell Over Voltage.",
    "Fault  - Cell Under Voltage.",
    "Fault  - Charging Over Current.",
    "Fault  - Discharging Over Current.",
    "Fault  - Charging Over Temperature.",
    "Fault  - Charging Under Temperature.",
    "Fault  - Discharging Over Temperature.",
    "Fault  - Discharging Under Temperature.",
    "Fault  - Charging Cell Imbalance Voltage.",
    "Fault  - Cell Imbalance Temperature.",
    "Fault  - Pack Over Voltage.",
    "Fault  - Pack Under Voltage.",
    "Fault  - Main Fet Over Temperature.",
    "Failure - Cell Over Voltage.",
    "Failure - Cell Under Voltage.",
    "Failure - Charging Over Current.",
    "Failure - Discharging Over Current.",
    "Failure - Charging Over Temperature.",
    "Failure - Charging Under Temperature.",
    "Failure - Discharging Over Temperature.",
    "Failure - Discharging Under Temperature.",
    "Failure - Charging Cell Imbalance Voltage.",
    "Failure - Cell Imbalance Temperature.",
    "Failure - Pack Over Voltage.",
    "Failure - Pack Under Voltage.",
    "Failure - Main Fet Over Temperature.",
    "Failure - Cell Under Voltage - Hardware Protection.",
    "Failure - Cell Over Voltage - Hardware Protection.",
    "Failure - Discharging Over Current - Hardware Protection.",
    "Failure - Discharging Short Circuit - Hardware Protection.",
    "Failure - XREADY - Hardware Protection.",
    "Reserve"]

export function formatParams(datas) {
    return (dispatch, getState) => {
        try{
            var content_data = getData(datas);
            if(datas[3] == 0){
                dispatch(convert_data_msg_id_00(content_data))
            } else if(datas[3] == 1){
                dispatch(convert_data_msg_id_01(content_data));
            } else if(datas[3] == 2){
                dispatch(convert_data_msg_id_02(content_data));
            } else if(datas[3] == 3){
                dispatch(convert_data_msg_id_03(content_data));
            } else if(datas[3] == 4){
                dispatch(convert_data_msg_id_04(content_data));
            } else if(datas[3] == 5){
                dispatch(convert_data_msg_id_05(content_data));
            } else if(datas[3] == 6){
                dispatch(convert_data_msg_id_06(content_data));
            }
        } catch (e){
            console.log("Convert data error: " + e);
        }
    }
}

export const convert_data_msg_id_00 = (byteArray) => {
    return (dispatch, getState) => {
        let data_convert = getState().Ble.dataConvert;
        data_convert.total_voltage = roundNumber(((byteArray[3] << 24) + (byteArray[2] << 16) + (byteArray[1] << 8) + (byteArray[0] & 255))/1000, 1);
        let curent = (((byteArray[7] << 24) + (byteArray[6] << 16) + (byteArray[5] << 8) + (byteArray[4] & 255)));
        if(curent > 1000000000){
            curent = curent - 1074791680;
        }
        data_convert.current = roundNumber(curent/100, 1);
        data_convert.soc = byteArray[8];
        data_convert.soh = byteArray[9];
        data_convert.cycle_count = (byteArray[11] << 8) + (byteArray[10] & 255);
        data_convert.mosfet_state = (byteArray[12] == 3) ? true : false;
        dispatch(update_date_state(getState().Home.updateDataState ? false : true));
        data_convert.temp_sensor_1 = (byteArray[13] << 24) >> 24;
        data_convert.temp_sensor_2 = (byteArray[14] << 24) >> 24;
        data_convert.temp_sensor_3 = (byteArray[15] << 24) >> 24;
        data_convert.temp_max = data_convert.temp_min = data_convert.temp_sensor_1;
        if(data_convert.temp_max < data_convert.temp_sensor_1){
            data_convert.temp_max = data_convert.temp_sensor_1;
        } 
        if(data_convert.temp_max < data_convert.temp_sensor_2) {
            data_convert.temp_max = data_convert.temp_sensor_2;
        }  
        if(data_convert.temp_max < data_convert.temp_sensor_3) {
            data_convert.temp_max = data_convert.temp_sensor_3;
        }

        if(data_convert.temp_min > data_convert.temp_sensor_1){
            data_convert.temp_min = data_convert.temp_sensor_1;
        }
        if(data_convert.temp_min > data_convert.temp_sensor_2){
            data_convert.temp_min = data_convert.temp_sensor_2;
        }
        if(data_convert.temp_min > data_convert.temp_sensor_3){
            data_convert.temp_min = data_convert.temp_sensor_3;
        }
        dispatch(add_data_convert(data_convert));
    }
}

export const convert_data_msg_id_01 = (byteArray) => {
    return (dispatch, getState) => {
        let data_convert = getState().Ble.dataConvert;
        data_convert.temp_sensor_4 = (byteArray[0] << 24) >> 24;
        data_convert.temp_sensor_5 = (byteArray[1] << 24) >> 24;
        data_convert.temp_sensor_6 = (byteArray[2] << 24) >> 24;
        data_convert.temp_sensor_7 = (byteArray[3] << 24) >> 24;
        if(data_convert.temp_max < data_convert.temp_sensor_4){
            data_convert.temp_max = data_convert.temp_sensor_4;
        } 
        if(data_convert.temp_max < data_convert.temp_sensor_5) {
            data_convert.temp_max = data_convert.temp_sensor_5;
        } 
        if(data_convert.temp_max < data_convert.temp_sensor_6) {
            data_convert.temp_max = data_convert.temp_sensor_6;
        } 
        if(data_convert.temp_max < data_convert.temp_sensor_7) {
            data_convert.temp_max = data_convert.temp_sensor_7;
        }

        if(data_convert.temp_min > data_convert.temp_sensor_4){
            data_convert.temp_min = data_convert.temp_sensor_4;
        }
        if(data_convert.temp_min > data_convert.temp_sensor_5){
            data_convert.temp_min = data_convert.temp_sensor_5;
        }
        if(data_convert.temp_min > data_convert.temp_sensor_6){
            data_convert.temp_min = data_convert.temp_sensor_6;
        }

        data_convert.diagnostic = formatDiagnostic((byteArray[7] << 24) + (byteArray[6] << 16) + (byteArray[5] << 8) + (byteArray[4] & 255));
        
        if(data_convert.diagnostic.length > 0){
            var msg_str = "";
            data_convert.diagnostic.forEach(el => {
                if(el.diagnostic > 4096){
                    msg_str += el.diagnosticTypes.replace('Failure ', '') + "\n";
                }
            });
            msg_str = msg_str.substring(0, msg_str.length - 2)
            if(getState().Home.msgOld !== msg_str){
                dispatch(addListNotify( 1, ValueStrings.ms_bms_warning, msg_str));
                dispatch(setMsgOld(msg_str));
                dispatch(setStyleAlerAction(ValueStrings.warning, msg_str)); 
            }
        }
        
        data_convert.reserve = "reserve";
        data_convert.num_of_cell = byteArray[15];
        dispatch(add_data_convert(data_convert));
    }
}

export const convert_data_msg_id_02 = (byteArray) => {
    return (dispatch, getState) => {
        let data_convert = getState().Ble.dataConvert;
        data_convert.vol_cell_1 = (byteArray[1] << 8) + (byteArray[0] & 255);
        data_convert.vol_cell_2 = (byteArray[3] << 8) + (byteArray[2] & 255);
        data_convert.vol_cell_3 = (byteArray[5] << 8) + (byteArray[4] & 255);
        data_convert.vol_cell_4 = (byteArray[7] << 8) + (byteArray[6] & 255);
        data_convert.vol_cell_5 = (byteArray[9] << 8) + (byteArray[8] & 255);
        data_convert.vol_cell_6 = (byteArray[11] << 8) + (byteArray[10] & 255);
        data_convert.vol_cell_7 = (byteArray[13] << 8) + (byteArray[12] & 255);
        data_convert.vol_cell_8 = (byteArray[15] << 8) + (byteArray[14] & 255);
        data_convert.vol_cell_max = data_convert.vol_cell_1;
        data_convert.vol_cell_min = data_convert.vol_cell_1;
        data_convert.position_vol_cell_max = 1;
        data_convert.position_vol_cell_min = 1;
        if(data_convert.vol_cell_max < data_convert.vol_cell_2){
            data_convert.vol_cell_max = data_convert.vol_cell_2;
            data_convert.position_vol_cell_max = 2;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_2 && data_convert.num_of_cell >= 2){
            data_convert.vol_cell_min = data_convert.vol_cell_2;
            data_convert.position_vol_cell_min = 2;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_3){
            data_convert.vol_cell_max = data_convert.vol_cell_3;
            data_convert.position_vol_cell_max = 3;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_3 && data_convert.num_of_cell >= 3){
            data_convert.vol_cell_min = data_convert.vol_cell_3;
            data_convert.position_vol_cell_min = 3;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_4){
            data_convert.vol_cell_max = data_convert.vol_cell_4;
            data_convert.position_vol_cell_max = 4;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_4 && data_convert.num_of_cell >= 4){
            data_convert.vol_cell_min = data_convert.vol_cell_4;
            data_convert.position_vol_cell_min = 4;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_5){
            data_convert.vol_cell_max = data_convert.vol_cell_5;
            data_convert.position_vol_cell_max = 5;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_5 && data_convert.num_of_cell >= 5){
            data_convert.vol_cell_min = data_convert.vol_cell_5;
            data_convert.position_vol_cell_min = 5;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_6){
            data_convert.vol_cell_max = data_convert.vol_cell_6;
            data_convert.position_vol_cell_max = 6;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_6 && data_convert.num_of_cell >= 6){
            data_convert.vol_cell_min = data_convert.vol_cell_6;
            data_convert.position_vol_cell_min = 6;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_7){
            data_convert.vol_cell_max = data_convert.vol_cell_7;
            data_convert.position_vol_cell_max = 7;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_7 && data_convert.num_of_cell >= 7){
            data_convert.vol_cell_min = data_convert.vol_cell_7;
            data_convert.position_vol_cell_min = 7;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_8){
            data_convert.vol_cell_max = data_convert.vol_cell_8;
            data_convert.position_vol_cell_max = 8;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_8 && data_convert.num_of_cell >= 8){
            data_convert.vol_cell_min = data_convert.vol_cell_8;
            data_convert.position_vol_cell_min = 8;
        }

        dispatch(add_data_convert(data_convert));
    }
}

export const convert_data_msg_id_03 = (byteArray) => {
    return (dispatch, getState) => {
        let data_convert = getState().Ble.dataConvert;
        data_convert.vol_cell_9 = (byteArray[1] << 8) + (byteArray[0] & 255);
        data_convert.vol_cell_10 = (byteArray[3] << 8) + (byteArray[2] & 255);
        data_convert.vol_cell_11 = (byteArray[5] << 8) + (byteArray[4] & 255);
        data_convert.vol_cell_12 = (byteArray[7] << 8) + (byteArray[6] & 255);
        data_convert.vol_cell_13 = (byteArray[9] << 8) + (byteArray[8] & 255);
        data_convert.vol_cell_14 = (byteArray[11] << 8) + (byteArray[10] & 255);
        data_convert.vol_cell_15 = (byteArray[13] << 8) + (byteArray[12] & 255);
        data_convert.vol_cell_16 = (byteArray[15] << 8) + (byteArray[14] & 255);

        if(data_convert.vol_cell_max < data_convert.vol_cell_9){
            data_convert.vol_cell_max = data_convert.vol_cell_9;
            data_convert.position_vol_cell_max = 9;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_9 && data_convert.num_of_cell >= 9){
            data_convert.vol_cell_min = data_convert.vol_cell_9;
            data_convert.position_vol_cell_min = 9;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_10){
            data_convert.vol_cell_max = data_convert.vol_cell_10;
            data_convert.position_vol_cell_max = 10;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_10 && data_convert.num_of_cell >= 10){
            data_convert.vol_cell_min = data_convert.vol_cell_10;
            data_convert.position_vol_cell_min = 10;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_11){
            data_convert.vol_cell_max = data_convert.vol_cell_11;
            data_convert.position_vol_cell_max = 11;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_11 && data_convert.num_of_cell >= 11){
            data_convert.vol_cell_min = data_convert.vol_cell_11;
            data_convert.position_vol_cell_min = 11;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_12){
            data_convert.vol_cell_max = data_convert.vol_cell_12;
            data_convert.position_vol_cell_max = 12;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_12 && data_convert.num_of_cell >= 12){
            data_convert.vol_cell_min = data_convert.vol_cell_12;
            data_convert.position_vol_cell_min = 12;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_13){
            data_convert.vol_cell_max = data_convert.vol_cell_13;
            data_convert.position_vol_cell_max = 13;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_13 && data_convert.num_of_cell >= 13){
            data_convert.vol_cell_min = data_convert.vol_cell_13;
            data_convert.position_vol_cell_min = 13;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_14){
            data_convert.vol_cell_max = data_convert.vol_cell_14;
            data_convert.position_vol_cell_max = 14;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_14 && data_convert.num_of_cell >= 14){
            data_convert.vol_cell_min = data_convert.vol_cell_14;
            data_convert.position_vol_cell_min = 14;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_15){
            data_convert.vol_cell_max = data_convert.vol_cell_15;
            data_convert.position_vol_cell_max = 15;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_15 && data_convert.num_of_cell >= 15){
            data_convert.vol_cell_min = data_convert.vol_cell_15;
            data_convert.position_vol_cell_min = 15;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_16){
            data_convert.vol_cell_max = data_convert.vol_cell_16;
            data_convert.position_vol_cell_max = 16;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_16 && data_convert.num_of_cell >= 16){
            data_convert.vol_cell_min = data_convert.vol_cell_16;
            data_convert.position_vol_cell_min = 16;
        }

        dispatch(add_data_convert(data_convert));
    }
}

export const convert_data_msg_id_04 = (byteArray) => {
    return (dispatch, getState) => {
        let data_convert = getState().Ble.dataConvert;
        data_convert.vol_cell_17 = (byteArray[1] << 8) + (byteArray[0] & 255);
        data_convert.vol_cell_18 = (byteArray[3] << 8) + (byteArray[2] & 255);
        data_convert.vol_cell_19 = (byteArray[5] << 8) + (byteArray[4] & 255);
        data_convert.vol_cell_20 = (byteArray[7] << 8) + (byteArray[6] & 255);
        data_convert.vol_cell_21 = (byteArray[9] << 8) + (byteArray[8] & 255);
        data_convert.vol_cell_22 = (byteArray[11] << 8) + (byteArray[10] & 255);
        data_convert.vol_cell_23 = (byteArray[13] << 8) + (byteArray[12] & 255);
        data_convert.vol_cell_24 = (byteArray[15] << 8) + (byteArray[14] & 255);

        if(data_convert.vol_cell_max < data_convert.vol_cell_17){
            data_convert.vol_cell_max = data_convert.vol_cell_17;
            data_convert.position_vol_cell_max = 17;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_17 && data_convert.num_of_cell >= 17){
            data_convert.vol_cell_min = data_convert.vol_cell_17;
            data_convert.position_vol_cell_min = 17;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_18){
            data_convert.vol_cell_max = data_convert.vol_cell_18;
            data_convert.position_vol_cell_max = 18;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_18 && data_convert.num_of_cell >= 18){
            data_convert.vol_cell_min = data_convert.vol_cell_18;
            data_convert.position_vol_cell_min = 18;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_19){
            data_convert.vol_cell_max = data_convert.vol_cell_19;
            data_convert.position_vol_cell_max = 19;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_19 && data_convert.num_of_cell >= 19){
            data_convert.vol_cell_min = data_convert.vol_cell_19;
            data_convert.position_vol_cell_min = 19;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_20){
            data_convert.vol_cell_max = data_convert.vol_cell_20;
            data_convert.position_vol_cell_max = 20;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_20 && data_convert.num_of_cell >= 20){
            data_convert.vol_cell_min = data_convert.vol_cell_20;
            data_convert.position_vol_cell_min = 20;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_21){
            data_convert.vol_cell_max = data_convert.vol_cell_21;
            data_convert.position_vol_cell_max = 21;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_21 && data_convert.num_of_cell >= 21){
            data_convert.vol_cell_min = data_convert.vol_cell_21;
            data_convert.position_vol_cell_min = 21;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_22){
            data_convert.vol_cell_max = data_convert.vol_cell_22;
            data_convert.position_vol_cell_max = 22;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_22 && data_convert.num_of_cell >= 22){
            data_convert.vol_cell_min = data_convert.vol_cell_22;
            data_convert.position_vol_cell_min = 22;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_23){
            data_convert.vol_cell_max = data_convert.vol_cell_23;
            data_convert.position_vol_cell_max = 23;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_23 && data_convert.num_of_cell >= 23){
            data_convert.vol_cell_min = data_convert.vol_cell_23;
            data_convert.position_vol_cell_min = 23;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_24){
            data_convert.vol_cell_max = data_convert.vol_cell_24;
            data_convert.position_vol_cell_max = 24;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_24 && data_convert.num_of_cell >= 24){
            data_convert.vol_cell_min = data_convert.vol_cell_24;
            data_convert.position_vol_cell_min = 24;
        }

        dispatch(add_data_convert(data_convert));
    }
}

export const convert_data_msg_id_05 = (byteArray) => {
    return (dispatch, getState) => {
        let data_convert = getState().Ble.dataConvert;
        data_convert.vol_cell_25 = (byteArray[1] << 8) + (byteArray[0] & 255);
        data_convert.vol_cell_26 = (byteArray[3] << 8) + (byteArray[2] & 255);
        data_convert.vol_cell_27 = (byteArray[5] << 8) + (byteArray[4] & 255);
        data_convert.vol_cell_28 = (byteArray[7] << 8) + (byteArray[6] & 255);
        data_convert.vol_cell_29 = (byteArray[9] << 8) + (byteArray[8] & 255);
        data_convert.vol_cell_30 = (byteArray[11] << 8) + (byteArray[10] & 255);
        data_convert.vol_cell_31 = (byteArray[13] << 8) + (byteArray[12] & 255);
        data_convert.vol_cell_32 = (byteArray[15] << 8) + (byteArray[14] & 255);

        if(data_convert.vol_cell_max < data_convert.vol_cell_25){
            data_convert.vol_cell_max = data_convert.vol_cell_25;
            data_convert.position_vol_cell_max = 25;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_25 && data_convert.num_of_cell >= 25){
            data_convert.vol_cell_min = data_convert.vol_cell_25;
            data_convert.position_vol_cell_min = 25;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_26){
            data_convert.vol_cell_max = data_convert.vol_cell_26;
            data_convert.position_vol_cell_max = 26;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_26 && data_convert.num_of_cell >= 26){
            data_convert.vol_cell_min = data_convert.vol_cell_26;
            data_convert.position_vol_cell_min = 26;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_27){
            data_convert.vol_cell_max = data_convert.vol_cell_27;
            data_convert.position_vol_cell_max = 27;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_27 && data_convert.num_of_cell >= 27){
            data_convert.vol_cell_min = data_convert.vol_cell_27;
            data_convert.position_vol_cell_min = 27;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_28){
            data_convert.vol_cell_max = data_convert.vol_cell_28;
            data_convert.position_vol_cell_max = 28;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_28 && data_convert.num_of_cell >= 28){
            data_convert.vol_cell_min = data_convert.vol_cell_28;
            data_convert.position_vol_cell_min = 28;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_29){
            data_convert.vol_cell_max = data_convert.vol_cell_29;
            data_convert.position_vol_cell_max = 29;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_29 && data_convert.num_of_cell >= 29){
            data_convert.vol_cell_min = data_convert.vol_cell_29;
            data_convert.position_vol_cell_min = 29;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_30){
            data_convert.vol_cell_max = data_convert.vol_cell_30;
            data_convert.position_vol_cell_max = 30;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_30 && data_convert.num_of_cell >= 30){
            data_convert.vol_cell_min = data_convert.vol_cell_30;
            data_convert.position_vol_cell_min = 30;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_31){
            data_convert.vol_cell_max = data_convert.vol_cell_31;
            data_convert.position_vol_cell_max = 31;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_31 && data_convert.num_of_cell >= 31){
            data_convert.vol_cell_min = data_convert.vol_cell_31;
            data_convert.position_vol_cell_min = 31;
        }

        if(data_convert.vol_cell_max < data_convert.vol_cell_32){
            data_convert.vol_cell_max = data_convert.vol_cell_32;
            data_convert.position_vol_cell_max = 32;
        }
        if(data_convert.vol_cell_min > data_convert.vol_cell_32 && data_convert.num_of_cell >= 32){
            data_convert.vol_cell_min = data_convert.vol_cell_32;
            data_convert.position_vol_cell_min = 32;
        }

        dispatch(add_data_convert(data_convert));
    }
}

export const convert_data_msg_id_06 = (byteArray) => {
    return (dispatch, getState) => {
        let data_convert = getState().Ble.dataConvert;
        data_convert.fcc = (byteArray[1] << 8) + (byteArray[0] & 255);
        data_convert.rc = (byteArray[3] << 8) + (byteArray[2] & 255);
        dispatch(add_data_convert(data_convert));
    }
}

const getData = (datas) => {
    return datas.slice(4, datas.length - 1);
}

const formatDiagnostic = (diagnostic) => {
    console.log("diagnostic: " + diagnostic)
    var diagnosticList = [];
    var isProtect = false;
    for (index = 0; index < diagnosticTypes.length; index++) {
        if (((diagnostic >> index) & 1) == 1) {
            isProtect = true;
            diagnosticList = addArray(diagnosticList, {diagnostic: diagnostic, diagnosticTypes: diagnosticTypes[index], isProtect: true});
        }
    }
    return diagnosticList;
}

const addArray = (old_array, new_item) => {
    return old_array.concat(new_item);
}