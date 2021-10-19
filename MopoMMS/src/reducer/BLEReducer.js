export class model_data_convert {
    total_voltage = 53.3;
    current = 0;
    soc = 99;
    soh = 100;
    cycle_count = 774;
    run_time = 0;
    mosfet_state = true;
    temp_sensor_1 = 30;
    temp_sensor_2 = 30;
    temp_sensor_3 = 32;
    temp_sensor_4 = 34;
    temp_sensor_5 = -128;
    temp_sensor_6 = -128;
    temp_sensor_7 = -128;
    temp_max = 34;
    temp_min = 30;
    diagnostic = [];
    reserve = '';
    protect = 0;
    alarm = 0;
    pack_status = 12;
    num_of_cell = 12;
    vol_cell_max = 3335;
    position_vol_cell_max = 1;
    vol_cell_min = 3333;
    position_vol_cell_min = 11;
    vol_cell_deff = 2;
    vol_cell_1 = 3335;
    vol_cell_2 = 3334;
    vol_cell_3 = 3334;
    vol_cell_4 = 3334;
    vol_cell_5 = 3334;
    vol_cell_6 = 3334;
    vol_cell_7 = 3334;
    vol_cell_8 = 3334;
    vol_cell_9 = 3334;
    vol_cell_10 = 3334;
    vol_cell_11 = 3333;
    vol_cell_12 = 3334;
    vol_cell_13 = 0;
    vol_cell_14 = 0;
    vol_cell_15 = 0;
    vol_cell_16 = 0;
    vol_cell_17 = 0;
    vol_cell_18 = 0;
    vol_cell_19 = 0;
    vol_cell_20 = 0;
    vol_cell_21 = 0;
    vol_cell_22 = 0;
    vol_cell_23 = 0;
    vol_cell_24 = 0;
    vol_cell_25 = 0;
    vol_cell_26 = 0;
    vol_cell_27 = 0;
    vol_cell_28 = 0;
    vol_cell_29 = 0;
    vol_cell_30 = 0;
    vol_cell_31 = 0;
    vol_cell_32 = 0;
    fcc = 100;
    rc = 99;
}

const model = {
    statusBle: 0,
    itemList: [
        {name: "AXEBMS00022-BLE", id: "47:71:F5:01:00:16"},
        {name: "AXEBMS00183-BLE", id: "47:71:F5:01:00:B7"},
        {name: "MOPOBMS_202008280000000", id: "CC:7C:DC:D8:41:C6"},
    ],
    deviceConnected: {id: "47:71:F5:01:00:16", mac: "47:71:F5:01:00:16"},
    checkSume: false,
    dataResponse: [],
    dataConvert: new model_data_convert(),
    servicesBle:{},
};
  
const BLEReducer = (state = model, action) => {
    switch (action.type) {
        case 'SET_STATUS_BLE':
            state = { 
                ...state, 
                statusBle: action.statusBle
            }
            break;    
        case 'ADD_ITEM':
            state = { 
                ...state, 
                itemList: [...state.itemList, action.device]
            }
            break;
        case 'UPDATE_LIST_ITEM':
            state = { 
                ...state, 
                itemList: action.itemList
            }
            break;
        case 'CLEAR_LIST_ITEM':
            state = { 
                ...state, 
                itemList: []
            }
            break;
        case 'ADD_DEVICE_CONNECTED':
            state = { 
                ...state, 
                deviceConnected: action.device
            }
            break;
        case 'CLEAR_DEVICE_CONNECTED':
            state = { 
                ...state, 
                deviceConnected: {}
            }
            break;
        case 'SET_CHECK_SUME':
            state = { 
                ...state, 
                checkSume: action.checkSume
            }
            break;  
        case 'DATA_RESPONSE':
            state = { 
                ...state, 
                dataResponse: action.data
            }
            break;
        case 'ADD_DATA_CONVERT':
            state = { 
                ...state, 
                dataConvert: action.data
            }
            break;
        case 'SET_SERVICES_BLE':
            state = { 
                ...state, 
                servicesBle: action.servicesBle
            }
            break; 
    }
    return state;
};

export default BLEReducer;