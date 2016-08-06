cc.Class({
    extends: cc.Component,

    properties: {
        head:{
            default:null,
            type:cc.Prefab
        },
        body:{
            default:null,
            type:cc.Prefab
        },
        eye:{
            default:null,
            type:cc.Prefab
        },
        background:{
            default:null,
            type:cc.Node
        },
        atlas:{
            default:null,
            type: cc.SpriteAtlas
        },
        color:{
            default:null
        },
        length:8,
        direction:{
            default:null
        },
        headInitPosInWrap:{
            default:null
        },
        bodycontainer:{
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        var t = this;
        var randomNum = Math.floor((Math.random()*3));
        switch (randomNum){
            case 0:
            t.color = 'qing';
            break;
            case 1:
            t.color = 'lan';
            break;
            case 2:
            t.color = 'huang';
            break;
        }

        // 初始化方向变量和方向角度
        t.direction = t.direction?t.direction: cc.pNormalize({x:cc.randomMinus1To1(),y:cc.randomMinus1To1()});
        t.directionAngle = -180*cc.pToAngle(t.direction)/Math.PI+90;
        // t.schedule(t.getRandomDirection, 1);

        // 生成蛇头
        t.createHead();
    },

    createHead:function(){
        var t = this;
        // 生成蛇头
        var head = cc.instantiate(t.head);
        head.tag = '5';
        head.group = t.node.group;
        t.head = head;
        // head.scale = 0.25;
        var sprite = head.getComponent(cc.Sprite);
        sprite.spriteFrame = t.atlas.getSpriteFrame(t.color);
        head.parent = t.node;
        head.position = {x:0,y:0};

        // 初始化眼睛
        var eye = cc.instantiate(t.eye);
        t.eye = eye;
        head.addChild(eye);
        eye.position={x:0,y:0};
        // eye.scale = 4;
        eye.zIndex = 999999;
        eye.rotation = t.directionAngle ? t.directionAngle: 0; 

        //初始化蛇在background中的位置
        var headInitPosInWorld = t.node.parent.convertToWorldSpaceAR(t.node.getPosition());
        var headInitPosInWrap = t.background.convertToNodeSpaceAR(headInitPosInWorld);
        t.headInitPosInWrap = headInitPosInWrap;
    },

    // getRandomDirection:function(){
    //     var t = this;
    //     t.directionAngle = cc.pNormalize({x:cc.randomMinus1To1(),y:cc.randomMinus1To1()});
    // },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var t = this;
        if(t.head && t.atlas) {
            // 控制蛇眼方向
            t.eye.rotation = t.directionAngle;

            // 判断蛇头与原始位置的距离，增加蛇身
            var headNowPosInWorld = t.node.parent.convertToWorldSpaceAR(t.node.getPosition());
            var headNowPosInWrap = t.background.convertToNodeSpaceAR(headNowPosInWorld);
            if(cc.pDistance(t.headInitPosInWrap, headNowPosInWrap) >= 17 && cc.pDistance(t.headInitPosInWrap, headNowPosInWrap)<= 100){
                t.headInitPosInWrap = headNowPosInWrap;
                t.addSnakeBody(headNowPosInWrap);
            }

            //超过长度减少蛇身
            if(t.bodycontainer.children.length > t.length-2) {
                t.reduceSnakeBody();
            }
        }
    },

    addSnakeBody:function(pos){
        //添加蛇身子
        var t = this;
        // var wp = t.background.parent.convertToWorldSpaceAR(pos);
        // var p = t.node.convertToNodeSpaceAR(wp);
        var body = cc.instantiate(t.body);
        body.group= t.node.group;
        body.tag = '6';
        var sprite = body.getComponent(cc.Sprite);
        // body.scale = 0.25;
        sprite.spriteFrame = t.atlas.getSpriteFrame(t.color);
        body.parent = t.bodycontainer;
        body.position = pos;
        
    },

    reduceSnakeBody:function(){
        var t = this;
        t.bodycontainer.children[0].destroy();
    },

    dead:function(){
        var t = this;
        t.background.active= false;
        t.node.active= false;
    }
});
