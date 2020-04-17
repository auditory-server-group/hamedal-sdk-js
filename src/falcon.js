var Transport = require('./transport')
var AIMode = require('./aiMode')
var Protocol = require('./protocol')

var FALCON_CAMERA_USB = {
    VID: 0x0525,
    PID: 0xa4ac,
    USAGE_PAGE: 0x0081,
    USAGE: 0x0082
}

var READ_TIMEOUT = 5000;//5s

var _aimode = new AIMode.AIMode();
var _protocol = new Protocol.Protocol();

function falconDevices() {
    return Transport.availableDevices(
        FALCON_CAMERA_USB.VID,
        FALCON_CAMERA_USB.PID,
        FALCON_CAMERA_USB.USAGE_PAGE,
        FALCON_CAMERA_USB.USAGE);
}

var FalconCamera = function (deviceInfo) {
    this._deviceInfo = deviceInfo;
    this._transport = new Transport.Transport(deviceInfo);
    this._sendAndRecieve = async function sendAndRecieve(message, timeout) {
        try {
            this._transport.sendMsg(message);
        } catch (e) {
            console.log(e);
        }
        var reply = await this._transport.asyncReadMsgTimeout(timeout);
        return reply;
    };
}

FalconCamera.prototype.close = function close() {
    this._transport.close();
}


/**
 * Get Device AI Mode is enabled
 *
 * @parameters  {*}
 * @return  boolean {enabled} Returns a boolean value which to true if aimode is enabled
 * false if disabled.
 */
FalconCamera.prototype.isAIModeEnabled = async function getVideoMode() {
    var pack = _aimode.getStatus();
    var reply = await this._sendAndRecieve(pack, READ_TIMEOUT);

    return new Promise( (resolve, reject) => {
        var result = AIMode.onRcv(Buffer.from(reply));
        if (result == 1 || result == 0) {
            resolve(result);
        } else {
            reject('Unknown status');
        }
    });
}

/**
 * Enables the aimode feature persistently.
 *
 * @param {*}
 * @returns {boolean value} true if set succefully and false if set failed;
 */
FalconCamera.prototype.enableAIMode = async function enableAIMode() {
    var pack = _aimode.enable();
    var reply = await this._sendAndRecieve(pack, READ_TIMEOUT);

    return new Promise( (resolve, reject) => {
        var result = AIMode.onRcv(Buffer.from(reply));
        if (result == 1) {
            resolve('Set falcon ai-mode enabled successfully.');
        } else {
            reject('Set falcon ai-mode enabled successfully.');
        }
    });
}

/**
 * Disables the aimode feature persistently.
 *
 * @param {*}
 * @returns boolean{value} true if set succefully and false if set failed;
 */
FalconCamera.prototype.disableAIMode = async function disableAIMode() {
    var pack = _aimode.disable();
    var reply = await this._sendAndRecieve(pack, READ_TIMEOUT);

    return new Promise( (resolve, reject) => {
        var result = AIMode.onRcv(Buffer.from(reply));
        if (result == 0) {
            resolve('Set falcon ai-mode disabled successfully.');
        } else {
            reject('Set falcon ai-mode disabled failed.');
        }
    });
}

/**
 * Get the people count from the camera
 *
 * @param {*}
 * @returns int32{result} if value < 0 means get failed and if value > 0 represent the people count
 */
FalconCamera.prototype.getBodyCount = async function getBodyCount() {
    var pack = _aimode.bodyCount();
    var reply = await this._sendAndRecieve(pack, READ_TIMEOUT);
    // var result = AIMode.onRcv(Buffer.from(reply));
    // return result;
    return new Promise(function (resolve, reject) {
        var result = AIMode.onRcv(Buffer.from(reply));
        if (result >= 0) {
            resolve(result);
        } else {
            reject('Wrong people count!');
        }
    });
}

FalconCamera.prototype.getDeviceInfo = async function getDeviceInfo(){
    var pack = _protocol.falconDeviceInfo();
    var reply = await this._sendAndRecieve(pack, READ_TIMEOUT);
    return new Promise(function (resolve, reject) {
        var result = Protocol.onRcv(Buffer.from(reply));
        if (result != false){
            resolve(result);
        }else {
            reject('wrong respond');
        }
    })
}

FalconCamera.prototype.parseDevInfoPayload = function parseFalconDevInfo(payload) {
    var sn = 'invalid';
    var sw = 'invalid';
    var pn = 'invalid';
    //product name
    pn = payload.toString('utf8', 0, 32);
    //software version
    sw = payload.toString('utf8', 32, 64);
    ii = sw.indexOf('\0');
    iv = sw.indexOf('V');
    ir = sw.indexOf('R');
    if (ir < 0) {
        ir = sw.indexOf('B');
    }
    if (ir < 0) {
        ir = sw.indexOf('L');
    }
    sw = sw.substr(iv + 1, ir - 2);
    //serial number
    sn = payload.toString('utf8', 64, 96);
    ii = sn.indexOf('\0');
    sn = sn.substr(0, ii);
    return {pn, sw, sn};
}

module.exports = {
    FalconCamera: FalconCamera,
    //sendAndRecieve: sendAndRecieve
    devices: falconDevices
}

