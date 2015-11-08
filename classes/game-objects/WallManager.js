function WallManager() {
    this._list = [];
}

var _p = WallManager.prototype

_p.create = function (params) {
    this._list.push(new Wall(params));
}

_p.draw = function (ctx) {
    for (var i = 0; i < this._list.length; i++) {
        var box = this._list[i];
        var pos = rel(box);
        ctx.fillStyle = box.color;
        ctx.fillRect(pos.x, pos.y, box.w, box.h);

    }
}

function Wall(params) {
    this.x = params.x;
    this.y = params.y;
    this.w = params.w;
    this.h = params.h;
    this.color = '#210';
}