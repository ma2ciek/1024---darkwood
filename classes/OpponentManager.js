function OpponentManager(map) {
    this._list = [];
    this._creatures = map.creatures;;
    this._spriteImages = {};
    this._loadSprites();
}

var _p = OpponentManager.prototype;

_p._loadSprites = function () {
    loadImages(zombieSpriteImgs, this._onLoadedImages.bind(this));
};

_p._onLoadedImages = function (imgs) {
    this._spriteImages['zombie'] = imgs;
    this._loadOpponents(this._creatures);
}

_p._loadOpponents = function(list) {
    for (var i = 0; i < list.length; i++) {
        var op = list[i]
        var pos = new Point(op.x, op.y);
        var imgs = this._spriteImages[op.type]
        // tymczasowe:
        if (op.type == 'zombie') {
            var opponent = new Zombie(pos, imgs);
            this._list.push(opponent);
        }
    }
}

_p.move = function () {
    for (var i = 0; i < this._list.length; i++) {
        this._list[i].move();
    }
}

_p.draw = function () {
    for (var i = 0; i < this._list.length; i++) {
        this._list[i].draw();
    }
}

_p.get = function (x, y, callback) {
    for (var i = 0; i < this._list.length; i++) {
        var op = this._list[i];
        var distance = op.distanceFrom(x, y);
        if (distance < op.radius) {
            callback && callback(op);
            return op;
        }
    }
}

_p.remove = function (element) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i] == element) {
            this._list.splice(i, 1);
            return;
        }
    }
};