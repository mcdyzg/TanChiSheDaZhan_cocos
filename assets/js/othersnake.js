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
        // 蛇头的位置，基于othersnake坐标系的定位
        headInitPos:{
            default:null
        },
        direction:{
            default:null
        },
        speed:110,
        atlas:{
            default:null,
            type: cc.SpriteAtlas
        },
        length:8,
        explore:{
            default:null,
            type: cc.Prefab
        }
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

            // 初始化方向
            t.direction = t.direction?t.direction: cc.pNormalize({x:cc.randomMinus1To1(),y:cc.randomMinus1To1()});
            t.schedule(t.getRandomDirection, 1);

            // 初始化蛇头探路者位置
            t.headInitPos= {x:0,y:0};

            // 生成蛇头探路者
            t.createHead();

        // });

        
    },

    createHead:function(){
        var t = this;

        // 生成蛇头探路者
        var explore = cc.instantiate(t.explore);
        t.explore = explore;
        // var sprite = explore.getComponent(cc.Sprite);
        // explore.scale = 0.25;
        // sprite.spriteFrame = t.atlas.getSpriteFrame(t.color);
        t.node.addChild(explore);
        explore.position = {x:0,y:0};

        // 初始化眼睛
        var eye = cc.instantiate(t.eye);
        t.eye = eye;
        t.node.addChild(eye);
        eye.position={x:0,y:0};
        eye.active = false;
        // eye.scale = 1;
        eye.zIndex = 999999;
        eye.rotation = -180*cc.pToAngle(t.direction)/Math.PI+90;   

    },

    getRandomDirection:function(){
        var t = this;
        t.direction = cc.pNormalize({x:cc.randomMinus1To1(),y:cc.randomMinus1To1()});
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var t = this;
        if(t.explore && t.atlas) {

            // 控制蛇眼方向
            t.eye.rotation = -180*cc.pToAngle(t.direction)/Math.PI+90;  

            // 蛇头探路者移动
            var oldPos = t.explore.getPosition();
            var newPos = cc.pAdd(oldPos, cc.pMult(t.direction, t.speed * dt)); 
            t.explore.setPosition(newPos);

            // 判断蛇头探路者与原始位置的距离，增加蛇身
            if(cc.pDistance(t.headInitPos,t.explore.getPosition()) >= 17 && cc.pDistance(t.headInitPos,t.explore.getPosition())<= 100){ 
                t.addSnakeBody(t.headInitPos);
                t.headInitPos = t.explore.getPosition();
            }

            //超过长度减少蛇身
            if(t.node.children.length > t.length) {
                t.reduceSnakeBody();
            }
        }
    },

    addSnakeBody:function(pos){
        //添加蛇身子
        var t = this;
        // var wp = t.node.parent.convertToWorldSpaceAR(pos);
        // var p = t.node.convertToNodeSpaceAR(wp);
        var body = cc.instantiate(t.body);
        var sprite = body.getComponent(cc.Sprite);
        //给蛇身子添加group组
        body.group = t.node.group;
        // body.scale = 0.25;
        sprite.spriteFrame = t.atlas.getSpriteFrame(t.color);
        t.node.addChild(body); 
        body.position = pos;
        body.tag= '5';
        var p = t.node.children.length-2;
        var l = t.node.children.length-1;
        if(t.node.children[p].name === 'eye') {
            
        } else {
            t.node.children[p].tag = '6';
        }
        
        // 给蛇头添加蛇眼
        t.eye.active = true;
        t.eye.position = pos;
    },

    reduceSnakeBody:function(){
        var t = this;
        t.node.children[2].destroy();
    }
});
