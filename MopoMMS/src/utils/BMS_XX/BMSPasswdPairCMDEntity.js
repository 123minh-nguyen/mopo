import {BMSCommandEntity} from './BMSCommandEntity'
import {addArray, intStrToBytes} from '../utilConfig'

class BMSPasswdPairCMDEntity extends BMSCommandEntity {

    constructor() {
        super(6, [], 90);
    }

    setPasswd(passwd) {
        len = passwd.length;
        contentBytes = [];
        contentBytes[0] = len;
        contentBytes = addArray(contentBytes, intStrToBytes(passwd))
        this.setContent(contentBytes);
    }

    getCmdApi(){
        return this.cmdApi;
    }
}

 export default BMSPasswdPairCMDEntity;