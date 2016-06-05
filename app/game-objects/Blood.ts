import {GameObject, IGameObject, IGameObjectOptions} from './GameObject';
import {rand} from '../utils/common';
import {drawArc} from './utils/canvas-utils';

export default class Blood extends GameObject implements IGameObject {
    private range: number;

    constructor(params: IGameObjectOptions) {
        super(params);
        this.range = rand(20, 40) | 0;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.range);
        gradient.addColorStop(0, 'rgba(255,0,0,0.4');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        drawArc(ctx, this.x, this.y, this.range, gradient);
    }
}