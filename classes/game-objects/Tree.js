function Tree(params) {
    GameObject.call(this, params);
    this._size = params.size;
    this._img = images[params.imgName];
}

extend(Tree, GameObject);

Tree.prototype.drawAtTheEnd = function () {
    var pos = getFgScreenPosition(this);
    ctx.drawImage(this._img,
        0, 0, this._img.width, this._img.height,
        pos.x - this._size / 2, pos.y - this._size / 2, this._size, this._size * this._img.height / this._img.width);
};