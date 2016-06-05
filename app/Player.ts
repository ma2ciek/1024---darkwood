import Equipment from './Equipment';
import EventEmitter from './EventEmitter';
import GameObject from './game-objects/GameObject';
import Light from './Light';
import Opponent from './opponents/Opponent';
import Sprite from './Sprite';
import User from './User';
import Vector from './utils/Vector';
import items from './res/items';
import {IFinder} from './GameObjectManager';
import {IPoint, ICallback, IDictionary} from './utils/common';
import {LIGHT_WIDTH, PLAYER_BASIC_SPEED, PLAYER_LIGHT_RANGE} from './res/config';
import {drawText} from './utils/canvas-utils';
import {loadImages} from './utils/loaders';
import {playerSpriteImgs, playerSpriteParams} from './res/sprites';
import {weapons, IWeaponData} from './res/weapons';

export default class Player extends EventEmitter {
    public x: number;
    public y: number;

    private radius: number;
    private hp: number;
    private maxHp: number;
    private regeneration: number;
    private lightAura: Light;
    private flashlightAura: Light;
    private equipment: Equipment;
    private weaponId: number;
    private weapon: IWeaponData;
    private sprites: IDictionary<Sprite>;
    private currentSpriteName: string;
    private currentOpponent: Opponent;
    private velocity: Vector;
    private user = new User();
    private audio: { rifle: any };
    private destCallback: ICallback<void>;
    private dest: IPoint;
    private destRange: number;

    constructor(audio: IDictionary<HTMLAudioElement>) {
        super();
        this.x = 100;
        this.y = 100;
        this.radius = 40;
        this.hp = 100;
        this.maxHp = 100;
        this.regeneration = 1 / 20;

        this.lightAura = new Light(PLAYER_LIGHT_RANGE);
        this.flashlightAura = new Light(items.flashlight.range);
        this.audio = { rifle: audio['rifle'].cloneNode() };

        this.equipment = new Equipment();
        this.weaponId = 0;
        this.weapon = weapons[this.weaponId];

        this.sprites = {};
        this.currentSpriteName = 'flashLightIdle';
        this.loadSprites();

        this.currentOpponent = null;
    }

    private loadSprites() {
        loadImages(playerSpriteImgs).then((imgs) => {
            for (var spriteName in imgs) {
                var p = playerSpriteParams[spriteName];
                this.sprites[spriteName] = new Sprite(imgs[spriteName], p.size, p.speed, p.center, p.zoom);
            }
        });
    };

    private attack(opponent: Opponent) {
        this.currentOpponent = opponent;
        var v = new Vector(this.x - opponent.getPos().x, this.y - opponent.getPos().y);
        if (v.getSize() < 50)
            this.setStatus('Attack', this.setAnimationEndAction.bind(this));
        else
            this.moveTo(opponent.getPos(), 50, this.attack.bind(this, opponent));
    };

    private setAnimationEndAction(spriteName: string, opponent: Opponent) {
        this.sprites[spriteName].onAnimationEnd = this.attackEnd.bind(this);
    }

    private attackEnd() {
        var opponent = this.currentOpponent;
        opponent.getDamage(this.weapon.dmg);
        if (opponent.isAlive())
            this.moveTo(opponent.getPos(), 50, this.attack.bind(this, opponent));
        else
            this.idle();
    }

    public distanceAttack() {
        this.setStatus('DistanceAttack', (spriteName: string) => {
            this.sprites[spriteName].onAnimationEnd = this.idle.bind(this);
            this.audio.rifle.currentTime = 0;
            this.audio.rifle.play();
            this.emit('bullet', {
                x: this.x,
                y: this.y,
                speed: 15,
                destX: this.user.getMouse().x,
                destY: this.user.getMouse().y
            });
        });
    };

    private idle() {
        this.setStatus('Idle');
    };

    private isFighting() {
        var sprite = playerSpriteParams[this.currentSpriteName];
        return sprite.type == 'attack' || sprite.type == 'distanceAttack';
    }

    private setStatus(status: string, callback?: ICallback<any>) {
        var oldSprite = playerSpriteParams[this.currentSpriteName];
        var newSpriteName = oldSprite.weapon + status;
        if (!playerSpriteParams[newSpriteName])
            return 0;
        this.currentSpriteName = newSpriteName;
        callback && callback(newSpriteName);
    }

    public move() {
        this.regenerate();
        this.calculatePlayerVelocity();
        if (!this.velocity.getSize())
            return;
        this.setMoveStatus();
        this.handleCollisions();
    };

    private regenerate() {
        this.hp = Math.min(this.maxHp, this.hp + this.regeneration);
    };

    private calculatePlayerVelocity() {
        this.velocity = this.user.getVelocity();

        if (this.velocity.getSize() != 0) {
            // move / keyboard interruption
            this.dest = null;
        } else if (this.dest) {
            this.velocity = new Vector(this.dest.x - this.x, this.dest.y - this.y);

            if (this.velocity.getSize() < this.destRange) {
                this.dest = null;
                this.destCallback && this.destCallback();
            }
        } else
            return;

        this.velocity.toSize(PLAYER_BASIC_SPEED);
    };

    private setMoveStatus() {
        if (this.isFighting())
            return;
        this.setStatus('Move', (spriteName: string) => {
            if (this.sprites[spriteName])
                this.sprites[spriteName].onAnimationEnd = () => this.idle();
        });
    };

    private handleCollisions() {
        // objects.findCollision(this.x, this.y, 10, false, this.moveForward.bind(this));
    }

    private moveForward() {
        this.x += this.velocity[0];
        this.y += this.velocity[1];
    };

    private toggleWeapon() {
        this.weaponId = (this.weaponId + 1) % weapons.length;
        this.weapon = weapons[this.weaponId];
        this.currentSpriteName = this.weapon.name + 'Idle';
    };

    public draw(ctx: CanvasRenderingContext2D) {
        const mouse = this.user.getMouse();
        const v = new Vector(mouse.x - ctx.canvas.width / 2, mouse.y - ctx.canvas.height / 2);
        const angle = v.getAngle();
        const sprite = this.sprites[this.currentSpriteName]
        sprite && sprite.animate();
        sprite && sprite.draw(ctx, ctx.canvas.width / 2, ctx.canvas.height / 2, angle);

        this.hp != 100 && drawText(ctx, 'HP: ' + (this.hp | 0), ctx.canvas.width / 2, ctx.canvas.height / 2 + 20, '#FFF', 'center', 'middle')
    };

    public drawLights(ctx: CanvasRenderingContext2D, finder: IFinder) {
        this.drawPlayerAura(ctx, finder);
        if (this.weapon.name == 'flashLight')
            this.drawFlashlightAura(ctx, finder)
    };

    private drawPlayerAura(ctx: CanvasRenderingContext2D, finder: IFinder) {
        this.lightAura.create(this, finder);
        var img = this.lightAura.getImage();
        ctx.drawImage(img, ctx.canvas.width / 2 - PLAYER_LIGHT_RANGE, ctx.canvas.height / 2 - PLAYER_LIGHT_RANGE);
    };

    private drawFlashlightAura(ctx: CanvasRenderingContext2D, finder: IFinder) {
        const mouse = this.user.getMouse();
        const v = new Vector(mouse.x - ctx.canvas.width / 2, mouse.y - ctx.canvas.height / 2);
        const angle = v.getAngle();
        const fi = Math.min(Math.PI / 4, Math.atan(LIGHT_WIDTH / v.getSize()));
        v.toSize(items.flashlight.DISTANCE_FROM_PLAYER); // distance from player
        const maxPower = Math.min(1, Math.PI / 12 / fi)

        this.flashlightAura.set({
            maxPower: maxPower,
            startAngle: angle - fi,
            endAngle: angle + fi
        });

        this.flashlightAura.create({ x: this.x + v[0], y: this.y + v[1] }, finder);
        const img = this.flashlightAura.getImage();
        ctx.drawImage(img, ctx.canvas.width / 2 + v[0] - items.flashlight.range, ctx.canvas.height / 2 + v[1] - items.flashlight.range);
    }

    private see(o: IPoint) {
        var squareSum = (this.x - o.x) * (this.x - o.x) + (this.y - o.y) * (this.y - o.y);
        return squareSum < items.flashlight.range * items.flashlight.range;
    }

    public getX() {
        return this.x;
    }

    public getY() {
        return this.y;
    }

    public getDmg(opponent: Opponent, dmg: number) {
        this.hp -= dmg;
        if (this.hp < 0)
            this.emit('death');
    }

    public moveTo(point: IPoint, r: number, callback: ICallback<void>) {
        this.dest = point;
        this.destRange = r || 5;
        this.destCallback = callback;
    }

    public pickup(o: GameObject) {
        // TODO
    }
}