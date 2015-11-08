function OpponentManager() {
    this._list = [];
}

var _p = OpponentManager.prototype;

_p.create = function (name, position) {
    var opponent = new Opponent(name, position);
    this._list.push(opponent);
};

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

function Opponent(name, position) {
    this._x = position.x;
    this._y = position.y;
    this._sprites = {};
    this._currentSpriteName = null;
}

_p = Opponent.prototype;

_p._move = function () {

}
_p._draw = function () {

}