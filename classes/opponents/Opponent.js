function Opponent(name, position, spriteImages) {
    this._life = creatures[name].life;
    this._maxLife = creatures[name].life;
    this._dmg = creatures[name].dmg;
    this.radius = creatures[name].radius;
    this._position = position;
    this._name = name;
    this._spriteImages = spriteImages;
    this._currentSpriteName = 'walk';
    this._angle = 0;
    this._speed = 1;
    this._sprites = {};
    this._createSprites(spriteImages);
}

_p = Opponent.prototype;

_p._createSprites = function (spriteImages) {
    for (var spriteName in spriteImages) {
        var p = zombieSpriteParams[spriteName];
        if (typeof p == 'undefined')
            throw new Error('Missing data for ' + spriteName + ' sprite')

        this._sprites[spriteName] = new Sprite(spriteImages[spriteName], p.size, p.speed, p.center, p.zoom);
    }
}

_p.move = function () {

};

_p.draw = function () {
    var pos = getScreenPosition(this._position)
    var sprite = this.getCurrentSprite();
    sprite.animate();
    sprite.draw(ctx, pos.x, pos.y, this._angle);
};

_p.moveToPlayer = function () {
    this._currentSpriteName = 'walk'
    var v = new Vector(player.getX() - this._position.x, player.getY() - this._position.y);
    v.toSize(this._speed);
    this._position.x += v[0];
    this._position.y += v[1];
    this._angle = v.getAngle();
};

_p.distanceFrom = function (x, y) {
    var center = this.getCurrentSprite().getCenterPosition();
    var _x = this._position.x;
    var _y = this._position.y;
    var v = new Vector(x - _x, y - _y);
    return v.getSize();
};

_p.getName = function () {
    return this._name;
};

_p.getCurrentSprite = function () {
    return this._sprites[this._currentSpriteName];
};

_p.getPos = function () {
    return this._position;
}

_p.getDamage = function (dmg) {
    this._life -= dmg;
    console.log(this._life);
    if (this._life <= 0) {
        opponents.remove(this);
    }
}

_p.isAlive = function () {
    return this._life > 0;
}