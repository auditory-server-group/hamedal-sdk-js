var UVCCTRL = require('uvc-control2')

//TODO :ERR TO OPEN THE DEVICE
// or get a specific camera
const camera = new UVCCTRL({vid: 0x0525, pid: 0xa4ac});
//const camera = new UVCCTRL();

camera.get('autoFocus').then((value) => {
    console.log('AutoFocus setting:', value)
});
camera.get('brightness', 100).then(() => {
    console.log('Brightness set!')
});