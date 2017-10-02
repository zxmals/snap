/**
 * Created by zxmals on 2017/9/25.
 */

var initposition = {"x":0,"y":0};
var positions = new Array();
var foods = {"x":0,"y":0};
var k = 0;
var t; //计时器
var delaytime = 420; //动作停顿时间
var speedup = 10;
var normalspeed = 420;
var direct = 3; //蛇头方向

//初始化
init();

//Game Over
function gameover() {
    alert("GAME OVER ! POINT: "+positions.length/2);
    positions.splice(0,positions.length);
    $("table tr").remove();
    k = 0;
    initposition.x = 0;
    initposition.y = 0;
    foods.x = 0;
    foods.y = 0;
    t = null;
    delaytime = normalspeed;
    init();
}

function init() {
    for(var i=0;i<10;i++){
        $("table").append("<tr><td></td><td></td><td></td><td></td><td>" +
            "</td><td></td><td></td><td></td><td></td><td></td></tr>");
    }
    var x = radomposition();
    var y = radomposition();
    positions[k] = new Array(2);
    positions[k][0] = x;
    positions[k][1] = y;
    positions[++k] = new Array(2);
    positions[k][0] = x;
    positions[k][1] = y;
    headchange(x,y);

    initposition.x = x;
    initposition.y = y;
    foodsgenerate();
}

//获取0-10以内的随机整数
function radomposition() {
    return parseInt(Math.random()*10);
}

//生成食物
function foodsgenerate() {
    var x = radomposition();
    var y = radomposition();
    while (checkfood(x,y)){
        x = radomposition();
        y = radomposition();
    }
        foodcolor(x,y);
        foods.x = x;
        foods.y = y;
}

//验证块是否与蛇身冲突
function checkfood(x,y) {
    var flag = false;
    for(var i=0;i<positions.length;i+=2){
        if(x==positions[i][0]&y==positions[i][1]){
            flag = true;
            break;
        }
    }
    return flag;
}

//吃
function eats() {
    foodsquit(foods.x,foods.y);
    if(positions.length>=4){
        if(((positions[positions.length-2][0]==0)||(positions[positions.length-2][0]==9))&&positions[positions.length-2][1]>0){
            if(positions[positions.length-2][1]>positions[positions.length-4][1])
                ydowngrow();
            else
                yupgrow();
        }
        if(((positions[positions.length-2][1]==0)||(positions[positions.length-2][1]==9))&&positions[positions.length-2][0]>0){
            if(positions[positions.length-2][0]>positions[positions.length-4][0])
                xrightgrow();
            else
                xleftgrow();
        }
        if(positions[positions.length-2][0]>0&&positions[positions.length-2][1]>0){
            if(positions[positions.length-2][0]>positions[positions.length-2][1]){
                if(positions[positions.length-2][0]>positions[positions.length-4][0])
                    xrightgrow();
                else
                    xleftgrow();
            }else{
                if(positions[positions.length-2][1]>positions[positions.length-4][1])
                    ydowngrow();
                else
                    yupgrow();
            }
        }
    }else{
        if(positions[0][0]==positions[1][0])
            if(positions[0][1]>positions[1][1])
                yupgrow();
            else
                ydowngrow();
        else
            if(positions[0][0]>positions[1][0])
                xleftgrow();
            else
                xrightgrow();
    }
    delaytime = normalspeed;
    foodsgenerate();
}

//横向左 生长
function xleftgrow() {
    positions[++k] = new Array(2);
    positions[positions.length-1][0] = positions[positions.length-3][0]-1;
    positions[positions.length-1][1] = positions[positions.length-3][1];
    positions[++k] = new Array(2);
    positions[positions.length-1][0] = positions[positions.length-2][0];
    positions[positions.length-1][1] = positions[positions.length-2][1];
    change(positions[positions.length-1][0],positions[positions.length-1][1])
}
//横向右生长
function xrightgrow() {
    positions[++k] = new Array(2);
    positions[positions.length-1][0] = positions[positions.length-3][0]+1;
    positions[positions.length-1][1] = positions[positions.length-3][1];
    positions[++k] = new Array(2);
    positions[positions.length-1][0] = positions[positions.length-2][0];
    positions[positions.length-1][1] = positions[positions.length-2][1];
    change(positions[positions.length-1][0],positions[positions.length-1][1])
}

//纵向上 生长
function yupgrow() {
    positions[++k] = new Array(2);
    positions[positions.length-1][0] = positions[positions.length-3][0];
    positions[positions.length-1][1] = positions[positions.length-3][1]-1;
    positions[++k] = new Array(2);
    positions[positions.length-1][0] = positions[positions.length-2][0];
    positions[positions.length-1][1] = positions[positions.length-2][1];
    change(positions[positions.length-1][0],positions[positions.length-1][1])
}
//纵向下 生长
function ydowngrow() {
    positions[++k] = new Array(2);
    positions[positions.length-1][0] = positions[positions.length-3][0];
    positions[positions.length-1][1] = positions[positions.length-3][1]+1;
    positions[++k] = new Array(2);
    positions[positions.length-1][0] = positions[positions.length-2][0];
    positions[positions.length-1][1] = positions[positions.length-2][1];
    change(positions[positions.length-1][0],positions[positions.length-1][1])
}
//速度变换
function  autospeedup() {
    if((foods.x==positions[0][0]&&foods.x==positions[1][0])){
        if(Math.abs(foods.y-positions[0][1])<Math.abs(foods.y-positions[1][1]))
            delaytime = speedup;
    }
    else{
        if((foods.y==positions[0][1]&&foods.y==positions[1][1]))
            if(Math.abs(foods.x-positions[0][0])<Math.abs(foods.x-positions[1][0]))
                delaytime = speedup;
        else
            delaytime = normalspeed;
    }
}

//头带移动
function move_up(x,y) {
    reverthead(x,y);
    if(foods.x==x&&foods.y==y-1)
        eats();
    autospeedup();
    positions[1][0] = x;
    positions[1][1] = y;
    if(checkfood(x,y-1)){
        clearTimeout(t);
        gameover();
        return;
    }
    headchange(x,--y);
    initposition.x = x;
    initposition.y = y;
    positions[0][0] = x;
    positions[0][1] = y;
}
function move_down(x,y) {
    reverthead(x,y);
    if(foods.x==x&&foods.y==y+1)
        eats();
    autospeedup();
    positions[1][0] = x;
    positions[1][1] = y;
    if(checkfood(x,y+1)){
        clearTimeout(t);
        gameover();
        return;
    }
    headchange(x,++y);
    initposition.x = x;
    initposition.y = y;
    positions[0][0] = x;
    positions[0][1] = y;
}
function move_left(x,y) {
    reverthead(x,y);
    if(foods.x==x-1&&foods.y==y)
        eats();
    autospeedup();
    positions[1][0] = x;
    positions[1][1] = y;
    if(checkfood(x-1,y)){
        clearTimeout(t);
        gameover();
        return;
    }
    headchange(--x,y);
    initposition.x = x;
    initposition.y = y;
    positions[0][0] = x;
    positions[0][1] = y;
}
function move_right(x,y) {
    reverthead(x,y);
    if(foods.x==x+1&&foods.y==y)
        eats();
    autospeedup();
    positions[1][0] = x;
    positions[1][1] = y;
    if(checkfood(x+1,y)){
        clearTimeout(t);
        gameover();
        return;
    }
    headchange(++x,y);
    initposition.x = x;
    initposition.y = y;
    positions[0][0] = x;
    positions[0][1] = y;
}
/*
 尾随移动
 1: 原位置
 2: 新位置
 sequence 当前块所在序号
 */
function move_tail(x1,y1,x2,y2,sequence) {
    revert(x1,y1);
    positions[++sequence][0] = x1;
    positions[sequence][1] = y1;
    change(x2,y2);
    positions[--sequence][0] = x2;
    positions[sequence][1] = y2;
}
//还原 块
function revert(x,y) {
    var trs = $("table").find("tr");
    var tds = trs.eq(y).find("td");
    tds.eq(x).removeClass("tdscolor");
}

//食物着色
function foodcolor(x,y) {
    var trs = $("table").find("tr");
    var tds = trs.eq(y).find("td");
    tds.eq(x).addClass("foodscolor");
}

//食物去色
function foodsquit(x,y) {
    var trs = $("table").find("tr");
    var tds = trs.eq(y).find("td");
    tds.eq(x).removeClass("foodscolor");
}

//生成 块
function change(x,y) {
    var trs = $("table").find("tr");
    var tds = trs.eq(y).find("td");
    tds.eq(x).addClass("tdscolor");
}

//头 生成
function headchange(x,y) {
    var trs = $("table").find("tr");
    var tds = trs.eq(y).find("td");
    if(direct==0){
        tds.eq(x).addClass("tdheadup");
    }
    if(direct==1){
        tds.eq(x).addClass("tdheaddown");
    }
    if(direct==2){
        tds.eq(x).addClass("tdheadleft");
    }
    if(direct==3){
        tds.eq(x).addClass("tdheadright");
    }
}

//头 还原
function reverthead(x,y) {
    var trs = $("table").find("tr");
    var tds = trs.eq(y).find("td");
    if(direct==0){
        tds.eq(x).removeClass("tdheadup");
    }
    if(direct==1){
        tds.eq(x).removeClass("tdheaddown");
    }
    if(direct==2){
        tds.eq(x).removeClass("tdheadleft");
    }
    if(direct==3){
        tds.eq(x).removeClass("tdheadright");
    }
}

$(document).keyup(function (e) {
    // console.log(e.keyCode);
    //上
    if(e.keyCode==38){
        clearTimeout(t);
        reverthead(initposition.x,initposition.y);
        direct = 0;
        headchange(initposition.x,initposition.y);
        t = setTimeout(function timmerup() {
            if(initposition.y>0){
                move_up(initposition.x,initposition.y);
                for(var i=2;i<positions.length;i+=2){
                    move_tail(positions[i][0],positions[i][1],positions[i-1][0],positions[i-1][1],i);
                }
            }
            else clearTimeout(t);
            t = setTimeout(timmerup,delaytime);
        },delaytime);
    }
    //下
    if(e.keyCode==40){
        clearTimeout(t);
        reverthead(initposition.x,initposition.y);
        direct = 1;
        headchange(initposition.x,initposition.y);
        t = setTimeout(function timmerdown() {
            if(initposition.y<9){
                move_down(initposition.x,initposition.y);
                for(var i=2;i<positions.length;i+=2){
                    move_tail(positions[i][0],positions[i][1],positions[i-1][0],positions[i-1][1],i);
                }
            }
            else clearTimeout(t);
            t = setTimeout(timmerdown,delaytime);
        },delaytime);
    }
    //左
    if(e.keyCode==37){
        clearTimeout(t);
        reverthead(initposition.x,initposition.y);
        direct = 2;
        headchange(initposition.x,initposition.y);
        t = setTimeout(function timmerleft() {
            if(initposition.x>0){
                move_left(initposition.x,initposition.y);
                for(var i=2;i<positions.length;i+=2){
                    move_tail(positions[i][0],positions[i][1],positions[i-1][0],positions[i-1][1],i);
                }
            }
            else clearTimeout(t);
            t = setTimeout(timmerleft,delaytime);
        },delaytime);
    }
    //右
    if(e.keyCode==39){
        clearTimeout(t);
        reverthead(initposition.x,initposition.y);
        direct = 3;
        headchange(initposition.x,initposition.y);
        t = setTimeout(function timmerright() {
            if(initposition.x<9){
                move_right(initposition.x,initposition.y);
                for(var i=2;i<positions.length;i+=2){
                    move_tail(positions[i][0],positions[i][1],positions[i-1][0],positions[i-1][1],i);
                }
            }
            else clearTimeout(t);
            t = setTimeout(timmerright,delaytime);
        },delaytime);
    }
    //加速/还原
    if(e.keyCode==32){
        if(delaytime == speedup)
            delaytime = normalspeed;
        else
            delaytime = speedup;
    }
});



//    //联动 封装
//    function executemove() {
//
//    }
////主 触发
// $(document).keyup(function (e) {
//     console.log(e.keyCode);
//     //上
//     if(e.keyCode==38){
//         clearTimeout(t);
//         t = setInterval(function () {
//             if(initposition.y>0){
//                 move_up(initposition.x,initposition.y);
//                 for(var i=2;i<positions.length;i+=2){
//                     move_tail(positions[i][0],positions[i][1],positions[i-1][0],positions[i-1][1],i);
//                 }
//             }
//             else clearTimeout(t);
//         },delaytime);
//     }
//     //下
//     if(e.keyCode==40){
//         clearTimeout(t);
//         t = setInterval(function () {
//             if(initposition.y<9){
//                 move_down(initposition.x,initposition.y);
//                 for(var i=2;i<positions.length;i+=2){
//                     move_tail(positions[i][0],positions[i][1],positions[i-1][0],positions[i-1][1],i);
//                 }
//             }
//             else clearTimeout(t);
//         },delaytime);
//     }
//     //左
//     if(e.keyCode==37){
//         clearTimeout(t);
//         t = setInterval(function () {
//             if(initposition.x>0){
//                 move_left(initposition.x,initposition.y);
//                 for(var i=2;i<positions.length;i+=2){
//                     move_tail(positions[i][0],positions[i][1],positions[i-1][0],positions[i-1][1],i);
//                 }
//             }
//             else clearTimeout(t);
//         },delaytime);
//     }
//     //右
//     if(e.keyCode==39){
//         clearTimeout(t);
//         t = setInterval(function () {
//             if(initposition.x<9){
//                 move_right(initposition.x,initposition.y);
//                 for(var i=2;i<positions.length;i+=2){
//                     move_tail(positions[i][0],positions[i][1],positions[i-1][0],positions[i-1][1],i);
//                 }
//             }
//             else clearTimeout(t);
//         },delaytime);
//     }
//     //加速
//     if(e.keyCode==32){
//         clearTimeout(t);
//         delaytime = speedup;
//     }
// });