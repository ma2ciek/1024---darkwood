import Opponent from './opponents/Opponent';
import Zombie from './opponents/Zombie';
import {IPoint, IDictionary, ICallback} from './utils/common';
import {loadImages} from './utils/loaders';
import {zombieSpriteImgs} from './res/sprites';
import {ICreatureData} from './res/map';
import Player from './Player';

export type IImageDictionary = IDictionary<HTMLImageElement>;

export default class OpponentManager {
    private list: Opponent[] = [];
    private spriteImages: IDictionary<IImageDictionary> = {};

    constructor(private creatures: ICreatureData[], private audio: IDictionary<HTMLAudioElement>) {
        this.loadSprites();
    }

    private loadSprites() {
        loadImages(zombieSpriteImgs).then(imgs => this.createOpponents(imgs));
    };

    private createOpponents(imgs: IImageDictionary) {
        this.spriteImages['zombie'] = imgs;
        this.loadOpponents(this.creatures);
    }

    private loadOpponents(list: ICreatureData[]) {
        for (const op of list) {
            const pos = { x: op.x, y: op.y };
            const imgs = this.spriteImages[op.type]
            // temporary only zombie:
            if (op.type == 'zombie') {
                const opponent = new Zombie(pos, imgs, this.audio);
                this.list.push(opponent);
            }
        }
    }

    public move(player: Player) {
        for (const opponent of this.list)
            opponent.move(player);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        for (const opponent of this.list)
            opponent.isOnScreen(ctx.canvas) && opponent.draw(ctx);
    }

    private get(x: number, y: number, callback: ICallback<Opponent>) {
        for (const opponent of this.list) {
            const distance = opponent.distanceFrom(x, y);
            if (distance < opponent.radius) {
                callback && callback(opponent);
                return opponent;
            }
        }
    }

    private remove() {
        // TODO
    }
}