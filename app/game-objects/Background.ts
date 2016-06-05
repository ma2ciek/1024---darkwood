import {GameObject, IGameObject, IGameObjectOptions} from './GameObject';
import {IDimensions} from './utils/common';

export interface IBackgroundOptions extends IGameObjectOptions {
    imgName: string;
}

export class Background extends GameObject implements IGameObject {
    private ctx: CanvasRenderingContext2D;

    constructor(
        dimensions: IDimensions,
        private img: HTMLImageElement,
        options: IBackgroundOptions
    ) {
        super(options);
        this.create(dimensions);
    }

    public create(dimensions: IDimensions) {
        const privateCanvas = document.createElement('canvas');
        privateCanvas.width = dimensions.width * 3;
        privateCanvas.height = dimensions.height * 3.5;
        this.ctx = privateCanvas.getContext('2d');
        for (var i = 0; i < privateCanvas.width / this.img.width + 2; i++) {
            for (var j = 0; j < privateCanvas.height / this.img.height + 3; j++) {
                this.ctx.drawImage(this.img, i * this.img.width, j * this.img.height);
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.ctx.canvas,
            this.img.width,
            this.img.height,
            ctx.canvas.width, ctx.canvas.height,
            0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    public function() {
        return true;
    }
}

export default Background;