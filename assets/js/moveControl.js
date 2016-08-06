window.__G__ = {};
__G__.playerdata = require('playerdata');

cc.Class({
    extends: cc.Component,

    properties: {
        background:{
            default:null,
            type:cc.Node
        },
        yaogan:{
            default:null,
            type:cc.Node
        },
        speed: 110,
        yaoganInitPosition:{
            default:null
        },
        yaoganMoveToPosition:{
            default:null
        },
        touching: {
            default: false
        },
        direction:{
            default:null
        },
        jiasu:{
            default:null,
            type:cc.Node
        },
        othersnake:{
            default:null,
            type: cc.Prefab
        },
        player:{
            default:null,
            type:cc.Node
        },
        othersnakecontainer:{
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        var t = this;
        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
        // var manager = cc.director.getCollisionManager();
        // manager.enabledDrawBoundingBox = true;

        // 生成玩家的小蛇
        t.otherplayer = [];
        for(var i = 0;i<__G__.playerdata.length;i++){
            if(i==0) {
                t.background.position = __G__.playerdata[i].position;
                t.player.getComponent('playersnake').speed = __G__.playerdata[i].speed;
                t.player.getComponent('playersnake').direction=__G__.playerdata[i].direction;
                t.player.group = __G__.playerdata[i].group;
            }else {
                var tem = cc.instantiate(t.othersnake);
                t.othersnakecontainer.addChild(tem);
                tem.position = __G__.playerdata[i].position;
                tem.getComponent('othersnake').speed = __G__.playerdata[i].speed;
                tem.getComponent('othersnake').direction=__G__.playerdata[i].direction;
                // tem.getComponent('othersnake').group = __G__.playerdata[i].group;
                tem.group = __G__.playerdata[i].group;
                t.otherplayer.push(tem);
            }
        }

        // 设置摇杆方向 
        t.yaoganInitPosition = {x:0,y:0};
        t.yaoganMoveToPosition = {x:100,y:100};
        t.direction = cc.pNormalize(cc.pSub(t.yaoganMoveToPosition, t.yaoganInitPosition));        

        // 控制遥杆移动
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                t.touching = true;
                var touchLoc = touch.getLocation();
                t.yaoganMoveToPosition = t.yaogan.convertToNodeSpaceAR(touchLoc);
                return true;
            },
            onTouchMoved: function(touch, event) {
                t.touching = true;
                var touchLoc = touch.getLocation();
                t.yaoganMoveToPosition = t.yaogan.convertToNodeSpaceAR(touchLoc);
            },
            onTouchEnded: function(touch, event) {
                t.touching = false;
            }
        }, t.yaogan);

        t.player.getComponent('playersnake').direction = -180*cc.pToAngle(t.direction)/Math.PI+90;

        // // 加速按钮
        // cc.eventManager.addListener({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     onTouchBegan: function(touch, event) {
        //         t.speed = 400;
        //         return true; // don't capture event
        //     },
        //     onTouchMoved: function(touch, event) {
        //         t.speed = 400;
        //     },
        //     onTouchEnded: function(touch, event) {
        //         t.speed = 200;
        //     }
        // }, t.jiasu);
        

        // 测试
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                t._onKeyPressed(keyCode, event);
            }
        }, t.node);
        
    },

    _onKeyPressed: function(keyCode, event) {
        // var background = cc.p(this.background)
        // this.snakeLen = this.snakeLen+1;
        // console.log(this.snakeLen);
    },

    update: function (dt) {
        var t = this;

        // // 更新其他玩家小蛇参数
        // for(var i = 0;i<__G__.playerdata.length;i++){
        //     t.otherplayer[i].position = __G__.playerdata[i].position;
        //     t.otherplayer[i].getComponent('othersnake').speed = __G__.playerdata[i].speed;
        //     t.otherplayer[i].getComponent('othersnake').direction=__G__.playerdata[i].direction;
        // }

        // 控制遥杆方向
        var yanganOldPos = t.yaogan.children[0].getPosition();
        t.direction = cc.pNormalize(cc.pSub(t.yaoganMoveToPosition, t.yaoganInitPosition));
        var yaoganNewPos = cc.pAdd({x:0,y:0}, cc.pMult(t.direction, 40));
        if(t.touching) {
            t.yaogan.children[0].setPosition(yaoganNewPos);
        } else {
            t.yaogan.children[0].setPosition({x:0,y:0});
        }

        //控制眼的方向 
        t.player.getComponent('playersnake').directionAngle = -180*cc.pToAngle(t.direction)/Math.PI+90;
        // t.eye.rotation = -180*cc.pToAngle(t.direction)/Math.PI+90;  

        // 控制主角蛇的走向，蛇头固定在canvas中心不动，通过移动背景，划出蛇身
        var oldPos = t.background.getPosition();
        var newPos = cc.pAdd(oldPos, cc.pMult(t.direction, -t.speed * dt)); 
        t.background.setPosition(newPos);
    },
});




// head  5
// body  6
// eye   