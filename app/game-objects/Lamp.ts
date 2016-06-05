import {IGameObjectOptions, GameObject, IGameObject} from './GameObject';
import Light from '../Light';
import Player from '../Player';
import Vector from '../utils/Vector';
import {IFinder} from './GameObjectManager';

export interface ILampOptions extends IGameObjectOptions {
    r: number;
    power: number;
    on: boolean;
}

export class Lamp extends GameObject implements IGameObject {
    public collision: boolean;
    public radius: number;

    private range: number;
    private power: number;
    private on: boolean;
    private actionRadius: number;
    private lightAura: Light;

    constructor(private img: HTMLImageElement, options: ILampOptions) {
        super(options);

        this.range = options.r;
        this.radius = 30;
        this.collision = true;
        this.power = options.power || 0.5;
        this.on = typeof options.on == 'boolean' ? options.on : true;
        this.actionRadius = this.radius + 10;

        this.lightAura = new Light(this.range);
        this.lightAura.set({
            maxPower: this.power
        });
    }

    // public draw(ctx: CanvasRenderingContext2D) {
    //     ctx.beginPath();
    //     ctx.moveTo(pos.x, pos.y);
    //     ctx.lineTo(fgPos.x, fgPos.y);
    //     ctx.lineWidth = this.radius;
    //     ctx.lineCap = 'round';
    //     ctx.strokeStyle = '#555';
    //     ctx.stroke();
    //     if (this.on)
    //         return;
    //     ctx.drawImage(this.img,
    //         0, 0, this.img.width, this.img.height,
    //         fgPos.x - this.radius, fgPos.y - this.radius, this.radius * 2, this.radius * 2);
    // }

    public drawAtTheEnd(ctx: CanvasRenderingContext2D) {
        if (!this.on)
            return;
        ctx.drawImage(this.img,
            0, 0, this.img.width, this.img.height,
            this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    public drawLight(ctx: CanvasRenderingContext2D, finder: IFinder) {
        if (!this.on)
            return;

        this.lightAura.create(this, finder);
        var img = this.lightAura.getImage();
        ctx.drawImage(img, this.x - this.range, this.y - this.range);
    }

    public testCollision(x: number, y: number, r = 0) {
        return new Vector(x - this.x, y - this.y).getSize() < this.radius + r;
    }

    // click(player: Player) {
    //     var v = new Vector(this.x - player.getX(), this.y - player.getY());
    //     if (v.getSize() < this.actionRadius)
    //         this.toggle();
    //     else
    //         player.moveTo(this, this.actionRadius, this.toggle.bind(this));
    // }

    public toggle() {
        this.on = !this.on;
    }
}

export default Lamp;