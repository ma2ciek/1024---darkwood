function Light(radius) {
    this._radius = radius;
    this._canvas = document.createElement('canvas');
    this._canvas.width = radius * 2;
    this._canvas.height = radius * 2;
    this._ctx = this._canvas.getContext('2d');

    // default:
    this.startAngle = 0;
    this.endAngle = 2 * Math.PI;
    this.maxPower = 1;
}

Light.prototype.create = function (x, y) {
    this.setupLight(this._ctx);
    this._ctx.globalCompositeOperation = 'destination-out';
    this._drawShadows(x, y);
    this._ctx.globalCompositeOperation = 'source-over';
}

Light.prototype.set = function (o) {
    for (var propName in o)
        this[propName] = o[propName];
};

Light.prototype.setupLight = function () {
    var radius = this._radius;
    this._ctx.clearRect(0, 0, 2 * radius, 2 * radius)
    var gradient2 = this._ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient2.addColorStop(1, 'rgba(0,0,0,0)');
    gradient2.addColorStop(0, 'rgba(255,255,255,' + this.maxPower +')');
    drawArc(this._ctx, radius, radius, radius, gradient2, this.startAngle, this.endAngle);
};

Light.prototype._drawShadows = function (x, y) {
    var objs = objects.findInRange(x, y, this._radius);
    for (var obj of objs) {
        this._drawShadow(obj, x, y);
    }
};

Light.prototype._drawShadow = function (obj, x, y) {
    var v = new Vector(obj.x - x, obj.y - y);
    var alpha = v.getAngle();
    var fi = Math.asin(obj.radius / v.getSize());

    var beta1 = alpha + fi;
    var beta2 = alpha - fi;

    var gamma1 = beta1 + Math.PI / 2;
    var gamma2 = beta2 - Math.PI / 2;

    this._ctx.beginPath();
    this._ctx.arc(this._radius + v[0], this._radius + v[1], obj.radius / 2, gamma1, gamma2, true);
    this._ctx.arc(this._radius, this._radius, this._radius, beta2, beta1);
    this._ctx.closePath();
    this._ctx.fillStyle = '#FFF';
    this._ctx.fill();
};

Light.prototype.getImage = function () {
    return this._canvas;
};