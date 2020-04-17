var Transport = require('./transport')
var Protocol = require('./protocol')

var DOLPHIN_SPEAKER_PHONE = {
    VID: 0x1fc9,
    PID: 0x826b,
    USAGE_PAGE: 0x000b,
    USAGE: 0x0082
}

var READ_TIMEOUT = 5000;//5s

var _protocol = new Protocol.Protocol();

function dolphinDevices() {
    return Transport.availableDevices(
        DOLPHIN_SPEAKER_PHONE.VID,
        DOLPHIN_SPEAKER_PHONE.PID,
        DOLPHIN_SPEAKER_PHONE.USAGE_PAGE,
        DOLPHIN_SPEAKER_PHONE.USAGE);
}

var DolphinSpkPhone = function (deviceInfo) {
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

DolphinSpkPhone.prototype.close = function close() {
    this._transport.close();
}

/**
 * Get Device Info
 *
 * @parameters  {*}
 * @return
 */
DolphinSpkPhone.prototype.resetDevice = async function resetDevice() {
    var pack = _protocol.dolphinDeviceReset();
    var reply = await this._sendAndRecieve(pack, READ_TIMEOUT);

    return new Promise((resolve, reject) => {
        var result = _protocol.onRcv(Buffer.from(reply));
        if (result != false) {
            resolve(result);
        } else {
            reject('Unknown status');
        }
    });
}

/**
 * Get Device Info
 *
 * @parameters  {*}
 * @return
 */
DolphinSpkPhone.prototype.getDeviceInfo = async function getDeviceInfo() {
    var pack = _protocol.dolphinDeviceInfo();
    var reply = await this._sendAndRecieve(pack, READ_TIMEOUT);

    return new Promise((resolve, reject) => {
        var result = Protocol.onRcv(Buffer.from(reply));
        if (result != false) {
            resolve(result);
        } else {
            reject('Unknown status');
        }
    });
}

const PRODUCT_NAME_SHIFT = 0;
const PHY_VERSION_SHIFT = 1;
const SOFT_VERSION_SHIFT = 2;
const SERIAL_NUMBER_SHIFT = 3;
const UNIQUE_ID_SHIFT = 4;

DolphinSpkPhone.prototype.parseDevInfoPayload = function parseDolphinDevInfo(payload) {
    var dev_count = payload.readUInt16BE(0);
    if (dev_count > 5) {
        return false;
    }
    var pos = 2;
    var devs = [];
    var product_name = 'invalid';
    var phy_version = 'invalid';
    var soft_version = 'invalid';
    var serial_number = 'invalid';
    var unique_id = 'invalid';
    var i = 0, j = 0;
    for (i = 0; i < dev_count; i++) {
        var dev_type = payload.readUInt16BE(pos);
        pos += 2;
        var flag = payload.readUInt32BE(pos);
        pos += 4;
        for (j = 0; j < 32; j++) {
            if ((flag & (1 << j)) == 0) {
                continue;
            }
            let len = payload.readUInt8(pos);
            pos += 1;
            switch (j) {
                case PRODUCT_NAME_SHIFT: {
                    product_name = payload.toString('utf8', pos, pos + len);
                    break;
                }
                case PHY_VERSION_SHIFT: {
                    phy_version = payload.toString('utf8', pos, pos + len);
                    break;
                }
                case SOFT_VERSION_SHIFT: {
                    soft_version = payload.toString('utf8', pos, pos + len);
                    break;
                }
                case SERIAL_NUMBER_SHIFT: {
                    serial_number = payload.toString('utf8', pos, pos + len);
                    break;
                }
                case UNIQUE_ID_SHIFT: {
                    unique_id = payload.toString('utf8', pos, pos + len);
                    break;
                }
                default: {
                    break;
                }
            }
            pos += len;
        }
        let dev = {
            product_name: product_name,
            phy_version: phy_version,
            soft_version: soft_version,
            serial_number: serial_number,
            unique_id: unique_id
        }
        devs.push(dev);
    }
    return devs;
}

module.exports = {
    DolphinSpkPhone: DolphinSpkPhone,
    //sendAndRecieve: sendAndRecieve
    devices: dolphinDevices
}
