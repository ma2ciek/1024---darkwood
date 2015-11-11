function Tree(params) {
    GameObject.call(this, params);
    this._img = images[params.imgName];
    this.size = params.size;
}

extend(Tree, GameObject);

Tree.prototype.drawAtTheEnd = function () {
    var pos = getScreenPosition(this);
    ctx.drawImage(this._img,
        0, 0, this._img.width, this._img.height,
        pos.x - this.size / 2, pos.y - this.size / 2, this.size, this.size * this._img.height / this._img.width);
}

Tree.prototype.testCollision = function (x, y) {
    return new Vector(x - this.x, y - this.y).getSize() < this.size;
};