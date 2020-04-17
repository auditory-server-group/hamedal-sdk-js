var MessagePacket = require('./message')

function Protocol() {

}

Protocol.prototype.dolphinDeviceInfo = function packDolphinDeviceInfoFetchCtrl() {
    var pack = MessagePacket.encap(0xffff, MessagePacket.AWI_DOLPHIN_DEVICE_INFO_REQ_CODE, []);
    return pack;
}


Protocol.prototype.dolphinDeviceReset = function packDolphinDeviceResetCtrl() {
    var pack = MessagePacket.encap(0xffff, MessagePacket.AWI_DOLPHIN_RESET_REQ_CODE, []);
    return pack;
}

Protocol.prototype.falconDeviceInfo = function packFalconDeviceInfoFetchCtrl() {
    var pack = MessagePacket.encap(1 << 1, MessagePacket.AWI_FALCON_DEVICE_INFO_REQ_CODE, []);
    return pack;
}

//AIMode.prototype.onRcv =
function onRcv(buf) {
    var result = MessagePacket.parse(buf);
    if (result == false) {
        return false;
    }
    //console.log("ctrl:", result.ctrl, "payload:", result.payload.readUInt32BE());
    //var value = result.payload.readUInt32BE();
    switch (result.ctrl) {
        case MessagePacket.AWI_DOLPHIN_DEVICE_INFO_RSP_CODE:
            return result.payload;
        case MessagePacket.AWI_DOLPHIN_RESET_RSP_CODE:
            return result.payload.readUInt32BE();
        case MessagePacket.AWI_FALCON_DEVICE_INFO_RSP_CODE:
            return result.payload;
        case MessagePacket.AWI_DOLPHIN_UNKNOWN_CODE:
        default:
            return false;
    }
    //return result.payload.readUInt32BE();
}

module.exports = {
    Protocol: Protocol,
    onRcv: onRcv
}