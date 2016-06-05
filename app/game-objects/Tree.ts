import {IGameObjectOptions, GameObject, IGameObject} from './GameObject';

export interface ITreeOptions extends IGameObjectOptions {
    size: number;
}

export class Tree extends GameObject implements IGameObject {
    private size: number;
    
    constructor(private img: HTMLImageElement, options: ITreeOptions) {
        super(options);
        this.size = options.size;
    }

    // public drawAtTheEnd(ctx: CanvasRenderingContext2D) {
    //     var pos = getFgScreenPosition(this);
    //     ctx.drawImage(this.img,
    //         0, 0, this.img.width, this.img.height,
    //         pos.x - this.size / 2, pos.y - this.size / 2, this.size, this.size * this.img.height / this.img.width);
    // }
}

export default Tree;