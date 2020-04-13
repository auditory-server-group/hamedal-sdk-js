let CRC = require('crc');

const AWI_HMD_MAGIC = 0xffa5;
const AWI_HMD_VERSION_ALPHA = 0x0001;
const AWI_HMD_SRC_IDX = (1 << 0);
const AWI_HMD_MAGIC_OFFSET = 0;
const AWI_HMD_VERSION_OFFSET = AWI_HMD_MAGIC_OFFSET + 2;
const AWI_HMD_DST_OFFSET = AWI_HMD_VERSION_OFFSET + 2;
const AWI_HMD_SRC_OFFSET = AWI_HMD_DST_OFFSET + 2;
const AWI_HMD_CTL_OFFSET = AWI_HMD_SRC_OFFSET + 2;
const AWI_HMD_LEN_OFFSET = AWI_HMD_CTL_OFFSET + 2;
const AWI_HMD_CRC_OFFSET = AWI_HMD_LEN_OFFSET + 2;
const AWI_HMD_PAYLOAD_OFFSET = AWI_HMD_CRC_OFFSET + 2;
const AWI_HMD_HEADER_DEFAULT_SIZE = AWI_HMD_PAYLOAD_OFFSET;

const AWI_HMD_ENABLE_FULL_VIEW_FLAG = 0x0;
const AWI_HMD_ENABLE_AI_VIEW_FLAG = 0x1;

const AWI_HMD_SET_VIDEO_MODE_CTRL = 0x0021;
const AWI_HMD_SET_VIDEO_MODE_RESP = 0x00a1;
const AWI_HMD_GET_VIDEO_MODE_CTRL = 0x0022;
const AWI_HMD_GET_VIDEO_MODE_RESP = 0x00a2;
const AWI_HMD_GET_BODY_COUNT_CTRL = 0x0023;
const AWI_HMD_GET_BODY_COUNT_RESP = 0x00a3;

const AWI_FALCON_DEVICE_INFO_REQ_CODE = 0x0003;
const AWI_FALCON_DEVICE_INFO_RSP_CODE = 0x0083;

const AWI_DOLPHIN_RESET_REQ_CODE = 0x0001;
const AWI_DOLPHIN_RESET_RSP_CODE = 0x0081;
const AWI_DOLPHIN_DEVICE_INFO_REQ_CODE = 0x0002;
const AWI_DOLPHIN_DEVICE_INFO_RSP_CODE = 0x0082;
const AWI_DOLPHIN_UNKNOWN_CODE = 0xFFFF;

function encap(dst, ctrl, payload) {
    var length = payload.length;
    var buf = Buffer.alloc(AWI_HMD_HEADER_DEFAULT_SIZE + length);
    var magic = AWI_HMD_MAGIC;
    var version = AWI_HMD_VERSION_ALPHA;
    var dst = dst;
    var src = AWI_HMD_SRC_IDX;
    var ctl = ctrl;
    var len = length;
    var crc = 0;
    buf.writeUInt16BE(magic, AWI_HMD_MAGIC_OFFSET);
    buf.writeUInt16BE(version, AWI_HMD_VERSION_OFFSET);
    buf.writeUInt16BE(dst, AWI_HMD_DST_OFFSET);
    buf.writeUInt16BE(src, AWI_HMD_SRC_OFFSET);
    buf.writeUInt16BE(ctl, AWI_HMD_CTL_OFFSET);
    buf.writeUInt16BE(len, AWI_HMD_LEN_OFFSET);
    buf.writeUInt16BE(crc, AWI_HMD_CRC_OFFSET);
    //将payload内容拷贝到buf从
    if (length > 0) {
        payload.copy(buf, AWI_HMD_PAYLOAD_OFFSET, 0, length);
    }

    crc = CRC.crc16xmodem(buf);
    buf.writeUInt16BE(crc, AWI_HMD_CRC_OFFSET);
    return buf
}

function parse(reply) {
    if (reply.length < AWI_HMD_HEADER_DEFAULT_SIZE) {
        return false;
    }

    var len = reply.readInt16BE(AWI_HMD_LEN_OFFSET);
    if (reply.length < len + AWI_HMD_HEADER_DEFAULT_SIZE) {
        return false;
    }

    var crc = reply.readUInt16BE(AWI_HMD_CRC_OFFSET);
    reply.writeInt16BE(0, AWI_HMD_CRC_OFFSET);

    var exp_crc = CRC.crc16xmodem(reply.slice(0, AWI_HMD_PAYLOAD_OFFSET + len));
    if (crc != exp_crc) {
        return false;
    }

    var resp_ctrl = reply.readInt16BE(AWI_HMD_CTL_OFFSET);

    var payload = reply.slice(AWI_HMD_PAYLOAD_OFFSET, AWI_HMD_PAYLOAD_OFFSET + len);

    return {ctrl: resp_ctrl, payload: payload};
}


module.exports = {
    AWI_HMD_ENABLE_FULL_VIEW_FLAG: AWI_HMD_ENABLE_FULL_VIEW_FLAG,
    AWI_HMD_ENABLE_AI_VIEW_FLAG: AWI_HMD_ENABLE_AI_VIEW_FLAG,

    AWI_HMD_SET_VIDEO_MODE_CTRL: AWI_HMD_SET_VIDEO_MODE_CTRL,
    AWI_HMD_SET_VIDEO_MODE_RESP: AWI_HMD_SET_VIDEO_MODE_RESP,
    AWI_HMD_GET_VIDEO_MODE_CTRL: AWI_HMD_GET_VIDEO_MODE_CTRL,
    AWI_HMD_GET_VIDEO_MODE_RESP: AWI_HMD_GET_VIDEO_MODE_RESP,
    AWI_HMD_GET_BODY_COUNT_CTRL: AWI_HMD_GET_BODY_COUNT_CTRL,
    AWI_HMD_GET_BODY_COUNT_RESP: AWI_HMD_GET_BODY_COUNT_RESP,

    AWI_FALCON_DEVICE_INFO_REQ_CODE: AWI_FALCON_DEVICE_INFO_REQ_CODE,
    AWI_FALCON_DEVICE_INFO_RSP_CODE: AWI_FALCON_DEVICE_INFO_RSP_CODE,

    AWI_DOLPHIN_RESET_REQ_CODE: AWI_DOLPHIN_RESET_REQ_CODE,
    AWI_DOLPHIN_RESET_RSP_CODE: AWI_DOLPHIN_RESET_RSP_CODE,
    AWI_DOLPHIN_DEVICE_INFO_REQ_CODE: AWI_DOLPHIN_DEVICE_INFO_REQ_CODE,
    AWI_DOLPHIN_DEVICE_INFO_RSP_CODE: AWI_DOLPHIN_DEVICE_INFO_RSP_CODE,
    AWI_DOLPHIN_UNKNOWN_CODE: AWI_DOLPHIN_UNKNOWN_CODE,

    encap: encap,
    parse: parse
}


