import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ValueStrings from './Strings'

export function setAsyncStorage (key, value){
    try {
        AsyncStorage.setItem(
            key,
            value
        );
        return true;
    } catch (error) {
        return false;
    }
}

export function getPreLogin(){
    try {
        AsyncStorage.getItem(ValueStrings.key_pre_login).then((value) => {
            if(value === null){
                return null;
            } else {
                return JSON.parse(value);
            }
        }).catch(e => {
            return e;
        });
    } catch (error) {
        return null;
    }
}
