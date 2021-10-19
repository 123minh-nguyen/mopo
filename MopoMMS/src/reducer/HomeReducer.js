const model = {
    isQuikApp: false,
    pageScreen: 1,
    accountInfo: {},
    styleAler: {
        styleShowAler: '',
        message: '',
    },
    msgOld: '',
    listNotify: [],
    updateDataState: false,
    styleBMS: '',
    protectPack: {
        vol_difference_potect: false,
        under_voltage: false,
        over_or_under_tem: false,
        system_error_auto_return: false,
        ic_font_end_error: false,
    }, 
    listPackStyle: [],
    swithOnOff: false,
    listMacSave: '',
    isMultiBMS: false,
}

const HomeReducer = (state = model, action) => {
    switch (action.type) {
        case 'SET_QUIK_APP':
            state = { 
                ...state, 
                isQuikApp: action.isQuikApp
            }
            break;
        case 'SET_PAGE_SGREEN':
            state = { 
                ...state, 
                pageScreen: action.pageScreen
            }
            break;
        case 'SET_ACCOUNT_INFO':
            state = { 
                ...state, 
                accountInfo: action.accountInfo
            }
            break;
        case 'SET_STYLE_ALER':
            state = { 
                ...state, 
                styleAler: action.styleAler
            }
            break;
        case 'SET_MSG_OLD':
            state = { 
                ...state, 
                msgOld: action.msgOld
            }
            break;
        case 'ADD_LIST_NOTIFY':
            state = { 
                ...state, 
                listNotify: [...state.listNotify, action.listNotify]
            }
            break;
        case 'UPDATE_LIST_NOTIFY':
            state = { 
                ...state, 
                listNotify: action.listNotify
            }
            break;  
        case 'UPDATE_DATA_STATE':
            state = { 
                ...state, 
                updateDataState: action.updateDataState
            }
            break;
        case 'SET_PROTECT_PACK':
            state = { 
                ...state, 
                protectPack: action.protectPack
            }
            break;
        case 'ADD_LIST_PACK_STYLE':
            state = { 
                ...state, 
                listPackStyle: [...state.listPackStyle, action.listPackStyle]
            }
            break;
        case 'UPDATE_LIST_PACK_STYLE':
            state = { 
                ...state, 
                listPackStyle: action.listPackStyle
            }
            break;
        case 'SET_SWITH_ON_OFF':
            state = { 
                ...state, 
                swithOnOff: action.swithOnOff
            }
            break;
        case 'ADD_LIST_MAC_SAVE':
            state = { 
                ...state, 
                listMacSave: action.listMacSave
            }
            break;
        case 'SET_MULTI_BMS':
            state = {
                ...state, 
                isMultiBMS: action.isMultiBMS
            }
        case 'SET_STYLE_BMS':
            state = {
                ...state, 
                styleBMS: action.styleBMS
            }
    }
    return state;
};

export default HomeReducer;