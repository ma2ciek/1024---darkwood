function Lamp(params) {
    GameObject.call(this, params);

    this.range = params.r;
    this.radius = 30;
    this.collision = true;
    this.power = params.power || 0.5;

    this._on = typeof params.on == 'boolean' ? params.on : 1;
    this._actionRadius = this.radius + 10;
    this._img = images["lamp"];
}

extend(Lamp, GameObject);

Lamp.prototype.draw = function () {
    var pos = getScreenPosition(this);
    var fgPos = getFgScreenPosition(this);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(fgPos.x, fgPos.y);
    ctx.lineWidth = this.radius;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#555';
    ctx.stroke();
    if (this._on)
        return;
    ctx.drawImage(this._img,
        0, 0, this._img.width, this._img.height,
        fgPos.x - this.radius, fgPos.y - this.radius, this.radius * 2, this.radius * 2);
};

Lamp.prototype.drawAtTheEnd = function () {
    if (!this._on)
        return;
    var fgPos = getFgScreenPosition(this);
    ctx.drawImage(this._img,
       0, 0, this._img.width, this._img.height,
       fgPos.x - this.radius, fgPos.y - this.radius, this.radius * 2, this.radius * 2);
};

Lamp.prototype.drawLight = function () {
    if (!this._on)
        return;
    var pos = getScreenPosition(this);
    var gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, this.range);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    gradient.addColorStop(0, 'rgba(255,255,255,' + this.power + ')');
    drawArc(ctx, pos.x, pos.y, this.range, gradient);
};

Lamp.prototype.testCollision = function (x, y, r) {
    r = r || 0;
    return new Vector(x - this.x, y - this.y).getSize() < this.radius + r;
};

Lamp.prototype.click = function () {
    var v = new Vector(this.x - player.getX(), this.y - player.getY());
    if (v.getSize() < this._actionRadius)
        this.toggle();
    else
        player.moveTo(this, this._actionRadius, this.toggle.bind(this));
};

Lamp.prototype.toggle = function () {
    this._on = !this._on;
};