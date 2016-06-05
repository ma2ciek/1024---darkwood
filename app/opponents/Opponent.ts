import EventEmitter from '../EventEmitter';
import Player from '../Player';
import Sprite from '../Sprite';
import Vector from '../utils/Vector';
import {IPoint, IDictionary} from './utils/common';
import {creatures} from '../res/creatures';
import {zombieSpriteParams} from '../res/sprites';

export type IImageDictionary = IDictionary<HTMLImageElement>;

export default class Opponent extends EventEmitter {
    public life: number;
    public maxLife: number;
    public dmg: number;
    public radius: number;
    public position: { x: number; y: number };
    public name: string;
    public spriteImages: IImageDictionary;
    public speed = 1;
    public angle = 0;
    public sprites: IDictionary<Sprite>;

    protected currentSpriteName: string;

    constructor(name: string, position: IPoint, spriteImages: IImageDictionary) {
        super();
        this.life = creatures[name].life;
        this.maxLife = creatures[name].life;
        this.dmg = creatures[name].dmg;
        this.radius = creatures[name].radius;
        this.position = position;
        this.name = name;
        this.spriteImages = spriteImages;
        this.currentSpriteName = 'walk';
        this.sprites = {};
        this.createSprites(spriteImages);
    }

    private createSprites(spriteImages: IImageDictionary) {
        for (const spriteName in spriteImages) {
            const p = zombieSpriteParams[spriteName];
            this.sprites[spriteName] = new Sprite(spriteImages[spriteName], p.size, p.speed, p.center, p.zoom);
        }
    }

    public move(player: Player) { }
    public onDeathEvent() { }

    public draw(ctx: CanvasRenderingContext2D) {
        const sprite = this.getCurrentSprite();
        sprite.animate();
        sprite.draw(ctx, this.position.x, this.position.y, this.angle);
    }

    public moveToPlayer(player: Player) {
        this.currentSpriteName = 'walk'
        const v = new Vector(player.getX() - this.position.x, player.getY() - this.position.y);
        v.toSize(this.speed);
        this.position.x += v[0];
        this.position.y += v[1];
        this.angle = v.getAngle();
    }

    public distanceFrom(x: number, y: number) {
        const v = new Vector(x - this.position.x, y - this.position.y);
        return v.getSize();
    }

    public getName() {
        return this.name;
    }

    public getCurrentSprite() {
        return this.sprites[this.currentSpriteName];
    }

    public getPos() {
        return this.position;
    }

    public getDamage(dmg: number) {
        this.life -= dmg;
        if (this.life <= 0) {
            this.emit('death');
            this.onDeathEvent();
        }
    }

    public isAlive() {
        return this.life > 0;
    }

    public isOnScreen(canvas: HTMLCanvasElement) {
        const onScreenX = Math.abs(this.position.x) < canvas.width / 2;
        const onScreenY = Math.abs(this.position.y) < canvas.height / 2;
        return onScreenX && onScreenY;
    }
}