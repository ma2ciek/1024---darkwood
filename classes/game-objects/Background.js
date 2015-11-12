function Background(params) {
    GameObject.call(this, params);
    this._img = images[params.imgName];
    this._create();
}
extend(Background, GameObject);

Background.prototype._create = function () {
    this._canvas = document.createElement('canvas');
    this._canvas.width = canvas.width * 3;
    this._canvas.height = canvas.height * 3.5;
    this._ctx = this._canvas.getContext('2d');
    for (var i = 0; i < this._canvas.width / this._img.width + 2; i++) {
        for (var j = 0; j < this._canvas.height / this._img.height + 3; j++) {
            this._ctx.drawImage(this._img, i * this._img.width, j * this._img.height);
        }
    }
}

Background.prototype.draw = function () {
    var pos = getScreenPosition({ x: 0, y: 0 });
    ctx.drawImage(this._canvas,
        this._img.width - mod(pos.x, this._img.width),
        this._img.height - mod(pos.y, this._img.height),
        canvas.width, canvas.height,
        0, 0, canvas.width, canvas.height);
}

Background.prototype._isOnScreen = function () {
    return true;
}

function mod(x, y) {
    return (x % y + y) % y;
}