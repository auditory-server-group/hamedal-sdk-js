var os = require('os');
var HID = require('node-hid')

function HidDevice(vid, pid, usagePage, usage) {
    var devices = HID.devices();
    //console.log(devices);
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


var device = HidDevice(  0x0526,
   0xa4ac,
    0x0081,
    0x0082 );
console.log(device);

if (!this._device) {
    console.log("Could not find RawHID device in device list");

}
