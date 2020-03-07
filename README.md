# HamedalSDK

```angular2

```

### Example

```javascript
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
```

##API
###List all Hamedal devices
```javascript
var Hamedal = require('hamedal-sdk');
var cameras =  Hamedal.devices();
console.log(cameras);
```

###Get ai-mode status
```javascript
falcon.isAIModeEnabled().then(value => {
    console.log("The status of the camera mode: ", value ? "enabled" : "disabled");
}).catch(reason => {
    console.log(reason);
});
```

###Set ai-mode enabled OR disabled
```javascript
falcon.enableAIMode().then(value => {
    console.log("Enable the ai mode of the camera: ", value);
}).catch(reason => {
    console.log(reason);
});

falcon.disableAIMode().then(value => {
    console.log("Disable the ai mode of the camera: ", value);
}).catch(reason => {
    console.log(reason);
});
```

###Get people body count
```javascript
falcon.getBodyCount().then(value => {
    console.log("the people count of the camera: ", value);
}).catch(reason => {
    console.log(reason);
});
```

###Colse the device
```javascript
falcon.close();
```