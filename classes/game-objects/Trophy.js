function Trophy(params) {
    GameObject.call(this, params);
    this.name = params.name;
    this.weight = items[params.name].weight;
    this.radius = params.r || Math.max(this._img.width / 2, this._img.height / 2);

    this._img = images[params.imgName];
}
extend(Trophy, GameObject);

Trophy.prototype.draw = function (ctx) {
    var pos = getScreenPosition(this);
    ctx.drawImage(this._img, pos.x - this.radius / 2, pos.y - this.radius / 2)
};

Trophy.prototype.click = function (ctx) {
    var v = new Vector(this.x - player.getX(), this.y - player.getY());
    if (v.getSize() < this.radius)
        player.pickup(this);
    else
        player.moveTo(this, this.radius, player.pickup.bind(player, this));
};

// To generalize - class circleElement(?)
Trophy.prototype.testCollision = function (x, y, r) {
    r = r || 0;
    return new Vector(x - this.x, y - this.y).getSize() < this.radius + r;
};