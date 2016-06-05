import Blood from './game-objects/Blood';
import Wall from './game-objects/Wall';
import {Background, IBackgroundOptions} from './game-objects/Background';
import {IDictionary, ICallback} from './utils/common'
import {IGameObject, IGameObjectOptions} from './game-objects/GameObject';
import {Lamp, ILampOptions} from './game-objects/Lamp';
import {Tree, ITreeOptions} from './game-objects/Tree';
import {Trophy, ITrophyOptions} from './game-objects/Trophy';

type IGameObjectCallback = ICallback<IGameObject>;

export interface IFinder {
    (x: number, y: number, radius: number): IGameObject[];
}

export class GameObjectManager {
    private list: IGameObject[];

    constructor(objects: IGameObjectOptions[], private images: IDictionary<HTMLImageElement>) {
        this.list = [];
        this.loadMap(objects);
    }

    private loadMap(objects: IGameObjectOptions[]) {
        for (const mapElement of objects) {
            const element = this.createElement(mapElement);
            element && this.list.push(element);
        }
    }

    private createElement(options: IGameObjectOptions): IGameObject {
        let img = this.images[options.imgName];

        switch (options.type) {
            case 'wall':
                return new Wall(options);
            case 'lamp':
                return new Lamp(img, <ILampOptions>options);
            case 'tree':
                return new Tree(img, <ITreeOptions>options);
            case 'Trophy':
                return new Trophy(img, <ITrophyOptions>options);
            case 'bg':
                return new Background(this.getDimensions(), img, <IBackgroundOptions>options);

            default:
                throw new Error('cannot find proper constructor for type: ' + options.type);
        }
    }

    private getDimensions() {
        // TODO
        return {
            width: window.outerWidth,
            height: window.outerHeight
        };
    }

    public draw(ctx: CanvasRenderingContext2D) {
        // TODO: transofrm
        for (var object of this.list)
            object.isOnScreen(ctx.canvas) && object.draw && object.draw(ctx);
        // TODO: transofrm

    }

    public drawLights(ctx: CanvasRenderingContext2D) {
        // TODO: transofrm

        console.log(this.findInRange.bind(this));
        for (var object of this.list)
            object.isOnScreen(ctx.canvas) && object.drawLight && object.drawLight(ctx, this.findInRange.bind(this));
        // TODO: transofrm

    }

    public drawAtTheEnd(ctx: CanvasRenderingContext2D) {
        // TODO: transofrm

        for (var object of this.list)
            object.isOnScreen(ctx.canvas) && object.drawAtTheEnd && object.drawAtTheEnd(ctx);
        // TODO: transofrm            
    }

    public move() {
        for (var object of this.list)
            object.move();
    }

    public findInteractive(x: number, y: number, r: number, success: IGameObjectCallback, failure: ICallback<void>) {
        for (var object of this.list) {
            if (!object.click)
                continue;

            var collision = object.testCollision(x, y, r)
            if (collision) {
                success && success(object);
            }
        }
        failure && failure();
    }

    public findCollision(x: number, y: number, r: number, success: IGameObjectCallback, failure: ICallback<void>) {
        for (const object of this.list) {
            if (!object.collision)
                continue;

            const collision = object.testCollision(x, y, r)
            if (collision)
                success && success(object)
        }
        failure && failure();
    }

    public findInRange(x: number, y: number, r: number) {
        const objectsInRange: IGameObject[] = [];
        for (const object of this.list) {
            if (!object.collision)
                continue;

            if (object.testCollision(x, y, r))
                objectsInRange.push(object);
        }
        return objectsInRange;
    }
}

export default GameObjectManager;