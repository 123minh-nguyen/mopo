const INIT_CRC32 = 0xAFC01B29;
const MIN_VALUE = 0x80000000;
const digits = "0123456789ABCDEF";

export function getCMDPasswordFromMac(byteData, mac){
    return new Promise(async (resolve, reject) => {
        try{
            if(byteData != null && mac != null){
                var cmdPassword = [];
                var pass = [];
                let password = getPasswordFromMAC(byteData.slice(4, byteData.length - 1), mac.substring(6));
                cmdPassword.push(125);
                cmdPassword.push(4);
                cmdPassword.push(85);
                for(i = 0; i < password.length; i += 2){
                    pass.push(parseInt((password[i] + password[i + 1]), 16));
                }
                for(i = 3; i > -1; i--){
                    cmdPassword.push(pass[i]);
                }
                cmdPassword.push(125);
                resolve(cmdPassword);
            }
        } catch (e){
            reject(e);
        }
    })
}

const getPasswordFromMAC = (byteData, mac) => {
    mac = mac.replace(/:/g, "").toUpperCase();
    let decimal = crc32Compute_U(byteData, 8, parseInt(mac, 16));
    return (decimal < 0 ? 1074791680 + decimal : decimal).toString(16).toUpperCase();
}

const crc32Compute_U = (pData_U, size_U, pCrc_U) => {
    var crc_U = ~pCrc_U;
    for(i_U = 0; compareUnsigned(i_U, size_U) < 0; i_U++) {
        crc_U = crc_U ^ toUnsignedInt(pData_U[i_U]);
        for(j_U = 8; compareUnsigned(j_U, 0) > 0; j_U--) {
            crc_U = crc_U >>> 1 ^ 0xEDB88320 & ((crc_U & 1) != 0 ? 0xFFFFFFFF : 0);
        }
    }
    return ~crc_U;
}

const compareUnsigned = (x, y) => {
    return compare(x + MIN_VALUE, y + MIN_VALUE);
}

const compare = (x, y) => {
    return (x < y) ? -1 : ((x == y) ? 0 : 1);
}

const toUnsignedInt = (val) =>{
    return val & 0xff;
}