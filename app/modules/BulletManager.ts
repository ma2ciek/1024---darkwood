import Vector from '../utils/Vector';
import {drawArc} from '../utils/canvas-utils';

interface IBulletOptions {
    radius?: number;
    destX: number;
    destY: number;
    x: number;
    y: number;
}

class Bullet {
    public x: number;
    public y: number;
    public radius: number;
    public v: Vector;
    public speed: number;

    constructor(options: IBulletOptions) {
        this.radius = options.radius || 3;
        this.v = new Vector(options.destX - options.x, options.destY - options.y);
        this.v.toSize(1);
    }
}

export default class BulletManager {
    private id: number;
    private radius: number;
    private v: Vector;
    private list: Bullet[] = [];

    public getAll() {
        return this.list;
    }

    public add(options: IBulletOptions) {
        this.list.push(new Bullet(options));
    }

    public move() {
        for (var bullet of this.list) {
            bullet.x += bullet.v[0] * bullet.speed;
            bullet.y += bullet.v[1] * bullet.speed;
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        for (var bullet of this.list) {
            drawArc(ctx, bullet.x, bullet.y, bullet.radius, 'rgba(0, 0, 0, 0.5)');
        }
    }
}
