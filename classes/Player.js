function Player() {
    this._x = 100;
    this._y = 100;
    this._radius = 40;
    this._hp = 100;
    this._maxHp = 100;
    this._regeneration = 1 / 20;

    this._lightAura = new Light(PLAYER_LIGHT_RANGE);
    this._flashlightAura = new Light(items.flashlight.range);
    this._audio = { rifle: audio['rifle'].cloneNode() };

    this._equipment = new Equipment();
    this._weaponId = 0;
    this._weapon = weapons[this._weaponId];

    this._sprites = {};
    this._currentSpriteName = 'flashLightIdle';
    this._loadSprites();

    this._currentOpponent = null;
}

var _p = Player.prototype;

_p._loadSprites = function () {
    var self = this;
    loadImages(playerSpriteImgs, function (imgs) {
        for (var spriteName in imgs) {
            var p = playerSpriteParams[spriteName];
            if (typeof p == 'undefined')
                throw new Error('Missing data for ' + spriteName + ' sprite')

            self._sprites[spriteName] = new Sprite(imgs[spriteName], p.size, p.speed, p.center, p.zoom);
        }
    });
};

_p.attack = function (opponent) {
    this._currentOpponent = opponent;
    var v = new Vector(this._x - opponent.getPos().x, this._y - opponent.getPos().y);
    if (v.getSize() < 50)
        this._setStatus('Attack', this._setAnimationEndAction.bind(this));
    else
        this.moveTo(opponent.getPos(), 50, this.attack.bind(this, opponent));
};

_p._setAnimationEndAction = function (spriteName, opponent) {
    this._sprites[spriteName].onAnimationEnd = this._attackEnd.bind(this);
}

_p._attackEnd = function () {
    var opponent = this._currentOpponent;
    opponent.getDamage(this._weapon.dmg);
    if (opponent.isAlive())
        this.moveTo(opponent.getPos(), 50, this.attack.bind(this, opponent));
    else
        this.idle();
}

_p.distanceAttack = function () {
    this._setStatus('DistanceAttack', function (spriteName) {
        this._sprites[spriteName].onAnimationEnd = this.idle.bind(this);
        this._audio.rifle.currentTime = 0;
        this._audio.rifle.play();
        var pos = getWorldPosition(user.mx, user.my);
        bullets.add({
            x: this._x,
            y: this._y,
            speed: 15,
            destX: pos.x,
            destY: pos.y
        })
    }.bind(this));
};

_p.idle = function () {
    this._setStatus('Idle');
};

_p._isFighting = function () {
    var sprite = playerSpriteParams[this._currentSpriteName];
    return sprite.type == 'attack' || sprite.type == 'distanceAttack';
}

_p._setStatus = function (status, callback) {
    var oldSprite = playerSpriteParams[this._currentSpriteName];
    var newSpriteName = oldSprite.weapon + status;
    if (!playerSpriteParams[newSpriteName])
        return 0;
    this._currentSpriteName = newSpriteName;
    callback && callback(newSpriteName);
}

_p.move = function () {
    this._regenerate();
    this._calculatePlayerVelocity();
    if (!this._velocity.getSize())
        return;
    this._setMoveStatus();
    this._handleCollisions();
};

_p._regenerate = function () {
    this._hp = Math.min(this._maxHp, this._hp + this._regeneration);
};

_p._calculatePlayerVelocity = function () {
    this._velocity = new Vector(keys.D - keys.A, keys.S - keys.W);
    if (this._velocity.getSize() != 0) {
        // move / keyboard interruption
        this._dest = null;
    } else if (this._dest) {
        this._velocity = new Vector(this._dest.x - this._x, this._dest.y - this._y);
        if (this._velocity.getSize() < this._destRange) {
            this._dest = null;
            this._destCallback && this._destCallback();
        }
    } else
        return;
    keys.shift ? this._velocity.toSize(PLAYER_BASIC_SPEED * 2)
               : this._velocity.toSize(PLAYER_BASIC_SPEED * 1);
};

_p._setMoveStatus = function () {
    !this._isFighting() && this._setStatus('Move', function (spriteName) {
        if (this._sprites[spriteName])
            this._sprites[spriteName].onAnimationEnd = this.idle.bind(this);
    }.bind(this));
};

_p._handleCollisions = function () {
    objects.findCollision(this._x, this._y, 10, false, this.moveForward.bind(this));
}

_p.moveForward = function () {
    this._x += this._velocity[0];
    this._y += this._velocity[1];
};

_p._toggleWeapon = function () {
    this._weaponId = (this._weaponId + 1) % weapons.length;
    this._weapon = weapons[this._weaponId];
    this._currentSpriteName = this._weapon.name + 'Idle';
};

_p.draw = function () {
    var v = new Vector(user.mx - canvas.width / 2, user.my - canvas.height / 2);
    var angle = v.getAngle();
    var sprite = this._sprites[this._currentSpriteName]
    sprite && sprite.animate();
    sprite && sprite.draw(ctx, canvas.width / 2, canvas.height / 2, angle);

    this._hp != 100 && drawText(ctx, 'HP: ' + (this._hp | 0), canvas.width / 2, canvas.height / 2 + 20, '#FFF', 'center', 'middle')
};

_p.drawLights = function () {
    this._drawPlayerAura();
    if (this._weapon.name == 'flashLight')
        this._drawFlashlightAura()
};

_p._drawPlayerAura = function () {
    this._lightAura.create(this._x, this._y);
    var img = this._lightAura.getImage();
    ctx.drawImage(img, canvas.width / 2 - PLAYER_LIGHT_RANGE, canvas.height / 2 - PLAYER_LIGHT_RANGE);
};

_p._drawFlashlightAura = function () {
    var v = new Vector(user.mx - canvas.width / 2, user.my - canvas.height / 2);
    var angle = v.getAngle();
    var fi = Math.min(Math.PI / 4, Math.atan(LIGHT_WIDTH / v.getSize()));
    v.toSize(items.flashlight.DISTANCE_FROM_PLAYER); // distance from player
    var maxPower = Math.min(1, Math.PI / 12 / fi)

    this._flashlightAura.set({
        maxPower: maxPower,
        startAngle: angle - fi,
        endAngle: angle + fi
    });

    this._flashlightAura.create(this._x + v[0], this._y + v[1]);
    var img = this._flashlightAura.getImage();
    ctx.drawImage(img, canvas.width/2 + v[0] - items.flashlight.range, canvas.height/2 + v[1] - items.flashlight.range);
};

_p.see = function (o) {
    var squareSum = (this._x - o.x) * (this._x - o.x) + (this._y - o.y) * (this._y - o.y);
    return squareSum < items.flashlight.range * items.flashlight.range;
};

_p.getX = function () {
    return this._x;
};

_p.getY = function () {
    return this._y;
};

_p.getDmg = function (opponent, dmg) {
    this._hp -= dmg;
    if (this._hp < 0)
        game.over();
};

_p.moveTo = function (point, r, callback) {
    this._dest = point;
    this._destRange = r || 5;
    this._destCallback = callback;
};

_p.pickup = function (o) {
    if (this._equipment.add(o)) {
        objects.remove(o);
    }
};