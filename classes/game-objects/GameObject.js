function GameObject(params) {
    this.type = params.type;
    this.x = params.x;
    this.y = params.y;
    this.w = params.w;
    this.h = params.h;
    this.color = params.color;
}
var _p = GameObject.prototype;

_p.draw = function (ctx) {
    var pos = getScreenPosition(this);
    ctx.fillStyle = this.color;
    ctx.fillRect(pos.x, pos.y, this.w, this.h);
    ctx.closePath();
};

_p.move = function () {

}

_p.testCollision = function (x, y) {
    //if (this.x < x && this.x + w > x && this.y < y && this.y + w > y)
    //    return true;
}

_p.getName = function () {
    return this.type;
}