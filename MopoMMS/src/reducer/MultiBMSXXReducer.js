const model = {
    listMac: [],
    listDeviceScanning: [],
    deviceConnected: [],
    dataList: [],
    listDataConvert: [],
    total: { soc : 0, vol : 0, curent : 0, tem : 0, cycle: 0, mosfet: false},
};

const MultiBMSXXReducer = (state = model, action) => {
    switch (action.type) {
        case 'ADD_LIST_MAC':
            state = { 
                ...state, 
                listMac: action.mac
            }
            break;
        case 'CLEAR_LIST_MAC':
            state = { 
                ...state, 
                listMac: []
            }
            break;
        case 'ADD_LIST_ITEM':
            state = { 
                ...state, 
                listDeviceScanning: [...state.listDeviceScanning, action.device]
            }
            break;
        case 'CLEAR_LIST_ITEM':
            state = { 
                ...state, 
                listDeviceScanning: []
            }
            break;
        case 'ADD_DEVICE_CONNECTED':
            state = { 
                ...state, 
                deviceConnected: [...state.deviceConnected, action.device]
            }
            break;
        case 'CLEAR_DEVICE_CONNECTED':
            state = { 
                ...state, 
                deviceConnected: []
            }
            break;  
        case 'ADD_DATA_LIST':
            state = { 
                ...state, 
                dataList: [...state.dataList, action.data]
            }
            break;
        case 'UPDATE_DATA_LIST':
            state = { 
                ...state, 
                dataList: action.dataList
            }
            break;
        case 'CLEAR_DATA_LIST':
            state = { 
                ...state, 
                dataList: []
            }
            break;
        case 'ADD_LIST_DATA_CONVERT':
            state = { 
                ...state, 
                listDataConvert: [...state.listDataConvert, action.dataConvert]
            }
            break;
        case 'UPDATE_LIST_DATA_CONVERT':
            state = { 
                ...state, 
                listDataConvert: action.listDataConvert
            }
            break;
        case 'CLEAR_LIST_DATA_CONVERT':
            state = { 
                ...state, 
                listDataConvert: []
            }
            break;
        case 'ADD_TOTAL':
            state = { 
                ...state, 
                total: action.total
            }
            break;
        case 'CLEAR_TOTAL':
            state = { 
                ...state, 
                total: { soc : 0, vol : 0, curent : 0, tem : 0, cycle: 0, mosfet: false}
            }
            break;
    }
    return state;
};

export default MultiBMSXXReducer;