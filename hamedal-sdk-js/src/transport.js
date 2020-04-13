var os = require('os');
var HID = require('node-hid')

function HidDevice(vid, pid, usagePage, usage) {
    var devices = HID.devices();
    var deviceInfo = devices.find(function (d) {
        var isTeensy = d.vendorId === vid && d.productId === pid;
        return isTeensy && d.usagePage === usagePage && d.usage === usage;
    });
    if (deviceInfo) {
        console.log('devices:', deviceInfo);
        var device = new HID.HID(deviceInfo.path);
    }
    return device;
}

function availableDevices(vid, pid, usagePage, usage) {
    var devices = HID.devices();
    //console.log(devices);
    var availables = [];
    for (i = 0; i < devices.length; i++) {
        let deviceInfo = devices[i];
        if (deviceInfo.vendorId == vid && deviceInfo.productId == pid && deviceInfo.usage == usage) {
            availables.push(deviceInfo);
        }
    }
    return availables;
}

function Transport(deviceInfo) {
    if (!deviceInfo){
        console.log("Could not find RawHID device in device list");
        //throw new Error("Device can't be found!");
    }
    this._device = new HID.HID(deviceInfo.path);
}

Transport.prototype.sendMsg = function sendMsg(message) {
    if (this._device._closed) {
        //exception process
    } else {
        if (os.platform() == 'win32') {
            var dataSend = Buffer.alloc(1);
            return this._device.write(Buffer.concat([dataSend, message], message.length + 1));
        }
        return this._device.write(message);
    }
}


Transport.prototype.readMsg = function readMsg(callback) {
    this._device.read(callback);
}

Transport.prototype.readMsgTimout = function readMsgTimeout(timeout) {
    if (this._device._closed) {
        //exception process
    } else {
        return this._device.readTimeout(timeout);
    }
}

Transport.prototype.asyncReadMsgTimeout = async function asyncReadMsgTimeout(timeout){
    var reply = this._device.readTimeout(timeout);
    return new Promise(function (resolve,reject) {
        if (reply.length <= 0){
            reject('Read hid data timeout');
        }else {
            resolve(reply);
        }
    });
}

Transport.prototype.close = function close() {
    if (!this._device._closed) {
        this._device.close();
    }
}

// Transport.prototype.on = async function on(data_callback, err_callback) {
//     if (this._device._closed) {
//         //exception process
//     } else {
//         await this._device.on('data', data_callback);
//         await this._device.on('err', err_callback);
//     }
// }

module.exports = {
    Transport: Transport,
    availableDevices:availableDevices
}