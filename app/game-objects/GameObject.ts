import {IFinder} from '../GameObjectManager'

export interface IGameObjectOptions {
    type: string;
    x: number;
    y: number;
    size?: number;
    r?: number;
    imgName?: string;
    power?: number;
    on?: boolean;
    w?: number;
    h?: number;
}

export interface IGameObject {
    type: string;
    x: number;
    y: number;
    w: number;
    h: number;
    radius?: number;

    weight?: number;
    collision?: boolean; // TODO;

    click?(): void;
    draw(ctx: CanvasRenderingContext2D): void;
    drawLight?(ctx: CanvasRenderingContext2D, finder: IFinder): void;
    drawAtTheEnd?(ctx: CanvasRenderingContext2D): void;
    getName(): string;
    isOnScreen(canvas: HTMLCanvasElement): boolean;
    move(): void;
    testCollision?(x: number, y: number, r: number): boolean;
}

export class GameObject {
    public name: string; // TODO
    public type: string;
    public x: number;
    public y: number;
    public w: number;
    public h: number;

    constructor(options: IGameObjectOptions) {
        this.type = options.type;
        this.x = options.x;
        this.y = options.y;
        this.w = options.w;
        this.h = options.h;
    }

    public draw(ctx: CanvasRenderingContext2D) { }
    public move() { }

    public getName() {
        return this.name || this.type;
    };

    public isOnScreen(canvas: HTMLCanvasElement) {
        // after player transformation applied
        const onScreenX = Math.abs(this.x) < canvas.width / 2;
        const onScreenY = Math.abs(this.y) < canvas.height / 2;
        return onScreenX && onScreenY;
    }
}

export default GameObject;
