function User() {
    EventEmitter.call(this);
    this.mx = 0;
    this.my = 0;
    this._hoverObject = null;
    this._addEventHandlers();
}
extend(User, EventEmitter);

var _p = User.prototype;
User.prototype._addEventHandlers = function () {
    window.addEventListener('mousemove', function (e) {
        this.mx = e.clientX;
        this.my = e.clientY;
        this.emit("mousemove", e.clientX,  e.clientY)
    }.bind(this));
    window.addEventListener('click', this.leftClick.bind(this));
}

_p.leftClick = function (e) {
    if (e) {
        this.mx = e.clientX;
        this.my = e.clientY;
    }

    if (!this._hoverObject) {
        var pos = getWorldPosition(this.mx, this.my);
        player.moveTo(pos)
    }

    if (this._hoverObject instanceof Opponent) {
        player.attack(this._hoverObject);
    }
    if (this._hoverObject instanceof GameObject) {
        this._hoverObject.click();
    }

}

_p.drawTooltip = function () {
    var wsp = getWorldPosition(user.mx, user.my)
    this._hoverObject = null;
    opponents.get(wsp.x, wsp.y, function (opponent) {
        drawText(ctx, opponent.getName(), user.mx, user.my - 20, '#FFF', 'center', 'middle')
        this._hoverObject = opponent;
    }.bind(this));
    objects.get(wsp.x, wsp.y, function (object) {
        drawText(ctx, object.getName(), user.mx, user.my - 20, '#FFF', 'center', 'middle')
        this._hoverObject = object;
    }.bind(this));
}