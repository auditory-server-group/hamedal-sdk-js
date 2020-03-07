var MessagePacket = require('./message')
var Device = require('./device')

function AIMode() {

}

AIMode.prototype.enable =  function packAIModeCtrl() {
    var payload = Buffer.alloc(4);
    payload.writeUInt32BE(MessagePacket.AWI_HMD_ENABLE_AI_VIEW_FLAG);
    var pack = MessagePacket.encap(1 << 1, MessagePacket.AWI_HMD_SET_VIDEO_MODE_CTRL, payload);
    //console.log('pack:', pack);
    return pack;
}

AIMode.prototype.disable = function packFVModeCtrl() {
    var payload = Buffer.alloc(4);
    payload.writeUInt32BE(MessagePacket.AWI_HMD_ENABLE_FULL_VIEW_FLAG);
    var pack = MessagePacket.encap(1 << 1, MessagePacket.AWI_HMD_SET_VIDEO_MODE_CTRL, payload);
    //console.log('pack:', pack);
    return pack;
}

AIMode.prototype.getStatus = function packGetVideoModeCtrl() {
    var pack = MessagePacket.encap(1 << 1, MessagePacket.AWI_HMD_GET_VIDEO_MODE_CTRL, []);
    //console.log('pack:', pack);
    return pack;
}

AIMode.prototype.bodyCount = function packBodyCountCtrl() {
    var pack = MessagePacket.encap(1 << 1, MessagePacket.AWI_HMD_GET_BODY_COUNT_CTRL, []);
    //console.log('pack:', pack);
    return pack;
}

//AIMode.prototype.onRcv =
function onRcv(buf) {
    var result = MessagePacket.parse(buf);
    if (result == false) {
        return false;
    }
    //console.log("ctrl:", result.ctrl, "payload:", result.payload.readUInt32BE());
    var value = result.payload.readUInt32BE();
    switch (result.ctrl) {
        case MessagePacket.AWI_HMD_SET_VIDEO_MODE_RESP:
            break;
        case MessagePacket.AWI_HMD_GET_VIDEO_MODE_RESP:
            break;
        case MessagePacket.AWI_HMD_GET_BODY_COUNT_RESP:
            break;
        default:
            break;
    }
    return result.payload.readUInt32BE();
}



module.exports = {
    AIMode: AIMode,
    onRcv: onRcv
}