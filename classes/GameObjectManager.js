function GameObjectManager(map) {
    this._list = [];
    this._classes = [];
    this._createClassList();
    this._loadMap(map);
}

var _p = GameObjectManager.prototype

_p._createClassList = function () {
    this._classes = {
        wall: Wall,
        lamp: Lamp,
        tree: Tree
    }
}

_p._loadMap = function (map) {
    for (var i = 0; i < map.data.length; i++) {
        var o = map.data[i];
        this._loadElement(o);
    }
}

_p._loadElement = function(o) {
    var creator = this._classes[o.type];
    if(typeof creator == 'undefined')
        throw new Error('missing class: ' + o.type);
        
    var gameObject = new creator(o);
    this._list.push(gameObject);
}

_p.draw = function (ctx) {
    for (var i = 0; i < this._list.length; i++) {
        var object = this._list[i];
        object.draw(ctx);
    }
}

_p.drawLights = function (ctx) {
    for (var i = 0; i < this._list.length; i++) {
        var object = this._list[i];
        object.drawLight && object.drawLight(ctx);
    }
}

_p.drawAtTheEnd = function (ctx) {
    for (var i = 0; i < this._list.length; i++) {
        var object = this._list[i];
        object.drawAtTheEnd && object.drawAtTheEnd(ctx);
    }
}

_p.move = function () {
    for (var i = 0; i < this._list.length; i++) {
        var object = this._list[i];
        object.move();
    }
}

_p.get = function (x, y, callback) {
    var wsp = getWorldPosition(x, y);
    for (var i = 0; i < this._list.length; i++) {
        var object = this._list[i];
        if (!object.click)
            return;
        var collision = object.testCollision(x, y)
        if (collision) {
            callback && callback(object);
        }
    }
}