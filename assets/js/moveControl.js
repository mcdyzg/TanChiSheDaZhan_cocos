cc.Class({
    extends: cc.Component,

    properties: {
        head:{
            default:null,
            type:cc.Node
        },
        background:{
            default:null,
            type:cc.Node
        },
        yaogan:{
            default:null,
            type:cc.Node
        },
        speed: 200,
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
        eye:{
            default:null,
            type:cc.Node
        },
        body: {
            default: null,
            type: cc.Prefab
        },
        snakeInitPos:{
            default:null
        },
        snakeLen:6,
        othersnake:{
            default:null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        var t = this;
        // 初始化蛇身位置
        var headInitPos = t.node.convertToWorldSpaceAR(t.head.getPosition());
        var headInitPosInWrap = t.background.convertToNodeSpaceAR(headInitPos);
        t.snakeInitPos = headInitPosInWrap;

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

        t.addSnakeBody(headInitPosInWrap);

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
        // 控制遥杆方向
        var yanganOldPos = t.yaogan.children[0].getPosition();
        t.direction = cc.pNormalize(cc.pSub(t.yaoganMoveToPosition, t.yaoganInitPosition));
        var yaoganNewPos = cc.pAdd({x:0,y:0}, cc.pMult(t.direction, 40));
        if(t.touching) {
            t.yaogan.children[0].setPosition(yaoganNewPos);
        } else {
            t.yaogan.children[0].setPosition({x:0,y:0});
        }

        // //控制眼的方向 
        // t.eye.rotation = -180*cc.pToAngle(t.direction)/Math.PI+90;  

        // // 判断头与身子的距离，增加蛇身
        // var headPos = t.node.convertToWorldSpaceAR(t.head.getPosition());
        // var headPosInWrap = t.background.convertToNodeSpaceAR(headPos);
        // if(cc.pDistance(t.snakeInitPos,headPosInWrap) >= 15 && cc.pDistance(t.snakeInitPos,headPosInWrap) <=100){
        //     t.snakeInitPos = headPosInWrap;
        //     t.addSnakeBody(headPosInWrap);
        // }

        // // 控制小蛇走向
        // var oldPos = t.background.getPosition();
        // var newPos = cc.pAdd(oldPos, cc.pMult(t.direction, -t.speed * dt)); 
        // t.background.setPosition(newPos);
        
        // //减少身子
        // if(t.background.children.length > t.snakeLen) {
        //     t.reduceSnakeBody()
        // }

    },

    addSnakeBody:function(pos){
        //添加蛇身子
        var t = this;
        var body = cc.instantiate(t.body);
        // body.scale = 2;
        t.background.addChild(body);
        // t.snakeInitPos = cc.pAdd(t.snakeInitPos, cc.pMult(t.direction, 40));  
        body.position = pos;
        // body.group= 'default';
        // console.log(body.group)
    },

    reduceSnakeBody:function(){
        var t = this;
        t.background.children[1].destroy();
    }
});
