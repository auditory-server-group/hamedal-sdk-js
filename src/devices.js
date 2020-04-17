var falcon = require('./falcon')
var dolphin = require('./dolphin')

async function listFalconDevInfo() {
    let Camera = [];
    var cameras = falcon.devices();
    if (cameras.length == 0) {
        console.log('no falcon camera');
    } else {
        //console.log(cameras);
        //do sth
        for (i = 0; i < cameras.length; i++) {
            var camera = new falcon.FalconCamera(cameras[i]);
            try {
                var infoPayload = await camera.getDeviceInfo();
            } catch (e) {
                console.log(e);
            }
            let dev = camera.parseDevInfoPayload(infoPayload);
            let cameraInfo = {
                Brand: "Hamedal",
                InnerModel: "Falcon",
                OuterModel: "V20",
                SN: dev.sn,
                version: dev.sw,
                firmware: "Hamedal_V20"
            }
            Camera.push(cameraInfo);
            camera.close();
        }
    }
    return Camera;
}

async function listDolphinDevInfo() {
    let Audio = [];
    //枚举dophin设备
    var audios = dolphin.devices();
    if (audios.length == 0) {
        console.log('no dolphin speaker phone');
    } else {
        //console.log(audios)
        for (i = 0; i < audios.length; i++) {
            audio = new dolphin.DolphinSpkPhone(audios[i]);
            try {
                infoPayload = await audio.getDeviceInfo();
            } catch (e) {
                console.log(e)
            }
            var devs = audio.parseDevInfoPayload(infoPayload);
            //console.log(devs);
            if (devs.length == 1) {
                let audioInfo = {
                    Brand: "Hamedal",
                    InnerModel: "Dolphin",
                    OuterModel: "AW20 Pro",
                    SN: devs[0].serial_number,
                    version: devs[0].soft_version,
                    firmware: devs[0].phy_version
                }
                Audio.push(audioInfo);
            } else if (devs.length > 1) {
                let audioInfos = []
                for (j = 0; j < devs.length; j++) {
                    let audioInfo = {
                        Brand: "Hamedal",
                        InnerModel: "Dolphin",
                        OuterModel: "AW20 Pro",
                        SN: devs[j].serial_number,
                        version: devs[j].soft_version,
                        firmware: devs[j].phy_version
                    }
                    audioInfos.push(audioInfo);
                }
                Audio.push(audioInfos);
            } else {
            }
            audio.close();
        }
    }
    return Audio;
}

async function enableFalconCameraAIMode(sn, enable) {
    //console.log(request.query.sn);
    //console.log(request.query.enable);
    var isEnabled = 0;
    var cameras = falcon.devices();
    if (cameras.length == 0) {
        console.log('no falcon camera');
    } else {
        //console.log(cameras);
        //do sth
        for (i = 0; i < cameras.length; i++) {
            var camera = new falcon.FalconCamera(cameras[i]);
            try {
                var infoPayload = await camera.getDeviceInfo();
            } catch (e) {
                //console.log(e);
            }
            let dev = camera.parseDevInfoPayload(infoPayload);

            if (dev.sn == sn) {
                if (enable == 'true') {
                    await camera.enableAIMode();
                } else {
                    await camera.disableAIMode();
                }
                isEnabled = await camera.isAIModeEnabled();
            }
            camera.close();
        }
    }
    return isEnabled;
}

async function getFalconCameraAIModeStatus(sn) {
//console.log('', request.query.sn);
    var isEnabled = 0;
    var cameras = falcon.devices();
    if (cameras.length == 0) {
        console.log('no falcon camera');
    } else {
        //console.log(cameras);
        //do sth
        for (i = 0; i < cameras.length; i++) {
            var camera = new falcon.FalconCamera(cameras[i]);
            try {
                var infoPayload = await camera.getDeviceInfo();
            } catch (e) {
                //console.log(e);
            }
            let dev = camera.parseDevInfoPayload(infoPayload);
            if (dev.sn == sn) {
                isEnabled = await camera.isAIModeEnabled();
            }
            camera.close();
        }
    }
    return isEnabled;
}

async function getFalconCameraPeopleCount(sn) {
    var count = 0;
    var cameras = falcon.devices();
    if (cameras.length == 0) {
        console.log('no falcon camera');
    } else {
        //console.log(cameras);
        //do sth
        for (i = 0; i < cameras.length; i++) {
            var camera = new falcon.FalconCamera(cameras[i]);
            try {
                var infoPayload = await camera.getDeviceInfo();
            } catch (e) {
                //console.log(e);
            }
            let dev = camera.parseDevInfoPayload(infoPayload);
            var isEnabled;
            if (dev.sn == sn) {
                count = await camera.getBodyCount();
            }
            camera.close();
        }
    }
    return count;
}

module.exports = {
    falcon: falcon,
    dolphin: dolphin,
    listFalconDevInfo: listFalconDevInfo,
    listDolphinDevInfo: listDolphinDevInfo,
    enableFalconCameraAIMode: enableFalconCameraAIMode,
    getFalconCameraAIModeStatus: getFalconCameraAIModeStatus,
    getFalconCameraPeopleCount: getFalconCameraPeopleCount
}