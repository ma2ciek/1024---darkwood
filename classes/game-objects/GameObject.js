function GameObject(params) {
    this.type = params.type;
    this.x = params.x;
    this.y = params.y;
    this.w = params.w;
    this.h = params.h;
}
var _p = GameObject.prototype;

_p.move = function () {
};

_p.testCollision = function (x, y) {
    return false;
};

_p.getName = function () {
    return this.name || this.type;
};

_p._isOnScreen = function () {
    var onScreenX = Math.abs(this.x - player.getX()) < canvas.width / 2;
    var onScreenY = Math.abs(this.y - player.getY()) < canvas.height / 2;
    return onScreenX && onScreenY;
};