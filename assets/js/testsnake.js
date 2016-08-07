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
        speed:110,
        headPosArr: [],
        posArr:[],
        bodyArr:[]
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
        t.direction = t.direction?t.direction: cc.pNormalize({x:0.5,y:0.5});
        t.directionAngle = -180*cc.pToAngle(t.direction)/Math.PI+90;

        // 创建头部
        t.createHead();
    },

    createHead:function(){
        var t = this;
        // 生成蛇头
        var head = cc.instantiate(t.head);
        head.tag = '5';
        head.zIndex = 999999;
        // head.scale = 0.25;
        var sprite = head.getComponent(cc.Sprite);
        sprite.spriteFrame = t.atlas.getSpriteFrame(t.color);
        head.parent = t.node;
        head.position = {x:-706,y:-705};
        t.head = head;
        t.posArr.push(head.position);

        // 初始化眼睛
        var eye = cc.instantiate(t.eye);
        t.eye = eye;
        head.addChild(eye);
        eye.position={x:0,y:0};
        // eye.scale = 4;
        eye.zIndex = 999999;
        eye.rotation = t.directionAngle ? t.directionAngle: 0; 

        // 创建蛇身
        for(var i = 0;i<t.length;i++) {
            var body = cc.instantiate(t.body);
            body.tag = '6';
            var sprite = body.getComponent(cc.Sprite);
            sprite.spriteFrame = t.atlas.getSpriteFrame(t.color);
            body.parent = t.node;
            body.position = {x:-706,y:-705};
            t.bodyArr.push(body);
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var t = this;
        // 控制蛇眼方向
        t.eye.rotation = t.directionAngle;

        // 蛇头移动
        var oldPos = t.head.getPosition();
        var newPos = cc.pAdd(oldPos, cc.pMult(t.direction, t.speed * 0.016)); 
        t.head.setPosition(newPos);
        t.posArr.push(newPos);

        // // 长度增加生产身子
        // if(t.length != t.bodyArr.length) {
        //     for(var i = 0;i< (t.bodyArr.length-t.length);i++) {
        //         var body = cc.instantiate(t.body);
        //         body.tag = '6';
        //         var sprite = body.getComponent(cc.Sprite);
        //         sprite.spriteFrame = t.atlas.getSpriteFrame(t.color);
        //         body.parent = t.node;
        //         body.position = t.posArr[t.bodyArr.length-1];
        //         t.bodyArr.push(body);
        //     }
        // }

        if(t.posArr.length > 20*t.length) {
            t.posArr.splice(0,1);
        }
        for(var r = 0;r<Math.floor(t.posArr.length/20);r++) {
            var m = (20*(r+1))-1;
            t.bodyArr[r].setPosition(t.posArr[m]);
        }
    },
});
