import {IGameObjectOptions, GameObject, IGameObject} from './GameObject';
import Vector from '../utils/Vector';
import Player from '../Player';
import {items} from '../res/items';

export interface ITrophyOptions extends IGameObjectOptions {
    name: string;
    r: number;
    imgName: string;
}


export class Trophy extends GameObject implements IGameObject {
    public weight: number;
    public radius: number;

    constructor(private img: HTMLImageElement, options: ITrophyOptions) {
        super(options);
        this.name = options.name;
        this.weight = items[options.name].weight;
        this.radius = options.r || Math.max(this.img.width / 2, this.img.height / 2);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.x - this.radius / 2, this.y - this.radius / 2)
    }

    // public click(player: Player) {
    //     var v = new Vector(this.x - player.getX(), this.y - player.getY());
    //     if (v.getSize() < this.radius)
    //         player.pickup(this);
    //     else
    //         player.moveTo(this, this.radius, player.pickup.bind(player, this));
    // }

    public testCollision(x: number, y: number, r = 0) {
        return new Vector(x - this.x, y - this.y).getSize() < this.radius + r;
    }
}

export default Trophy;
