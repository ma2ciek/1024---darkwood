function Player() {
    this._x = 100;
    this._y = 100;
    this._baseSpeed = PLAYER_BASIC_SPEED;
    this._range = PLAYER_BASIC_RANGE;
    this._weaponName = 'flashLight';
    this._weaponId = 0;
    this._sprites = {};
    this._currentSpriteName = 'flashLightIdle';
    this._handleEvents();
    this._loadSprites();
}

var _p = Player.prototype;

_p._handleEvents = function () {
    keyboard.watch('tab', this._toggleWeapon.bind(this));
}

_p.attack = function () {
    var oldSprite = playerSpriteParams[this._currentSpriteName];
    var newSpriteName = oldSprite.weapon + 'Attack';
    if (!playerSpriteParams[newSpriteName])
        return;

    this._currentSpriteName = newSpriteName;
    this._sprites[this._currentSpriteName].onAnimationEnd = this.idle.bind(this);
    //todo: physics
};

_p.idle = function () {
    var oldSprite = playerSpriteParams[this._currentSpriteName];
    var newSpriteName = oldSprite.weapon + 'Idle';
    console.log(newSpriteName);
    if (!playerSpriteParams[newSpriteName])
        return;

    this._currentSpriteName = newSpriteName;
}

_p._loadSprites = function () {
    loadImages(playerSpriteImgs, function (imgs) {
        console.log(imgs);
        for (var spriteName in imgs) {
            var p = playerSpriteParams[spriteName];
            player._sprites[spriteName] = new Sprite(imgs[spriteName], p.size, p.speed, p.center, p.isLooped, p.zoom);
        }
    });
}

_p.getType = function () {
    return this._type;
}

_p._toggleWeapon = function () {
    this._weaponId = (this._weaponId + 1) % weapons.length;
    this._weaponName = weapons[this._weaponId];
    this._currentSpriteName = this._weaponName + 'Idle';
}

_p.draw = function () {
    var v = new Vector(canvas.width / 2 - user.mx, canvas.height / 2 - user.my);
    var angle = v.getAngle();
    var sprite = this._sprites[this._currentSpriteName]
    sprite.animate();
    sprite.draw(ctx, canvas.width / 2, canvas.height / 2, angle);
};

_p.drawLights = function () {
    this._drawRangeLight();
    if (this._weaponName == 'flashLight')
        this._drawFlashLight()
}

_p._drawRangeLight = function () {
    var gradient2 = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 100);
    gradient2.addColorStop(1, 'rgba(0,0,0,0)');
    gradient2.addColorStop(0, 'rgba(255,255,255,0.5)');
    drawArc(ctx, canvas.width / 2, canvas.height / 2, 100, gradient2);
}

_p._drawFlashLight = function () {
    var v = new Vector(canvas.width / 2 - user.mx, canvas.height / 2 - user.my);
    var angle = Math.PI + v.getAngle();
    var fi = Math.min(Math.PI / 4, Math.atan(LIGHT_WIDTH / v.getSize()));
    v.toSize(50);
    var x = canvas.width / 2 - v[0];
    var y = canvas.height / 2 - v[1];

    var gradient = ctx.createRadialGradient(x, y, 0, x, y, this.getRange());
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
    drawArc(ctx, x, y, this.getRange(), gradient, angle - fi, angle + fi);
}

_p.move = function () {
    var speed = this._baseSpeed;
    var v = new Vector(keys.downArrow - keys.upArrow, keys.rightArrow - keys.leftArrow);
    keys.shift ? v.toSize(2) : v.toSize(1);
    this._x += speed * v[1]
    this._y += speed * v[0];
}

_p.see = function (o) {
    var squareSum = (this._x - o.x) * (this._x - o.x) + (this._y - o.y) * (this._y - o.y);
    return squareSum < this._range * this._range
}

_p.getX = function () {
    return this._x;
}
_p.getY = function () {
    return this._y;
}
_p.getR = function () {
    return Math.sqrt(this._size);
}

Player.prototype.getRange = function () {
    return this._range;
}