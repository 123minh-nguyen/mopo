import {addArray} from './utilConfig'
import {add_byte_array_base_infor} from '../actions/action_xx'
import {roundNumber} from '../utils/utilConfig'
import {add_data_convert} from '../actions/actions'
import {addListNotify, setMsgOld, setStyleAlerAction} from '../actions/action_home'
import ValueStrings from '../utils/Strings'

const DEFAULT_DELIMITER = "-";
const protectionTypes = [ 
    "Cell over voltage", "Cell under voltage", "Pack over voltage",
    "Pack under voltage", "Charging over temperature", "Charging low temperature",
    "Discharge over temperature", "Discharge low temperature", "Charging over current",
    "Discharge over current", "Short circuit", "IC front-end error",
    "Software locking MOS", "Charge timeout Close"];

export function format_params_xx_bms(datas) {
    return (dispatch, getState) => {
        var content = getData(datas)
        if(datas[3] == content.length){
            if(datas[1] == 3){
                dispatch(format_base_infor(content));
            } else if(datas[1] == 4){
                dispatch(format_vol_cell(content));
            }
        }
    }
}

export function format_base_infor(content){
    return (dispatch, getState) => {
        try{
            var data_convert = getState().Ble.dataConvert;
            var ntcTempList = [];
            for (var i = 0; i < (content[22] & 255); i++) {
                if (content.length - 1 >= ((i * 2) + 22) + 2) {
                    ntcTempList = addArray(ntcTempList, content[((i * 2) + 22) + 1])
                    ntcTempList = addArray(ntcTempList, content[((i * 2) + 22) + 2])
                }
            }
    
            data_convert.total_voltage = roundNumber(((content[0] << 8) + (content[1] & 255)) / 100, 1);
            data_convert.soc = content[19] & 255;
            data_convert.current = ((content[2] << 8) + (content[3] & 255)) ;
            if(data_convert.current > 32767){
                data_convert.current = roundNumber((data_convert.current - 65535) / 100, 1);
            } else {
                data_convert.current = roundNumber(data_convert.current / 100, 1);
            }
            data_convert.rc = ((content[4] << 8) + (content[5] & 255));
            data_convert.fcc = ((content[6] << 8) + (content[7] & 255));
            data_convert.soh = 100;
            data_convert.cycle_count = (content[8] << 8) + (content[9] & 255);
            tempList = formatTemp(ntcTempList);
            if(tempList.length > 0) {
                data_convert.temp_sensor_1 = roundNumber(tempList[0], 0);
                if(data_convert.temp_max < data_convert.temp_sensor_1){
                    data_convert.temp_max = data_convert.temp_sensor_1;
                }

                if(data_convert.temp_min > data_convert.temp_sensor_1){
                    data_convert.temp_min = data_convert.temp_sensor_1;
                }
            }
            if(tempList.length > 1) {
                data_convert.temp_sensor_2 = roundNumber(tempList[1], 0);
                if(data_convert.temp_max < data_convert.temp_sensor_2){
                    data_convert.temp_max = data_convert.temp_sensor_2;
                }

                if(data_convert.temp_min > data_convert.temp_sensor_2){
                    data_convert.temp_min = data_convert.temp_sensor_2;
                }
            }
            if(tempList.length > 2) {
                data_convert.temp_sensor_3 = roundNumber(tempList[2], 0);
                if(data_convert.temp_max < data_convert.temp_sensor_3){
                    data_convert.temp_max = data_convert.temp_sensor_3;
                }

                if(data_convert.temp_min > data_convert.temp_sensor_3){
                    data_convert.temp_min = data_convert.temp_sensor_3;
                }
            }
            if(tempList.length > 3) {
                data_convert.temp_sensor_4 = roundNumber(tempList[3], 0);
                if(data_convert.temp_max < data_convert.temp_sensor_4){
                    data_convert.temp_max = data_convert.temp_sensor_4;
                }

                if(data_convert.temp_min > data_convert.temp_sensor_4){
                    data_convert.temp_min = data_convert.temp_sensor_4;
                }
            }
            if(tempList.length > 4) {
                data_convert.temp_sensor_5 = roundNumber(tempList[4], 0);
                if(data_convert.temp_max < data_convert.temp_sensor_5){
                    data_convert.temp_max = data_convert.temp_sensor_5;
                }

                if(data_convert.temp_min > data_convert.temp_sensor_5){
                    data_convert.temp_min = data_convert.temp_sensor_5;
                }
            }
            if(tempList.length > 5) {
                data_convert.temp_sensor_6 = roundNumber(tempList[5], 0);
                if(data_convert.temp_max < data_convert.temp_sensor_6){
                    data_convert.temp_max = data_convert.temp_sensor_6;
                }

                if(data_convert.temp_min > data_convert.temp_sensor_6){
                    data_convert.temp_min = data_convert.temp_sensor_6;
                }
            }

            data_convert.pack_status = (content[20] & 1);
            data_convert.mosfet_state = ((content[20] & 2) == 2) ? true : false;
            // data_convert.diagnostic = formatProtectionState([content[16], content[17]]);
            formatProtectionState([content[16], content[17]]).then((diagnostic) => {
                if(diagnostic.length > 0){
                    data_convert.diagnostic = diagnostic;
                    var msg_str = "";
                    diagnostic.forEach(el => {
                        msg_str += el.diagnosticTypes + "\n";
                    });
                    msg_str = msg_str.substring(0, msg_str.length - 1)
                    if(getState().Home.msgOld !== msg_str){
                        dispatch(addListNotify( 1, ValueStrings.ms_bms_warning, msg_str));
                        dispatch(setMsgOld(msg_str));
                        dispatch(setStyleAlerAction(ValueStrings.warning, msg_str)); 
                    }
                }
            })

            dispatch(add_data_convert(data_convert));
        } catch (e){
            console.log('Convert base infor error: ' + e)
        }
    }
}

export function format_vol_cell(byteArray){
    return (dispatch, getState) => {
        var data_convert = getState().Ble.dataConvert;
        data_convert.num_of_cell = byteArray.length / 2;
        if(data_convert.num_of_cell > 0) {
            data_convert.vol_cell_1 = (byteArray[0] << 8) + (byteArray[1] & 255);
        } else { data_convert.vol_cell_1 = 0}
        data_convert.vol_cell_max = data_convert.vol_cell_1;
        data_convert.position_vol_cell_max = 1;
        data_convert.vol_cell_min = data_convert.vol_cell_1;
        data_convert.position_vol_cell_min = 1;
        if(data_convert.num_of_cell > 1) {
            data_convert.vol_cell_2 = (byteArray[2] << 8) + (byteArray[3] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_2){
                data_convert.vol_cell_max = data_convert.vol_cell_2;
                data_convert.position_vol_cell_max = 2;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_2){
                data_convert.vol_cell_min = data_convert.vol_cell_2;
                data_convert.position_vol_cell_min = 2;
            }
        } else { data_convert.vol_cell_2 = 0}
        if(data_convert.num_of_cell > 2) {
            data_convert.vol_cell_3 = (byteArray[4] << 8) + (byteArray[5] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_3){
                data_convert.vol_cell_max = data_convert.vol_cell_3;
                data_convert.position_vol_cell_max = 3;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_3){
                data_convert.vol_cell_min = data_convert.vol_cell_3;
                data_convert.position_vol_cell_min = 3;
            }
        } else { data_convert.vol_cell_3 = 0}
        if(data_convert.num_of_cell > 3) {
            data_convert.vol_cell_4 = (byteArray[6] << 8) + (byteArray[7] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_4){
                data_convert.vol_cell_max = data_convert.vol_cell_4;
                data_convert.position_vol_cell_max = 4;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_4){
                data_convert.vol_cell_min = data_convert.vol_cell_4;
                data_convert.position_vol_cell_min = 4;
            }
        } else { data_convert.vol_cell_4 = 0}
        if(data_convert.num_of_cell > 4) {
            data_convert.vol_cell_5 = (byteArray[8] << 8) + (byteArray[9] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_5){
                data_convert.vol_cell_max = data_convert.vol_cell_5;
                data_convert.position_vol_cell_max = 5;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_5){
                data_convert.vol_cell_min = data_convert.vol_cell_5;
                data_convert.position_vol_cell_min = 5;
            }
        } else { data_convert.vol_cell_5 = 0}
        if(data_convert.num_of_cell > 5) {
            data_convert.vol_cell_6 = (byteArray[10] << 8) + (byteArray[11] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_6){
                data_convert.vol_cell_max = data_convert.vol_cell_6;
                data_convert.position_vol_cell_max = 6;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_6){
                data_convert.vol_cell_min = data_convert.vol_cell_6;
                data_convert.position_vol_cell_min = 6;
            }
        } else { data_convert.vol_cell_6 = 0}
        if(data_convert.num_of_cell > 6) {
            data_convert.vol_cell_7 = (byteArray[12] << 8) + (byteArray[13] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_7){
                data_convert.vol_cell_max = data_convert.vol_cell_7;
                data_convert.position_vol_cell_max = 7;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_7){
                data_convert.vol_cell_min = data_convert.vol_cell_7;
                data_convert.position_vol_cell_min = 7;
            }
        } else { data_convert.vol_cell_7 = 0}
        if(data_convert.num_of_cell > 7) {
            data_convert.vol_cell_8 = (byteArray[14] << 8) + (byteArray[15] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_8){
                data_convert.vol_cell_max = data_convert.vol_cell_8;
                data_convert.position_vol_cell_max = 8;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_8){
                data_convert.vol_cell_min = data_convert.vol_cell_8;
                data_convert.position_vol_cell_min = 8;
            }
        } else { data_convert.vol_cell_8 = 0}
        if(data_convert.num_of_cell > 8) {
            data_convert.vol_cell_9 = (byteArray[16] << 8) + (byteArray[17] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_9){
                data_convert.vol_cell_max = data_convert.vol_cell_9;
                data_convert.position_vol_cell_max = 9;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_9){
                data_convert.vol_cell_min = data_convert.vol_cell_9;
                data_convert.position_vol_cell_min = 9;
            }
        } else { data_convert.vol_cell_9 = 0}
        if(data_convert.num_of_cell > 9) {
            data_convert.vol_cell_10 = (byteArray[18] << 8) + (byteArray[19] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_10){
                data_convert.vol_cell_max = data_convert.vol_cell_10;
                data_convert.position_vol_cell_max = 10;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_10){
                data_convert.vol_cell_min = data_convert.vol_cell_10;
                data_convert.position_vol_cell_min = 10;
            }
        } else { data_convert.vol_cell_10 = 0}
        if(data_convert.num_of_cell > 10) {
            data_convert.vol_cell_11 = (byteArray[20] << 8) + (byteArray[21] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_11){
                data_convert.vol_cell_max = data_convert.vol_cell_11;
                data_convert.position_vol_cell_max = 11;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_11){
                data_convert.vol_cell_min = data_convert.vol_cell_11;
                data_convert.position_vol_cell_min = 11;
            }
        } else { data_convert.vol_cell_11 = 0}
        if(data_convert.num_of_cell > 11) {
            data_convert.vol_cell_12 = (byteArray[22] << 8) + (byteArray[23] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_12){
                data_convert.vol_cell_max = data_convert.vol_cell_12;
                data_convert.position_vol_cell_max = 12;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_12){
                data_convert.vol_cell_min = data_convert.vol_cell_12;
                data_convert.position_vol_cell_min = 12;
            }
        } else { data_convert.vol_cell_12 = 0}
        if(data_convert.num_of_cell > 12) {
            data_convert.vol_cell_13 = (byteArray[24] << 8) + (byteArray[25] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_13){
                data_convert.vol_cell_max = data_convert.vol_cell_13;
                data_convert.position_vol_cell_max = 13;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_13){
                data_convert.vol_cell_min = data_convert.vol_cell_13;
                data_convert.position_vol_cell_min = 13;
            }
        } else { data_convert.vol_cell_13 = 0}
        if(data_convert.num_of_cell > 13) {
            data_convert.vol_cell_14 = (byteArray[26] << 8) + (byteArray[27] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_14){
                data_convert.vol_cell_max = data_convert.vol_cell_14;
                data_convert.position_vol_cell_max = 14;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_14){
                data_convert.vol_cell_min = data_convert.vol_cell_14;
                data_convert.position_vol_cell_min = 14;
            }
        } else { data_convert.vol_cell_14 = 0}
        if(data_convert.num_of_cell > 14) {
            data_convert.vol_cell_15 = (byteArray[28] << 8) + (byteArray[29] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_15){
                data_convert.vol_cell_max = data_convert.vol_cell_15;
                data_convert.position_vol_cell_max = 15;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_15){
                data_convert.vol_cell_min = data_convert.vol_cell_15;
                data_convert.position_vol_cell_min = 15;
            }
        } else { data_convert.vol_cell_15 = 0}
        if(data_convert.num_of_cell > 15) {
            data_convert.vol_cell_16 = (byteArray[30] << 8) + (byteArray[31] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_16){
                data_convert.vol_cell_max = data_convert.vol_cell_16;
                data_convert.position_vol_cell_max = 16;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_16){
                data_convert.vol_cell_min = data_convert.vol_cell_16;
                data_convert.position_vol_cell_min = 16;
            }
        } else { data_convert.vol_cell_16 = 0}
        if(data_convert.num_of_cell > 16) {
            data_convert.vol_cell_17 = (byteArray[32] << 8) + (byteArray[33] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_17){
                data_convert.vol_cell_max = data_convert.vol_cell_17;
                data_convert.position_vol_cell_max = 17;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_17){
                data_convert.vol_cell_min = data_convert.vol_cell_17;
                data_convert.position_vol_cell_min = 17;
            }
        } else { data_convert.vol_cell_17 = 0}
        if(data_convert.num_of_cell > 17) {
            data_convert.vol_cell_18 = (byteArray[34] << 8) + (byteArray[35] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_18){
                data_convert.vol_cell_max = data_convert.vol_cell_18;
                data_convert.position_vol_cell_max = 18;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_18){
                data_convert.vol_cell_min = data_convert.vol_cell_18;
                data_convert.position_vol_cell_min = 18;
            }
        } else { data_convert.vol_cell_18 = 0}
        if(data_convert.num_of_cell > 18) {
            data_convert.vol_cell_19 = (byteArray[36] << 8) + (byteArray[37] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_19){
                data_convert.vol_cell_max = data_convert.vol_cell_19;
                data_convert.position_vol_cell_max = 19;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_19){
                data_convert.vol_cell_min = data_convert.vol_cell_19;
                data_convert.position_vol_cell_min = 19;
            }
        } else { data_convert.vol_cell_19 = 0}
        if(data_convert.num_of_cell > 19) {
            data_convert.vol_cell_20 = (byteArray[38] << 8) + (byteArray[39] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_20){
                data_convert.vol_cell_max = data_convert.vol_cell_20;
                data_convert.position_vol_cell_max = 20;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_20){
                data_convert.vol_cell_min = data_convert.vol_cell_20;
                data_convert.position_vol_cell_min = 20;
            }
        } else { data_convert.vol_cell_20 = 0}
        if(data_convert.num_of_cell > 20) {
            data_convert.vol_cell_21 = (byteArray[40] << 8) + (byteArray[41] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_21){
                data_convert.vol_cell_max = data_convert.vol_cell_21;
                data_convert.position_vol_cell_max = 21;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_21){
                data_convert.vol_cell_min = data_convert.vol_cell_21;
                data_convert.position_vol_cell_min = 21;
            }
        } else { data_convert.vol_cell_21 = 0}
        if(data_convert.num_of_cell > 21) {
            data_convert.vol_cell_22 = (byteArray[42] << 8) + (byteArray[43] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_22){
                data_convert.vol_cell_max = data_convert.vol_cell_22;
                data_convert.position_vol_cell_max = 22;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_22){
                data_convert.vol_cell_min = data_convert.vol_cell_22;
                data_convert.position_vol_cell_min = 22;
            }
        } else { data_convert.vol_cell_22 = 0}
        if(data_convert.num_of_cell > 22) {
            data_convert.vol_cell_23 = (byteArray[44] << 8) + (byteArray[45] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_23){
                data_convert.vol_cell_max = data_convert.vol_cell_23;
                data_convert.position_vol_cell_max = 23;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_23){
                data_convert.vol_cell_min = data_convert.vol_cell_23;
                data_convert.position_vol_cell_min = 23;
            }
        } else { data_convert.vol_cell_23 = 0}
        if(data_convert.num_of_cell > 23) {
            data_convert.vol_cell_24 = (byteArray[46] << 8) + (byteArray[47] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_24){
                data_convert.vol_cell_max = data_convert.vol_cell_24;
                data_convert.position_vol_cell_max = 24;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_24){
                data_convert.vol_cell_min = data_convert.vol_cell_24;
                data_convert.position_vol_cell_min = 24;
            }
        } else { data_convert.vol_cell_24 = 0}
        if(data_convert.num_of_cell > 24) {
            data_convert.vol_cell_25 = (byteArray[48] << 8) + (byteArray[49] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_25){
                data_convert.vol_cell_max = data_convert.vol_cell_25;
                data_convert.position_vol_cell_max = 25;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_25){
                data_convert.vol_cell_min = data_convert.vol_cell_25;
                data_convert.position_vol_cell_min = 25;
            }
        } else { data_convert.vol_cell_25 = 0}
        if(data_convert.num_of_cell > 25) {
            data_convert.vol_cell_26 = (byteArray[50] << 8) + (byteArray[51] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_26){
                data_convert.vol_cell_max = data_convert.vol_cell_26;
                data_convert.position_vol_cell_max = 26;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_26){
                data_convert.vol_cell_min = data_convert.vol_cell_26;
                data_convert.position_vol_cell_min = 26;
            }
        } else { data_convert.vol_cell_26 = 0}
        if(data_convert.num_of_cell > 26) {
            data_convert.vol_cell_27 = (byteArray[52] << 8) + (byteArray[53] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_27){
                data_convert.vol_cell_max = data_convert.vol_cell_27;
                data_convert.position_vol_cell_max = 27;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_27){
                data_convert.vol_cell_min = data_convert.vol_cell_27;
                data_convert.position_vol_cell_min = 27;
            }
        } else { data_convert.vol_cell_27 = 0}
        if(data_convert.num_of_cell > 27) {
            data_convert.vol_cell_28 = (byteArray[54] << 8) + (byteArray[55] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_28){
                data_convert.vol_cell_max = data_convert.vol_cell_28;
                data_convert.position_vol_cell_max = 28;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_28){
                data_convert.vol_cell_min = data_convert.vol_cell_28;
                data_convert.position_vol_cell_min = 28;
            }
        } else { data_convert.vol_cell_28 = 0}
        if(data_convert.num_of_cell > 28) {
            data_convert.vol_cell_29 = (byteArray[56] << 8) + (byteArray[57] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_29){
                data_convert.vol_cell_max = data_convert.vol_cell_29;
                data_convert.position_vol_cell_max = 29;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_29){
                data_convert.vol_cell_min = data_convert.vol_cell_29;
                data_convert.position_vol_cell_min = 29;
            }
        } else { data_convert.vol_cell_29 = 0}
        if(data_convert.num_of_cell > 29) {
            data_convert.vol_cell_30 = (byteArray[58] << 8) + (byteArray[59] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_30){
                data_convert.vol_cell_max = data_convert.vol_cell_30;
                data_convert.position_vol_cell_max = 30;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_30){
                data_convert.vol_cell_min = data_convert.vol_cell_30;
                data_convert.position_vol_cell_min = 30;
            }
        } else { data_convert.vol_cell_30 = 0}
        if(data_convert.num_of_cell > 30) {
            data_convert.vol_cell_31 = (byteArray[60] << 8) + (byteArray[61] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_31){
                data_convert.vol_cell_max = data_convert.vol_cell_31;
                data_convert.position_vol_cell_max = 31;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_31){
                data_convert.vol_cell_min = data_convert.vol_cell_31;
                data_convert.position_vol_cell_min = 31;
            }
        } else { data_convert.vol_cell_31 = 0}
        if(data_convert.num_of_cell > 31) {
            data_convert.vol_cell_32 = (byteArray[62] << 8) + (byteArray[63] & 255);
            if(data_convert.vol_cell_max < data_convert.vol_cell_32){
                data_convert.vol_cell_max = data_convert.vol_cell_32;
                data_convert.position_vol_cell_max = 32;
            }
            if(data_convert.vol_cell_min > data_convert.vol_cell_32){
                data_convert.vol_cell_min = data_convert.vol_cell_32;
                data_convert.position_vol_cell_min = 33;
            }
        } else { data_convert.vol_cell_32 = 0}

        data_convert.vol_cell_deff = data_convert.vol_cell_max - data_convert.vol_cell_min;

        dispatch(add_data_convert(data_convert));
    }
}

function getData(datas = []) {
    return datas.slice(4, datas.length - 3);
}

function formatTemp(tempByteList) {
    var data = [];
    for (var i = 0; i < tempByteList.length; i += 2) {
        let l = tempByteList[i + 1] & 255;
        data = addArray(data, [(((((tempByteList[i] & 255) * 256) + l) - 2731)) / 10]);
    }
    return data;
}

function formatProtectionState(protectionState = []) {
    
    // return protectionStateList;
    return new Promise(async (resolve, reject) => {
        var protectionStateList = [];
        var b = 0;
        var index = 0;
        for (i = 0; i < protectionTypes.length; i++) {
            b = 0;
            index = 0;
            if (i < 8) {
                b = protectionState[1];
                index = i;
            } else {
                b = protectionState[0];
                index = i - 8;
            }
            if ((((b & 255) >> index) & 1) == 1) {
                protectionStateList = addArray(protectionStateList, {diagnostic: ((protectionState[0] << 8) + (protectionState[1] & 255)), diagnosticTypes: protectionTypes[i], isProtect: true});
            }
        }
        resolve(protectionStateList);
    })
}