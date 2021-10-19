import {addArray} from '../utilConfig'

export class BMSCommandEntity {
    CMD_END = 119;
    CMD_START = -35;
    READ_MODE = 165;
    WRITE_MODE = 90;
    cmd = '';
    cmdApi = [];
    cmdApiString = '';
    cmdContent = [];
    contentLength = 0;
    rwMode = 0;
    
    constructor(cmd, cmdContent, rwMode){
        this.cmd = cmd;
        this.cmdContent = cmdContent;
        this.contentLength = cmdContent.length;
        this.rwMode = rwMode;
        this.cmdApi = this.calCmdApi();
    }

    setContent(con) {
        this.cmdContent = con;
        this.contentLength = this.cmdContent.length;
        this.cmdApi = this.calCmdApi();
    }

    calCmdApi() {
        console.log("Log" + JSON.stringify(this.checkSum(this.cmd, this.cmdContent, this.contentLength)));
        var api = [];
        api[0] = this.CMD_START;
        api[1] = this.rwMode;
        api[2] = this.cmd;
        api[3] = this.contentLength;
        api = addArray(api, this.cmdContent);
        api = addArray(api, this.checkSum(this.cmd, this.cmdContent, this.contentLength));
        api[api.length] = this.CMD_END;
        return api;
    }

    checkSum(command, con, cLen) {
        var sum = 0;
        con.forEach(b => {
            sum += b & 255;
        })
        var sumByte = this.intToByteArray(((sum + ((cLen + command) & 255)) ^ -1) + 1);
        var hByte = sumByte[sumByte.length - 2];
        var lByte = sumByte[sumByte.length - 1];
        return [hByte, lByte];
    }

    intToByteArray(a) {
        return [((a >> 24) & 255), ((a >> 16) & 255), ((a >> 8) & 255), (a & 255)];
    }
}

