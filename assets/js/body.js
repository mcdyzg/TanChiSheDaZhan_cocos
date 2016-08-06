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
    },

    // use this for initialization
    onLoad: function () {

    },

    onCollisionEnter: function(other, self){
        var t = this;
        t.node.color = {r:66,g:66,b:66,a:255};
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
