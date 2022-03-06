//获取需要的标签
var wrapper = document.getElementById("wrapper");
var content = document.getElementsByClassName("content")[0];
var imgs = document.getElementsByClassName("imgs")[0].children;
var btns = document.getElementsByClassName("btns")[0];

var timer = null; //初始化一个定时器

// 图片位置信息的数组
var json = [
    {   //  1
        width:200,
        top:20,
        left:130,
        opacity:0.2,
        zIndex:2
    },
    {  // 2
        width:300,
        top:70,
        left:0,
        opacity:0.8,
        zIndex:3
    },
    {   // 3
        width:400,
        top:100,
        left:250,
        opacity:1,
        zIndex:4
    },
    {  // 4
        width:300,
        top:70,
        left:600,
        opacity:0.8,
        zIndex:3
    },
    {   //5
        width:200,
        top:20,
        left:570,
        opacity:0.2,
        zIndex:2
    },
    {   //6
        width:200,
        top:0,
        left:350,
        opacity:0.1,
        zIndex:1
    }
];
// 循环初始化图片位置
for(var i=0; i<json.length; i++){
    buffer(imgs[i], json[i]);
}

// 图片自动滚动函数
function autoRun() {
    json.push(json.shift()); // 将数组第一个元素加到最后去
    // 图片重新布局
    for(var i=0; i<json.length; i++){
        buffer(imgs[i], json[i]);
    }
}

// 创建定时器，开始自动滚动
timer = setInterval(autoRun, 2000);

// 添加事件：鼠标移动到wrapper上，左右切换按钮显示，图片停止滚动
wrapper.onmouseover = function () {
    clearInterval(timer);
    btns.style.display='block';
};
// 添加事件：鼠标移出wrapper，左右切换按钮隐藏，图片开始滚动
wrapper.onmouseout = function () {
    timer = setInterval(autoRun, 2000);
    btns.style.display='none';
};

// 左右按钮点击事件
btns.children[0].onclick = autoRun;
btns.children[1].onclick = function() {
    json.unshift(json.pop()); // 将数组第一个元素加到前面
    // 重新布局
    for(var i=0; i<json.length; i++){
        buffer(imgs[i], json[i]);
    }
}


//获取css的样式值
function getCSSAttrValue(obj, attr) {
    if(obj.currentStyle){ // IE 和 opera
        return obj.currentStyle[attr];
    }else {
        return window.getComputedStyle(obj, null)[attr];
    }
}

/**
 * 缓动动画
 * @param obj
 * @param json
 * @param fn
 */
function buffer(obj, json, fn) {
    // 1.1 清除定时器
    clearInterval(obj.timer);

    // 1.2 设置定时器
    var begin = 0, target = 0, speed = 0;
    obj.timer = setInterval(function () {
        var flag = true;
        for(var k in json){
            // 1.3 获取初始值
            if("opacity" === k){ // 透明度
                begin =  parseInt( parseFloat(getCSSAttrValue(obj, k)) * 100);
                target = parseInt(parseFloat(json[k]) * 100);
            }else if("scrollTop" === k){
                begin = Math.ceil(obj.scrollTop);
                target = parseInt(json[k]);
            }else { // 其他情况
                begin = parseInt(getCSSAttrValue(obj, k)) || 0;
                target = parseInt(json[k]);
            }

            // 1.4 求出步长
            speed = (target - begin) * 0.2;

            // 1.5 判断是否向上取整
            speed = (target > begin) ? Math.ceil(speed) : Math.floor(speed);

            // 1.6 动起来
            if("opacity" === k){ // 透明度
                // w3c的浏览器
                obj.style.opacity = (begin + speed) / 100;
                // ie 浏览器
                obj.style.filter = 'alpha(opacity:' + (begin + speed) +')';
            }else if("scrollTop" === k){
                obj.scrollTop = begin + speed;
            }else if("zIndex" === k){
                obj.style[k] = json[k];
            }else {
                obj.style[k] = begin + speed + "px";
            }

            // 1.5 判断
            if(begin !== target){
                flag = false;
            }
        }

        // 1.3 清除定时器
        if(flag){
            clearInterval(obj.timer);
            // 判断有没有回调函数
            if(fn){
                fn();
            }
        }
    }, 20);
}