function Lamp(params) {
    GameObject.call(this, params);
    this.range = params.r;
    this.radius = 30;
    this.power = params.power || 0.5;
    this._on = true;
    this._actionRadius = this.radius + 10;
}

extend(Lamp, GameObject);

Lamp.prototype.draw = function () {
    if (!this._on)
        return;

    var pos = getScreenPosition(this);
    var gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, this.range);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    gradient.addColorStop(0, 'rgba(255,255,255,' + this.power + ')');
    drawArc(ctx, pos.x, pos.y, this.range, gradient);
}


Lamp.prototype.testCollision = function (x, y) {
    return new Vector(x - this.x, y - this.y).getSize() < this.radius;
}

Lamp.prototype.click = function () {
    var v = new Vector(this.x - player.getX(), this.y - player.getY());
    if (v.getSize() < this.actionRadius)
        this.toggle();
    else
        player.moveTo(this, this.actionRadius, this.toggle.bind(this));
}

Lamp.prototype.toggle = function () {
    this._on = !this._on;
}