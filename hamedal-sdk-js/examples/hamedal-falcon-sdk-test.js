#!/usr/bin/env node

var Hamedal = require('../src/device');

var cameras =  Hamedal.devices();
if (cameras.length == 0){
    console.log('unable');
}
console.log(cameras);

cameraInfo = cameras[0];
falcon = new Hamedal.FalconCamera(cameraInfo);

falcon.isAIModeEnabled().then(value => {
    console.log("The status of the camera mode: ", value ? "enabled" : "disabled");
}).catch(reason => {
    console.log(reason);
});

falcon.disableAIMode().then(value => {
    console.log("Disable the ai mode of the camera: ", value);
}).catch(reason => {
    console.log(reason);
});

falcon.enableAIMode().then(value => {
    console.log("Enable the ai mode of the camera: ", value);
}).catch(reason => {
    console.log(reason);
});

falcon.getBodyCount().then(value => {
    console.log("the people count of the camera: ", value);
}).catch(reason => {
    console.log(reason);
});

falcon.close();