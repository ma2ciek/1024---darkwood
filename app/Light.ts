import Vector from './utils/Vector';
import {drawArc} from './utils/canvas-utils';
import {IPoint}  from './utils/common';
import {GameObjectManager, IFinder} from './GameObjectManager';
import {IGameObject} from './game-objects/GameObject';

interface ILightOptions {
    maxPower?: number;
    startAngle?: number;
    endAngle?: number;
}

export default class Light {
    private radius: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private startAngle = 0;
    private endAngle = 2 * Math.PI;
    private maxPower = 1;

    constructor(radius: number) {
        this.radius = radius;
        this.canvas = document.createElement('canvas');
        this.canvas.width = radius * 2;
        this.canvas.height = radius * 2;
        this.ctx = this.canvas.getContext('2d');

        // default:
        this.startAngle = 0;
        this.endAngle = 2 * Math.PI;
        this.maxPower = 1;
    }

    public create(p: IPoint, finder: IFinder) {
        this.setupLight();
        this.ctx.globalCompositeOperation = 'destination-out';
        this.drawShadows(p, finder);
        this.ctx.globalCompositeOperation = 'source-over';
    }

    public set(options: ILightOptions) {
        this.maxPower = options.maxPower;
        this.startAngle = options.startAngle;
        this.endAngle = options.endAngle;
    };

    public setupLight() {
        const radius = this.radius;
        this.ctx.clearRect(0, 0, 2 * radius, 2 * radius)
        const gradient2 = this.ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
        gradient2.addColorStop(1, 'rgba(0,0,0,0)');
        gradient2.addColorStop(0, 'rgba(255,255,255,' + this.maxPower + ')');
        drawArc(this.ctx, radius, radius, radius, gradient2, this.startAngle, this.endAngle);
    };

    private drawShadows(p: IPoint, finder: IFinder) {
        const objs = finder(p.x, p.y, this.radius);
        for (const obj of objs)
            this.drawShadow(obj, p);
    };

    private drawShadow(obj: IGameObject, p: IPoint) {
        const v = new Vector(obj.x - p.x, obj.y - p.y);
        const alpha = v.getAngle();
        const fi = Math.asin(obj.radius / v.getSize());

        const beta1 = alpha + fi;
        const beta2 = alpha - fi;

        const gamma1 = beta1 + Math.PI / 2;
        const gamma2 = beta2 - Math.PI / 2;

        this.ctx.beginPath();
        this.ctx.arc(this.radius + v[0], this.radius + v[1], obj.radius / 2, gamma1, gamma2, true);
        this.ctx.arc(this.radius, this.radius, this.radius, beta2, beta1);
        this.ctx.closePath();
        this.ctx.fillStyle = '#FFF';
        this.ctx.fill();
    };

    public getImage() {
        return this.canvas;
    }
}