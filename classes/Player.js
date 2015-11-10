function Player() {
    this._x = 100;
    this._y = 100;
    this._hp = 100;
    this._maxHp = 100;
    this._regeneration = 1 / 60;
    this._baseSpeed = PLAYER_BASIC_SPEED;
    this._range = PLAYER_BASIC_RANGE;
    this._weaponId = 0;
    this._weapon = weapons[this._weaponId];
    this._sprites = {};
    this._currentSpriteName = 'flashLightIdle';
    this._handleEvents();
    this._loadSprites();
    this._audio = {
        rifle: audio['rifle'].cloneNode()
    }
}

var _p = Player.prototype;

_p._handleEvents = function () {
    keyboard.watch('tab', this._toggleWeapon.bind(this));
    window.addEventListener('contextmenu', this.distanceAttack.bind(this))
}

_p._loadSprites = function () {
    var self = this;
    loadImages(playerSpriteImgs, function (imgs) {
        console.log(imgs);
        for (var spriteName in imgs) {
            var p = playerSpriteParams[spriteName];
            if (typeof p == 'undefined')
                throw new Error('Missing data for ' + spriteName + ' sprite')

            self._sprites[spriteName] = new Sprite(imgs[spriteName], p.size, p.speed, p.center, p.zoom);
        }
    });
};

_p.attack = function (opponent) {
    var v = new Vector(this._x - opponent.getPos().x, this._y - opponent.getPos().y);
    if (v.getSize() < 50) {
        this._setStatus('Attack', function (spriteName) {
            console.log(this, this.constructor.prototype);
            this._sprites[spriteName].onAnimationEnd = function () {
                this.idle();
                opponent.getDamage(this._weapon.dmg);
            }.bind(this);
        }.bind(this));
    }
    else
        this.moveTo(opponent.getPos(), 50, this.attack.bind(this, opponent));

};

_p.distanceAttack = function (e) {
    e.preventDefault();
    e.stopPropagation();
    this._setStatus('DistanceAttack', function (spriteName) {
        this._sprites[spriteName].onAnimationEnd = this.idle.bind(this);
        this._audio.rifle.currentTime = 0;
        this._audio.rifle.play();
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
    this._hp = Math.min(this._maxHp, this._hp + this._regeneration);
    var speed = this._baseSpeed;
    var v = new Vector(keys.rightArrow - keys.leftArrow, keys.downArrow - keys.upArrow);
    if (v.getSize() != 0)
        this._dest = null;

    if (v.getSize() == 0 && !this._dest)
        return;

    if (this._dest) {
        v = new Vector(this._dest.x - this._x, this._dest.y - this._y);
        if (v.getSize() < this._destRange) {
            this._dest = null;
            this._destCallback && this._destCallback();
        }
    }

    !this._isFighting() && this._setStatus('Move', function (spriteName) {
        this._sprites[spriteName].onAnimationEnd = this.idle.bind(this);
    }.bind(this));

    keys.shift ? v.toSize(2) : v.toSize(1);
    this._x += speed * v[0]
    this._y += speed * v[1];
};

_p._toggleWeapon = function () {
    this._weaponId = (this._weaponId + 1) % weapons.length;
    this._weapon = weapons[this._weaponId];
    this._currentSpriteName = this._weapon.name + 'Idle';
};

_p.draw = function () {
    var v = new Vector(canvas.width / 2 - user.mx, canvas.height / 2 - user.my);
    var angle = Math.PI + v.getAngle();
    var sprite = this._sprites[this._currentSpriteName]
    sprite && sprite.animate();
    sprite && sprite.draw(ctx, canvas.width / 2, canvas.height / 2, angle);

    this._hp != 100 && drawText(ctx, 'HP: ' + (this._hp | 0), canvas.width / 2, canvas.height / 2 + 20, '#FFF', 'center', 'middle')
};

_p.drawLights = function () {
    this._drawRangeLight();
    if (this._weapon.name == 'flashLight')
        this._drawFlashLight()
};

_p._drawRangeLight = function () {
    var gradient2 = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 100);
    gradient2.addColorStop(1, 'rgba(0,0,0,0)');
    gradient2.addColorStop(0, 'rgba(255,255,255,0.5)');
    drawArc(ctx, canvas.width / 2, canvas.height / 2, 100, gradient2);
}

_p._drawFlashLight = function () {
    var v = new Vector(canvas.width / 2 - user.mx, canvas.height / 2 - user.my);
    var angle = v.getAngle();
    var fi = Math.min(Math.PI / 4, Math.atan(LIGHT_WIDTH / v.getSize()));
    v.toSize(50);
    var x = canvas.width / 2 - v[0];
    var y = canvas.height / 2 - v[1];

    var gradient = ctx.createRadialGradient(x, y, 0, x, y, this._range);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
    drawArc(ctx, x, y, this._range, gradient, angle - fi, angle + fi);
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

_p.getDmg = function (opponent, dmg) {
    this._hp -= dmg;
    if (this._hp < 0)
        game.over();
}

_p.moveTo = function (point, r, callback) {
    this._dest = point;
    this._destRange = r || 5;
    this._destCallback = callback;
}