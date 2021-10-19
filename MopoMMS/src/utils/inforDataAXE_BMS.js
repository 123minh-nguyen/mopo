import {add_data_convert} from '../actions/actions'
import {roundNumber} from '../utils/utilConfig'
import {addListNotify, setMsgOld, setStyleAlerAction} from '../actions/action_home'
import ValueStrings from '../utils/Strings'

const packStatus = [
    "Short circuit protection",
    "Differential pressure protection",
    "Discharge secondary overcurrent",
    "Charge overcurrent",
    "Discharge overcurrent",
    "Total voltage overvoltage",
    "Total voltage undervoltage",
    "Single overvoltage",
    "Single undervoltage",
    "Charge high temperature protection",
    "Charge low temperature protection",
    "Discharge high temperature protection",
    "Discharge low temperature protection",
    ]

export function format_params_axe_bms(datas) {
    return (dispatch, getState) => {
        try{
            let byteArray = getData(datas);
            var data_convert = getState().Ble.dataConvert;
            data_convert.num_of_cell = (byteArray[0] << 8) + (byteArray[1] & 255);
            data_convert.run_time = (byteArray[2] << 8) + (byteArray[3] & 255);
            data_convert.soh = (byteArray[4] << 8) + (byteArray[5] & 255);
            data_convert.total_voltage = roundNumber(((byteArray[6] << 8) + (byteArray[7] & 255))/100, 1);
            data_convert.current = roundNumber((((byteArray[8] << 8) + (byteArray[9] & 255))/10) - 1000, 1);
            data_convert.temp_sensor_1 = roundNumber((((byteArray[10] << 8) + (byteArray[11] & 255))/10) - 40, 0);
            data_convert.temp_sensor_2 = roundNumber((((byteArray[12] << 8) + (byteArray[13] & 255))/10) - 40, 0);
            data_convert.temp_sensor_3 = roundNumber((((byteArray[14] << 8) + (byteArray[15] & 255))/10) - 40, 0);
            data_convert.temp_sensor_4 = roundNumber((((byteArray[16] << 8) + (byteArray[17] & 255))/10) - 40, 0);
            data_convert.temp_sensor_5 = roundNumber((((byteArray[18] << 8) + (byteArray[19] & 255))/10) - 40, 0);
            data_convert.temp_sensor_6 = roundNumber((((byteArray[20] << 8) + (byteArray[21] & 255))/10) - 40, 0);
            data_convert.temp_max = roundNumber((((byteArray[22] << 8) + (byteArray[23] & 255))/10) - 40, 0);
            data_convert.temp_min = roundNumber((((byteArray[24] << 8) + (byteArray[25] & 255))/10) - 40, 0);
            data_convert.vol_cell_max = (byteArray[26] << 8) + (byteArray[27] & 255);
            data_convert.vol_cell_min = (byteArray[28] << 8) + (byteArray[29] & 255);
            data_convert.vol_cell_deff = (byteArray[30] << 8) + (byteArray[31] & 255);
            data_convert.soc = roundNumber(((byteArray[32] << 8) + (byteArray[33] & 255)), 0);
            data_convert.fcc = ((byteArray[34] << 8) + (byteArray[35] & 255));
            data_convert.rc = ((byteArray[36] << 8) + (byteArray[37] & 255));
            data_convert.cycle_count = (byteArray[38] << 8) + (byteArray[39] & 255);
            data_convert.protect = (byteArray[40] << 8) + (byteArray[41] & 255);
            data_convert.alarm = (byteArray[42] << 8) + (byteArray[43] & 255);
            // if(data_convert.alarm > 1 && data_convert.protect > 0){
            if(data_convert.protect > 0){
                data_convert.diagnostic = formatDiagnostic(data_convert.protect);
                formatDiagnostic(data_convert.protect).then(diagnostic => {
                    if(diagnostic.length > 0){
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
            }
            
            data_convert.mosfet_state = true;
            data_convert.vol_cell_1 = (byteArray[46] << 8) + (byteArray[47] & 255);
            data_convert.vol_cell_2 = (byteArray[48] << 8) + (byteArray[49] & 255);
            data_convert.vol_cell_3 = (byteArray[50] << 8) + (byteArray[51] & 255);
            data_convert.vol_cell_4 = (byteArray[52] << 8) + (byteArray[53] & 255);
            data_convert.vol_cell_5 = (byteArray[54] << 8) + (byteArray[55] & 255);
            data_convert.vol_cell_6 = (byteArray[56] << 8) + (byteArray[57] & 255);
            data_convert.vol_cell_7 = (byteArray[58] << 8) + (byteArray[59] & 255);
            data_convert.vol_cell_8 = (byteArray[60] << 8) + (byteArray[61] & 255);
            data_convert.vol_cell_9 = (byteArray[62] << 8) + (byteArray[63] & 255);
            data_convert.vol_cell_10 = (byteArray[64] << 8) + (byteArray[65] & 255);
            data_convert.vol_cell_11 = (byteArray[66] << 8) + (byteArray[67] & 255);
            data_convert.vol_cell_12 = (byteArray[68] << 8) + (byteArray[69] & 255);
            data_convert.vol_cell_13 = (byteArray[70] << 8) + (byteArray[71] & 255);
            data_convert.vol_cell_14 = (byteArray[72] << 8) + (byteArray[73] & 255);
            data_convert.vol_cell_15 = (byteArray[74] << 8) + (byteArray[75] & 255);
            data_convert.vol_cell_16 = (byteArray[76] << 8) + (byteArray[77] & 255);
            data_convert.vol_cell_17 = (byteArray[78] << 8) + (byteArray[79] & 255);
            data_convert.vol_cell_18 = (byteArray[80] << 8) + (byteArray[81] & 255);
            data_convert.vol_cell_19 = (byteArray[82] << 8) + (byteArray[83] & 255);
            data_convert.vol_cell_20 = (byteArray[84] << 8) + (byteArray[85] & 255);
            data_convert.vol_cell_21 = (byteArray[86] << 8) + (byteArray[87] & 255);
            data_convert.vol_cell_22 = (byteArray[88] << 8) + (byteArray[89] & 255);
            data_convert.vol_cell_23 = (byteArray[90] << 8) + (byteArray[91] & 255);
            data_convert.vol_cell_24 = (byteArray[92] << 8) + (byteArray[93] & 255);
            data_convert.vol_cell_25 = (byteArray[94] << 8) + (byteArray[95] & 255);
            data_convert.vol_cell_26 = (byteArray[96] << 8) + (byteArray[97] & 255);
            data_convert.vol_cell_27 = (byteArray[98] << 8) + (byteArray[99] & 255);
            data_convert.vol_cell_28 = (byteArray[100] << 8) + (byteArray[101] & 255);
            data_convert.vol_cell_29 = (byteArray[102] << 8) + (byteArray[103] & 255);
            data_convert.vol_cell_30 = (byteArray[104] << 8) + (byteArray[105] & 255);
            data_convert.vol_cell_31 = (byteArray[106] << 8) + (byteArray[107] & 255);
            data_convert.vol_cell_32 = (byteArray[108] << 8) + (byteArray[109] & 255);

            data_convert.position_vol_cell_max = 1;
            data_convert.position_vol_cell_min = 1;
            if(data_convert.num_of_cell > 1) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_2){
                    data_convert.position_vol_cell_max = 2;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_2){
                    data_convert.position_vol_cell_min = 2;
                }
            } else { data_convert.vol_cell_2 = 0}
            if(data_convert.num_of_cell > 2) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_3){
                    data_convert.position_vol_cell_max = 3;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_3){
                    data_convert.position_vol_cell_min = 3;
                }
            } else { data_convert.vol_cell_3 = 0}
            if(data_convert.num_of_cell > 3) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_4){
                    data_convert.position_vol_cell_max = 4;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_4){
                    data_convert.position_vol_cell_min = 4;
                }
            } else { data_convert.vol_cell_4 = 0}
            if(data_convert.num_of_cell > 4) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_5){
                    data_convert.position_vol_cell_max = 5;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_5){
                    data_convert.position_vol_cell_min = 5;
                }
            } else { data_convert.vol_cell_5 = 0}
            if(data_convert.num_of_cell > 5) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_6){
                    data_convert.position_vol_cell_max = 6;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_6){
                    data_convert.position_vol_cell_min = 6;
                }
            } else { data_convert.vol_cell_6 = 0}
            if(data_convert.num_of_cell > 6) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_7){
                    data_convert.position_vol_cell_max = 7;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_7){
                    data_convert.position_vol_cell_min = 7;
                }
            } else { data_convert.vol_cell_7 = 0}
            if(data_convert.num_of_cell > 7) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_8){
                    data_convert.position_vol_cell_max = 8;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_8){
                    data_convert.position_vol_cell_min = 8;
                }
            } else { data_convert.vol_cell_8 = 0}
            if(data_convert.num_of_cell > 8) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_9){
                    data_convert.position_vol_cell_max = 9;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_9){
                    data_convert.position_vol_cell_min = 9;
                }
            } else { data_convert.vol_cell_9 = 0}
            if(data_convert.num_of_cell > 9) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_10){
                    data_convert.position_vol_cell_max = 10;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_10){
                    data_convert.position_vol_cell_min = 10;
                }
            } else { data_convert.vol_cell_10 = 0}
            if(data_convert.num_of_cell > 10) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_11){
                    data_convert.position_vol_cell_max = 11;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_11){
                    data_convert.position_vol_cell_min = 11;
                }
            } else { data_convert.vol_cell_11 = 0}
            if(data_convert.num_of_cell > 11) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_12){
                    data_convert.position_vol_cell_max = 12;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_12){
                    data_convert.position_vol_cell_min = 12;
                }
            } else { data_convert.vol_cell_12 = 0}
            if(data_convert.num_of_cell > 12) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_13){
                    data_convert.position_vol_cell_max = 13;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_13){
                    data_convert.position_vol_cell_min = 13;
                }
            } else { data_convert.vol_cell_13 = 0}
            if(data_convert.num_of_cell > 13) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_14){
                    data_convert.position_vol_cell_max = 14;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_14){
                    data_convert.position_vol_cell_min = 14;
                }
            } else { data_convert.vol_cell_14 = 0}
            if(data_convert.num_of_cell > 14) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_15){
                    data_convert.position_vol_cell_max = 15;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_15){
                    data_convert.position_vol_cell_min = 15;
                }
            } else { data_convert.vol_cell_15 = 0}
            if(data_convert.num_of_cell > 15) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_16){
                    data_convert.position_vol_cell_max = 16;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_16){
                    data_convert.position_vol_cell_min = 16;
                }
            } else { data_convert.vol_cell_16 = 0}
            if(data_convert.num_of_cell > 16) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_17){
                    data_convert.position_vol_cell_max = 17;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_17){
                    data_convert.position_vol_cell_min = 17;
                }
            } else { data_convert.vol_cell_17 = 0}
            if(data_convert.num_of_cell > 17) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_18){
                    data_convert.position_vol_cell_max = 18;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_18){
                    data_convert.position_vol_cell_min = 18;
                }
            } else { data_convert.vol_cell_18 = 0}
            if(data_convert.num_of_cell > 18) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_19){
                    data_convert.position_vol_cell_max = 19;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_19){
                    data_convert.position_vol_cell_min = 19;
                }
            } else { data_convert.vol_cell_19 = 0}
            if(data_convert.num_of_cell > 19) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_20){
                    data_convert.position_vol_cell_max = 20;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_20){
                    data_convert.position_vol_cell_min = 20;
                }
            } else { data_convert.vol_cell_20 = 0}
            if(data_convert.num_of_cell > 20) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_21){
                    data_convert.position_vol_cell_max = 21;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_21){
                    data_convert.position_vol_cell_min = 21;
                }
            } else { data_convert.vol_cell_21 = 0}
            if(data_convert.num_of_cell > 21) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_22){
                    data_convert.position_vol_cell_max = 22;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_22){
                    data_convert.position_vol_cell_min = 22;
                }
            } else { data_convert.vol_cell_22 = 0}
            if(data_convert.num_of_cell > 22) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_23){
                    data_convert.position_vol_cell_max = 23;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_23){
                    data_convert.position_vol_cell_min = 23;
                }
            } else { data_convert.vol_cell_23 = 0}
            if(data_convert.num_of_cell > 23) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_24){
                    data_convert.position_vol_cell_max = 24;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_24){
                    data_convert.position_vol_cell_min = 24;
                }
            } else { data_convert.vol_cell_24 = 0}
            if(data_convert.num_of_cell > 24) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_25){
                    data_convert.position_vol_cell_max = 25;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_25){
                    data_convert.position_vol_cell_min = 25;
                }
            } else { data_convert.vol_cell_25 = 0}
            if(data_convert.num_of_cell > 25) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_26){
                    data_convert.position_vol_cell_max = 26;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_26){
                    data_convert.position_vol_cell_min = 26;
                }
            } else { data_convert.vol_cell_26 = 0}
            if(data_convert.num_of_cell > 26) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_27){
                    data_convert.position_vol_cell_max = 27;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_27){
                    data_convert.position_vol_cell_min = 27;
                }
            } else { data_convert.vol_cell_27 = 0}
            if(data_convert.num_of_cell > 27) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_28){
                    data_convert.position_vol_cell_max = 28;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_28){
                    data_convert.position_vol_cell_min = 28;
                }
            } else { data_convert.vol_cell_28 = 0}
            if(data_convert.num_of_cell > 28) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_29){
                    data_convert.position_vol_cell_max = 29;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_29){
                    data_convert.position_vol_cell_min = 29;
                }
            } else { data_convert.vol_cell_29 = 0}
            if(data_convert.num_of_cell > 29) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_30){
                    data_convert.position_vol_cell_max = 30;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_30){
                    data_convert.position_vol_cell_min = 30;
                }
            } else { data_convert.vol_cell_30 = 0}
            if(data_convert.num_of_cell > 30) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_31){
                    data_convert.position_vol_cell_max = 31;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_31){
                    data_convert.position_vol_cell_min = 31;
                }
            } else { data_convert.vol_cell_31 = 0}
            if(data_convert.num_of_cell > 31) {
                if(data_convert.vol_cell_max == data_convert.vol_cell_32){
                    data_convert.position_vol_cell_max = 32;
                }
                if(data_convert.vol_cell_min == data_convert.vol_cell_32){
                    data_convert.position_vol_cell_min = 32;
                }
            } else { data_convert.vol_cell_32 = 0}

            dispatch(add_data_convert(data_convert));
        } catch (e){
            console.log("Convert data error: " + e);
        }
    }
}

const getData = (datas) => {
    return datas.slice(3, datas.length - 2);
}

function formatDiagnostic (diagnostic) {
    return new Promise(async (resolve, reject) => {
        var diagnosticList = [];
        var isProtect = false;
        for (index = 0; index < packStatus.length; index++) {
            if (((diagnostic >> index) & 1) == 1) {
                isProtect = true;
                diagnosticList = addArray(diagnosticList, {diagnostic: diagnostic, diagnosticTypes: packStatus[index], isProtect: true});
            }
        }

        resolve(diagnosticList);
    })
}

const addArray = (old_array, new_item) => {
    return old_array.concat(new_item);
}