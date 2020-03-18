

// await 关键字后的函数
var Delay_Time = function(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, 1000)
    } )
}
// async 函数
var Delay_Print = async function(ms) {
    await Delay_Time(ms)
    return new Promise(function(resolve, reject) {
        resolve("End");
    })
}

// 执行async函数后
Delay_Print(1000).then(function(resolve) {
    console.log(resolve);
})

var p = new Promise(function(resolve, reject){
    //做一些异步操作
    setTimeout(function(){
        console.log('执行完成');
        resolve('随便什么数据');
    }, 2000);
});

function runAsync() {
    var p = new Promise(function (resolve,reject) {
        setTimeout(function () {
            console.log('exec success!');
            resolve('suibianshenm shuju ');
        });
    });
    return p;
}

runAsync().then(function (data) {
    console.log(data);
});

function getNumber(){
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            var num = Math.ceil(Math.random()*10); //生成1-10的随机数
            if(num<=5){
                resolve(num);
            }
            else{
                reject('数字太大了');
            }
        }, 2000);
    });
    return p;
}

getNumber()
    .then(function(data){
        console.log('resolved');
        console.log(data);
        console.log(somedata); //此处的somedata未定义
    })
    .catch(function(reason){
        console.log('rejected');
        console.log(reason);
    });