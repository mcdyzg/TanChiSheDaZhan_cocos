cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        body:{
            default:null,
            type:cc.Prefab
        },
        head:{
            default:null,
            type:cc.Prefab
        },
        eye:{
            default:null,
            type:cc.Prefab
        },
        color:{
            default:null
        },
        background:{
            default:null,
            type:cc.Node
        },
        // 蛇头的位置，基于background坐标系的定位
        snakeInitPos:{
            default:null
        },
        direction:{
            default:null
        },
        speed:200,
        atlas:{
            default:null,
            type: cc.SpriteAtlas
        },
        length:6
    },

    // use this for initialization
    onLoad: function () {
        var t = this;

        // cc.loader.loadRes("atlas/tcs", cc.SpriteAtlas, function (err, atlas) {
        //     t.atlas = atlas;
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
            console.log(t.color)

            // 初始化方向
            t.direction = cc.pNormalize({x:cc.randomMinus1To1(),y:cc.randomMinus1To1()}); 
            t.schedule(t.getRandomDirection, 1);

            // 初始化蛇位置
            t.snakeInitPos= t.node.getPosition();

            // 生成蛇头
            t.createHead();

        // });

        
    },

    createHead:function(){
        var t = this;

        // 生成蛇头
        var head = cc.instantiate(t.head);
        t.head = head;
        var sprite = head.getComponent(cc.Sprite);
        head.scale = 0.25;
        sprite.spriteFrame = t.atlas.getSpriteFrame(t.color);
        t.node.addChild(head);
        head.position = {x:0,y:0};

        // 初始化眼睛
        var eye = cc.instantiate(t.eye);
        t.node.addChild(eye);
        eye.position={x:0,y:0};
        // eye.scale = 1;
        eye.rotation = -180*cc.pToAngle(t.direction)/Math.PI+90;  

    },

    getRandomDirection:function(){
        var t = this;
        t.direction = cc.pNormalize({x:cc.randomMinus1To1(),y:cc.randomMinus1To1()});
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var t = this;
        if(t.head && t.atlas) {

            // 蛇身移动
            var oldPos = t.node.getPosition();
            var newPos = cc.pAdd(oldPos, cc.pMult(t.direction, t.speed * dt)); 
            t.node.setPosition(newPos);

            // 判断头与身子的距离，增加蛇身
            if(t.node.children.length <= t.length) {
                if(cc.pDistance(t.snakeInitPos,t.node.getPosition()) >= (20*(t.node.children.length-1)) && cc.pDistance(t.snakeInitPos,t.node.getPosition()) <=(100*(t.node.children.length-1))){
                    t.addSnakeBody(t.snakeInitPos);
                    // t.snakeInitPos = t.node.getPosition();
                }
            }
        }
    },

    addSnakeBody:function(pos){
        //添加蛇身子
        var t = this;
        var wp = t.node.parent.convertToWorldSpaceAR(pos);
        var p = t.node.convertToNodeSpaceAR(wp);
        var body = cc.instantiate(t.body);
        var sprite = body.getComponent(cc.Sprite);
        body.scale = 0.25;
        sprite.spriteFrame = t.atlas.getSpriteFrame(t.color);
        t.node.addChild(body); 
        body.position = p;
        // body.group= 'default';
        // console.log(p)
    },
});
