function Blood(params) {
    GameObject.call(this, params);
    this._range = rand(20, 40) | 0;
}
extend(Blood, GameObject);

Blood.prototype.draw = function () {
    var pos = getScreenPosition(this);
    var gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, this._range);
    gradient.addColorStop(0, 'rgba(255,0,0,0.4');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    drawArc(ctx, pos.x, pos.y, this._range, gradient);
}