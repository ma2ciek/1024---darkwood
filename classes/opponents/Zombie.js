var ZOMBIE_WALK_DISTANCE = 500;
var ZOMBIE_ATTACK_DISTANCE = 50;
function Zombie(position, spriteImages) {
    Opponent.call(this, 'zombie', position, spriteImages);
    this._audio = {
        iSeeYou: audio['iSeeYou'].cloneNode(),
        hurt: audio['hurt'].cloneNode()
    }
    this._sawPlayer = 0;
}

extend(Zombie, Opponent);

Zombie.prototype.move = function () {
    var v = new Vector(player.getX() - this._position.x, player.getY() - this._position.y);
    if (v.getSize() > ZOMBIE_WALK_DISTANCE) {
        this._currentSpriteName = 'idle';
        this._sawPlayer = false;
        return;
    }
    if (v.getSize() < ZOMBIE_ATTACK_DISTANCE) {
        this._currentSpriteName = 'attack';
        this.getCurrentSprite().onAnimationEnd = player.getDmg.bind(player, this, this._dmg);
        this._angle = v.getAngle();
        this._audio.hurt.play();
        return;
    }

    if(!this._sawPlayer) {
        this._audio.iSeeYou.play();
        this._sawPlayer = true;
    }
    this.moveToPlayer();
}