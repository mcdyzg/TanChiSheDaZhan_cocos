var bodycontainer;
var bullcontainer;
var player;

cc.Class({
    extends: cc.Component,

    properties: {
        bodycontainer:{
            default:null,
            type:cc.Node
        },
        player:{
            default:null,
            type:cc.Node
        },
        bull:{
            default:null,
            type:cc.Prefab
        },
        atlas:{
            default:null,
            type:cc.SpriteAtlas
        },
        bullcontainer:{
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        var t = this;
        bodycontainer = t.bodycontainer;
        bullcontainer = t.bullcontainer;
        player = t.player;
    },

    onCollisionEnter: function(other, self){
        var t = this;
        // if(other.tag.toString() === '2001'){
        //     t.blood--;
        // }
        // if(!t.blood){
        //     __G__.player1.points += 1;
        //     t.isDead = true;
        //     t.animCtrl.play('enemy1_down');
        // }
        
        for(var i = 0;i<bodycontainer.children.length;i++) {
            var bull = cc.instantiate(t.bull);
            var color = self.node.getComponent(cc.Sprite).spriteFrame.name;
            var sprite = bull.getComponent(cc.Sprite);
            sprite.spriteFrame = t.atlas.getSpriteFrame(color);
            bull.position  = bodycontainer.children[i].position;
            bullcontainer.addChild(bull);
            // console.log(self)
        }
        // player.getComponent('playersnake').dead();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
