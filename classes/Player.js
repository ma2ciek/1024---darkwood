function Player() {
    this._x = 100;
    this._y = 100;
    this._hp = 100;
    this._maxHp = 100;
    this._regeneration = 1 / 20;
    this._range = PLAYER_BASIC_RANGE;
    this._lightRange = PLAYER_LIGHT_RANGE = 150;
    this._weaponId = 0;
    this._weapon = weapons[this._weaponId];
    this._sprites = {};
    this._currentSpriteName = 'flashLightIdle';
    this._audio = {
        rifle: audio['rifle'].cloneNode()
    }
    this._radius = 40;

    this._loadSprites();
    this._createLightCanvas();
    this._rotation = 0;
    this._equipment = new Equipment();
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

_p._createLightCanvas = function () {
    this._canvas = document.createElement('canvas');
    this._canvas.width = PLAYER_LIGHT_RANGE * 2;
    this._canvas.height = PLAYER_LIGHT_RANGE * 2;
    this._ctx = this._canvas.getContext('2d');
}

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
    if (this._velocity.getSize()) {
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
    keys.shift ? this._velocity.toSize(this._baseSpeed * 2)
               : this._velocity.toSize(this._baseSpeed * 1);
};

_p._setMoveStatus = function () {
    !this._isFighting() && this._setStatus('Move', function (spriteName) {
        this._sprites[spriteName].onAnimationEnd = this.idle.bind(this);
    }.bind(this));
};

_p._handleCollisions = function () {
    objects.findCollision(this._x, this._y, 0, false, this.moveForward.bind(this));
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
    this._drawRangeLight();
    if (this._weapon.name == 'flashLight')
        this._drawFlashLight()
};

_p._drawRangeLight = function () {

    this._ctx.clearRect(0, 0, 2 * PLAYER_LIGHT_RANGE, 2 * PLAYER_LIGHT_RANGE)
    var objs = objects.findInRange(this._x, this._y, PLAYER_LIGHT_RANGE);

    var gradient2 = this._ctx.createRadialGradient(PLAYER_LIGHT_RANGE, PLAYER_LIGHT_RANGE, 0, PLAYER_LIGHT_RANGE, PLAYER_LIGHT_RANGE, PLAYER_LIGHT_RANGE);
    gradient2.addColorStop(1, 'rgba(0,0,0,0)');
    gradient2.addColorStop(0, 'rgba(255,255,255,1)');
    drawArc(this._ctx, PLAYER_LIGHT_RANGE, PLAYER_LIGHT_RANGE, PLAYER_LIGHT_RANGE, gradient2);

    this._ctx.globalCompositeOperation = 'destination-out';
    for (var obj of objs) {
        var v = new Vector(obj.x - this._x, obj.y - this._y);
        var alpha = v.getAngle();
        var fi = Math.asin(obj.radius / v.getSize());
        var b1 = alpha + fi;
        var b2 = alpha - fi;
        var beta1 = b1 + Math.PI / 2;
        var beta2 = b2 - Math.PI / 2;

        this._ctx.beginPath();
        this._ctx.arc(PLAYER_LIGHT_RANGE + v[0], PLAYER_LIGHT_RANGE + v[1], obj.radius / 2, beta1, beta2, true);
        this._ctx.arc(PLAYER_LIGHT_RANGE, PLAYER_LIGHT_RANGE, PLAYER_LIGHT_RANGE, b2, b1);
        this._ctx.closePath();
        this._ctx.fillStyle = '#FFF';
        this._ctx.fill();
    }
    this._ctx.globalCompositeOperation = 'source-over';

    ctx.drawImage(this._canvas, canvas.width / 2 - PLAYER_LIGHT_RANGE, canvas.height / 2 - PLAYER_LIGHT_RANGE);
};

_p._drawFlashLight = function () {
    var v = new Vector(user.mx - canvas.width / 2, user.my - canvas.height / 2);
    var angle = v.getAngle();
    var fi = Math.min(Math.PI / 4, Math.atan(LIGHT_WIDTH / v.getSize()));
    v.toSize(50);
    var x = canvas.width / 2 + v[0];
    var y = canvas.height / 2 + v[1];
    var maxPower = Math.min(1, Math.PI / 12 / fi)
    var gradient = ctx.createRadialGradient(x, y, 0, x, y, this._range);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    gradient.addColorStop(0, 'rgba(255,255,255,' + maxPower + ')');
    drawArc(ctx, x, y, this._range, gradient, angle - fi, angle + fi);
};

_p.see = function (o) {
    var squareSum = (this._x - o.x) * (this._x - o.x) + (this._y - o.y) * (this._y - o.y);
    return squareSum < this._range * this._range;
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