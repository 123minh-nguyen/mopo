import ValueStrings from '../utils/Strings'
import {getDate, getNumberToDate, getIdByDateTime} from '../utils/utilConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setAsyncStorage} from '../utils/AsyncStorageModel'
import {add_data_convert} from './actions'

export const set_quik_app = (isQuikApp) => ({
  type: 'SET_QUIK_APP',
  isQuikApp: isQuikApp
})

export const set_page_screen = (pageScreen) => ({
    type: 'SET_PAGE_SGREEN',
    pageScreen: pageScreen
})

export const styleAlerAction = (styleAler) => ({
    type: 'SET_STYLE_ALER',
    styleAler: styleAler
})

export const setMsgOld = (msgOld) => ({
    type: 'SET_MSG_OLD',
    msgOld: msgOld
})

export const addAccountInfo = (accountInfo) => ({
    type: 'SET_ACCOUNT_INFO',
    accountInfo: accountInfo
})

export const add_list_notify = (listNotify) => ({
    type: 'ADD_LIST_NOTIFY',
    listNotify: listNotify
})
  
export const update_list_notify = (listNotify) => ({
    type: 'UPDATE_LIST_NOTIFY',
    listNotify: listNotify
})

export const update_date_state = (updateDataState) => ({
    type: 'UPDATE_DATA_STATE',
    updateDataState: updateDataState
})

//////////////////////////

export const addListPackStyle = (listPackStyle) => ({
    type: 'ADD_LIST_PACK_STYLE',
    listPackStyle: listPackStyle
})

export const updateListPackStyle = (listPackStyle) => ({
    type: 'UPDATE_LIST_PACK_STYLE',
    listPackStyle: listPackStyle
})

export const setSwithOnOff = (swithOnOff) => ({
    type: 'SET_SWITH_ON_OFF',
    swithOnOff: swithOnOff
})

export const addListMacSave = (listMacSave) => ({
    type: 'ADD_LIST_MAC_SAVE',
    listMacSave: listMacSave
})

export const setMultiBMS = (isMultiBMS) => ({
  type: 'SET_MULTI_BMS',
  isMultiBMS: isMultiBMS
})

export const setStyleBMS = (styleBMS) => ({
  type: 'SET_STYLE_BMS',
  styleBMS: styleBMS
})

export const setProtectPack = (protectPack) => ({
  type: 'SET_PROTECT_PACK',
  protectPack: protectPack
})
  
export const setStyleAlerAction = (styleAler, message) => {
    return (dispatch, getState) => {
    dispatch(styleAlerAction({styleShowAler: styleAler, message: message}));
    };
};
  
export const setCloseAlerAction = () => {
    return (dispatch, getState, DeviceManager) => {
    dispatch(styleAlerAction({styleShowAler: '', message: ''}));
    };
};
 
// type_msg: 1 => warning; other => error
export const addListNotify = (type_msg, title, message) => {
    return (dispatch, getState) => {

        var listNotify = getState().Home.listNotify;

        listNotify.push({
            id: getIdByDateTime(),
            read: false,
            type_msg: type_msg,
            title: title,
            message: message,
            time: getDate(),
            macs: getState().Home.isMultiBMS ? JSON.stringify(getState().MultiBMS.listMac) : JSON.stringify(getState().Ble.deviceConnected.mac)
        })

        dispatch(update_list_notify(listNotify.sort((a, b) => a.id < b.id)));
        AsyncStorage.setItem(ValueStrings.key_notification + getState().Home.accountInfo.UserID, JSON.stringify(listNotify));
    }
}
  
function getUnique(arr, index) {
    const unique = arr.map(e => e[index]).map((e, i, final) => final.indexOf(e) === i && i).filter(e => arr[e]).map(e => arr[e]);      
    return unique;
}
  
export const updateListNotify = (id_user) => {
    return (dispatch, getState) => {
        var listNotify = getState().Home.listNotify.filter(el => getNumberToDate(el.time.substring(0, 10)) < 31).sort((a, b) => a.id < b.id);
        listNotify = getUnique(listNotify, 'id');
        if(listNotify == null || listNotify == undefined || listNotify.length == 0){
            try {
                AsyncStorage.getItem(ValueStrings.key_notification + id_user).then((value) => {
                    if(value === null){
                        return null;
                    } else {
                        listNotify = JSON.parse(value).filter(el => getNumberToDate(el.time.substring(0, 10)) < 31);
                        dispatch(update_list_notify(listNotify));
                        AsyncStorage.setItem(ValueStrings.key_notification + id_user, JSON.stringify(listNotify));
                    }
                }).catch(e => {
                    return e;
                });
            } catch (error) {
                return null;
            }
        }
    }
}
  
export const updateReadListNotify = () => {
    return (dispatch, getState) => {
        var listNotify = getState().Home.listNotify;
        for(i = 0; i < listNotify.length; i++){
            listNotify[i] = {...listNotify[i], 
                read: true,
            };
        }
        dispatch(update_list_notify(listNotify));
        AsyncStorage.setItem(ValueStrings.key_notification + getState().Home.accountInfo.UserID, JSON.stringify(listNotify));
    }
}

/////////////////////////////////
const chectItemList = (listData, val) => {
    return listData.some(el => el.id === val);
}

export const setListPackStyle = (name, mac, id, charSwithOnOff, disSwithOnOff, rsoc, totalVoltage, current, tempList, remaindPower, nominalPower, cycleTimes, protectionStateList) => {
    return (dispatch, getState) => {
        let listPackStyle = getState().Home.listPackStyle;
        if(listPackStyle !== null){
            if(chectItemList(listPackStyle, id)){
                let index = listPackStyle.findIndex(el => el.id === id);
                listPackStyle[index] = {...listPackStyle[index], 
                    id: id,
                    name: name,
                    mac: mac, 
                    charSwithOnOff: charSwithOnOff,
                    disSwithOnOff: disSwithOnOff,
                    rsoc: rsoc,
                    totalVoltage: totalVoltage,
                    current: current,
                    tempList: tempList,
                    remaindPower: remaindPower,
                    nominalPower: nominalPower,
                    cycleTimes: cycleTimes,
                    protectionStateList: protectionStateList,
                };
                dispatch(updateListPackStyle(listPackStyle))
            } else {
              dispatch(addListPackStyle({
                  id: id,
                  name: name,
                  mac: mac,
                  charSwithOnOff: charSwithOnOff,
                  disSwithOnOff: disSwithOnOff,
                  rsoc: rsoc,
                  totalVoltage: totalVoltage,
                  current: current,
                  tempList: tempList,
                  remaindPower: remaindPower,
                  nominalPower: nominalPower,
                  cycleTimes: cycleTimes,
                  protectionStateList: protectionStateList,
              }))
            }
        }
    };
};

export const clearListPackStyle = () => {
  return (dispatch, getState) => {
    dispatch(updateListPackStyle([]))
  }
}

export const updateSwithOnOff = () => {
    return (dispatch, getState) => {
        let listPackStyle = getState().Home.listPackStyle;
        var data_convert = getState().Ble.dataConvert;
        if(listPackStyle != null && listPackStyle.length > 0){
          let swithOn = listPackStyle.filter(e => e.disSwithOnOff == true);
          if(listPackStyle.length == swithOn.length){
            data_convert.mosfet_state = true;
            dispatch(setSwithOnOff(true));
          } else {
            data_convert.mosfet_state = false;
            dispatch(setSwithOnOff(false));
          }
          dispatch(add_data_convert(data_convert));
          if(getState().Home.styleAler.message === ValueStrings.connecting){
            dispatch(setCloseAlerAction());
          }
        }
    }
}

export const checkSwithOnOff = (listDevice) => {
  return (dispatch, getState) => {
    setTimeout(() => {
      if(!getState().Home.swithOnOff){
        listDevice.forEach(item => {
          dispatch(sendData(item.id, [-35,90,-31,2,0,2,-1,27,119]));
        });
        dispatch(setStyleAlerAction(ValueStrings.warning, ValueStrings.can_not_turn_on_device))
      }
    }, 5000);
  }
}

export const setListMacSave = (key) => {
  return (dispatch, getState) => {
    try {
      AsyncStorage.getItem(key).then((value) => {
        if(value === null){
          let list = JSON.stringify([
            {id: 1, title: '...', mac: '...'},
            {id: 2, title: '...', mac: '...'},
            {id: 3, title: '...', mac: '...'},
            {id: 4, title: '...', mac: '...'},
            {id: 5, title: '...', mac: '...'},
            {id: 6, title: '...', mac: '...'},
            {id: 7, title: '...', mac: '...'},
            {id: 8, title: '...', mac: '...'},
            {id: 9, title: '...', mac: '...'},
            {id: 10, title: '...', mac: '...'},
          ])
          dispatch(saveListMac(list))
        } else {
          dispatch(addListMacSave(value))
        }
      });
    } catch (error) {
      
    }
  }
}

export const saveListMac = (list) => {
  return (dispatch, getState) => {
    setAsyncStorage(ValueStrings.list_mac_save, list)
    dispatch(addListMacSave(list))
  }
}

export const updateListMac = (obj) => {
  return (dispatch, getState) => {
    let listMacSave = JSON.parse(getState().Home.listMacSave);
    let index = listMacSave.findIndex(el => el.id === obj.id);
    listMacSave[index] = {...listMacSave[index], 
        title: obj.title,
        mac: obj.mac,
    };
    setAsyncStorage(ValueStrings.list_mac_save, JSON.stringify(listMacSave))
    dispatch(addListMacSave(JSON.stringify(listMacSave)))
  }
}