import { IPoint } from './utils/common';

export default class Sprite {
    public onAnimationEnd: () => any;
    
    private width: number;
    private height: number;
    private animationLength: number;
    private frameCenter: IPoint;
    private img: HTMLImageElement;
    private timeStamp: number;
    private frequency: number;
    private index: number;
    private zoom: number;
    
    constructor(img: HTMLImageElement, animationLength: number, speed: number, frameCenter: IPoint, zoom: number) {
        this.width = img.width / animationLength;
        this.height = img.height;
        this.animationLength = animationLength;
        this.frameCenter = frameCenter || { x: this.width / 2, y: this.height / 2 };
        this.img = img;
        this.frequency = 1000 / speed; // speed - [frames / second]
        this.timeStamp = Date.now();
        this.index = 0;
        this.zoom = zoom || 1;
    }

    public animate() {
        if ((Date.now() - this.timeStamp) > this.frequency) {
            this.nextFrame();
            this.timeStamp = Date.now();
        }
    }

    private nextFrame() {
        this.index = (this.index + 1) % this.animationLength;
        if (this.index == 0 && this.onAnimationEnd)
            this.onAnimationEnd();
    }

    public draw(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number) {
        var w = this.width;
        var h = this.height;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.translate(-this.frameCenter.x, -this.frameCenter.y);
        ctx.drawImage(this.img, this.index * w, 0, w, h, 0, 0, w * this.zoom, h * this.zoom);

        ctx.restore()

        // drawArc(ctx, x, y, 3, "red");
    }

    public getCenterPosition() {
        return this.frameCenter;
    }
}