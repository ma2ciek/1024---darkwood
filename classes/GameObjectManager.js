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
        tree: Tree,
        bg: Background,
        blood: Blood,
        trophy: Trophy
    }
}

_p._loadMap = function (map) {
    for (var mapElement of map.data)
        this.createElement(mapElement);
}

_p.createElement = function(o) {
    var creator = this._classes[o.type];
    if(typeof creator == 'undefined')
        throw new Error('missing class: ' + o.type);
        
    var gameObject = new creator(o);
    this._list.push(gameObject);
}

_p.draw = function (ctx) {
    for (var object of this._list)
        object._isOnScreen() && object.draw && object.draw(ctx);
}

_p.drawLights = function (ctx) {
    for (var object of this._list)
        object._isOnScreen() && object.drawLight && object.drawLight(ctx);
}

_p.drawAtTheEnd = function (ctx) {
    for (var object of this._list)
        object._isOnScreen() && object.drawAtTheEnd && object.drawAtTheEnd(ctx);
}

_p.move = function () {
    for (var object of this._list)
        object.move();
}

_p.findInteractive = function (x, y, r, success, failure) {
    var wsp = getWorldPosition(x, y);
    for (var object of this._list) {
        if (!object.click)
            continue;

        var collision = object.testCollision(x, y, r)
        if (collision) {
            success(object);
        }
    }
    failure && failure();
}

_p.findCollision = function (x, y, r, success, failure) {
    for (var object of this._list) {
        if (!object.collision)
            continue;

        var collision = object.testCollision(x, y, r)
        if (collision)
            success && success(object)
    }
    failure && failure();
}

_p.findInRange = function (x, y, r) {
    var arr = [];
    for (var object of this._list) {
        if (!object.collision)
            continue;

        var collision = object.testCollision(x, y, r)
        if (collision)
            arr.push(object);
    }
    return arr;
}

_p.remove = function (o) {
    removeElement(this._list, o);
}