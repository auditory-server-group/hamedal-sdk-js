# HamedalSDK

### Demo
1.Electron Demo:

[Hamedal-Electron-Demo](https://github.com/auditory-server-group/Hamedal-SDK-Electron-Demo)

2.Http server Demo:

[Hamedal-Http-server-app](https://github.com/auditory-server-group/hamedal-http-server-app)


### Example
```javascript
var Hamedal = require('hamedal-sdk')

var cameras =  Hamedal.falcon.devices();
if (cameras.length == 0){
    console.log('unable');
}else {
    cameraInfo = cameras[0];//get default camera
    falcon = new Hamedal.falcon.FalconCamera(cameraInfo);
    
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
}
```

## API
### List all Hamedal devices
```javascript
var Hamedal = require('hamedal-sdk');
var cameras =  Hamedal.falcon.devices();
if (cameras.length == 0){
    console.log('unable');
}
console.log(cameras);
```

### Get ai-mode status
```javascript
falcon.isAIModeEnabled().then(value => {
    console.log("The status of the camera mode: ", value ? "enabled" : "disabled");
}).catch(reason => {
    console.log(reason);
});
```

### Set ai-mode enabled OR disabled
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

### Get people body count
```javascript
falcon.getBodyCount().then(value => {
    console.log("the people count of the camera: ", value);
}).catch(reason => {
    console.log(reason);
});
```

### Colse the device
```javascript
falcon.close();
```
