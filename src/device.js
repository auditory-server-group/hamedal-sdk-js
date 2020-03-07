var Transport = require('./transport')
var AIMode = require('./aiMode')

var FALCON_CAMERA_USB = {
    VID: 0x0525,
    PID: 0xa4ac,
    USAGE_PAGE: 0x0081,
    USAGE: 0x0082
}

var READ_TIMEOUT = 5000;//5s

var _aimode = new AIMode.AIMode();

function hamedalDevices() {
    return Transport.availableDevices();
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

module.exports = {
    FalconCamera: FalconCamera,
    //sendAndRecieve: sendAndRecieve
    devices: hamedalDevices
}

