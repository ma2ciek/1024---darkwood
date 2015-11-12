function OpponentManager(map) {
    this._list = [];
    this._creatures = map.creatures;;
    this._spriteImages = {};
    this._loadSprites();
}

var _p = OpponentManager.prototype;

_p._loadSprites = function () {
    // temporary only zombie:
    loadImages(zombieSpriteImgs, this._onLoadedImages.bind(this));
};

_p._onLoadedImages = function (imgs) {
    // temporary only zombie:
    this._spriteImages['zombie'] = imgs;
    this._loadOpponents(this._creatures);
}

_p._loadOpponents = function (list) {
    for (var op of list) {
        var pos = new Point(op.x, op.y);
        var imgs = this._spriteImages[op.type]
        // temporary only zombie:
        if (op.type == 'zombie') {
            var opponent = new Zombie(pos, imgs);
            this._list.push(opponent);
        }
    }
}

_p.move = function () {
    for (var opponent of this._list)
        opponent.move();
}

_p.draw = function () {
    for (var opponent of this._list)
        opponent._isOnScreen() && opponent.draw();
}

_p.get = function (x, y, callback) {
    for (var opponent of this._list) {
        var distance = opponent.distanceFrom(x, y);
        if (distance < opponent.radius) {
            callback && callback(opponent);
            return opponent;
        }
    }
}

_p.remove = function (element) {
    removeElement(this._list, element);
};