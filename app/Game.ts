import BulletManager from './modules/BulletManager';
import GameObjectManager from './GameObjectManager';
import OpponentManager from './OpponentManager';
import Player from './Player';
import SoundTrack from './SoundTrack';
import audioUrls from './res/audio';
import images from './res/images';
import {randomMap} from './res/map';
import {toggleFullScreen} from './res/fullscreen';
import {IDictionary} from './utils/common';
import {loadAudioFiles, loadImages} from './utils/loaders';

export default class Game {
    private frameIndex: number;
    private paused: number;
    private soundtrack: SoundTrack;
    private audio: IDictionary<HTMLAudioElement>;
    private images: IDictionary<HTMLImageElement>;

    private player: Player;
    private opponents: OpponentManager;
    private objects: GameObjectManager;
    private bullets: BulletManager;

    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;

    constructor() {
        this.frameIndex = 0;
        this.paused = 0;

        Promise.all([
            this.loadAudio(),
            this.loadImages()
        ]).then(() => this.start())
    }

    private loadAudio() {
        return loadAudioFiles(audioUrls).then((list: IDictionary<HTMLAudioElement>) => {
            this.audio = list;
            this.createSoundTrack(list);
        });
    };

    private createSoundTrack(audio: IDictionary<HTMLAudioElement>) {
        const audioList = ['darkAtmosphere', 'ambientWind', "TheCaveOfAncientWarriors", "findNothing"];
        this.soundtrack = new SoundTrack(audioList, audio);
    }

    private loadImages() {
        return loadImages(images).then((imgList: IDictionary<HTMLImageElement>) => {
            this.images = imgList;
        });
    };

    private getFrameNr() {
        return this.frameIndex;
    }

    private start() {
        const map = randomMap;
        
        this.getCanvas();
        this.setCanvasSize();
        this.setCanvasEventHandlers();

        this.player = new Player(this.audio);
        this.opponents = new OpponentManager(map.creatures, this.audio);
        this.objects = new GameObjectManager(map.data, this.images);
        this.bullets = new BulletManager();

        this.play();
        this.soundtrack.play();
        toggleFullScreen();
    }

    private getCanvas() {
        this.canvas = <HTMLCanvasElement>document.getElementsByTagName('CANVAS')[0];
        this.ctx = this.canvas.getContext('2d');
    }

    private setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private setCanvasEventHandlers() {
        window.addEventListener('resize', () => this.setCanvasSize());
    }


    private play() {
        if (this.paused)
            return;

        this.moveObjects();
        this.render();
        this.frameIndex++;
        window.requestAnimationFrame(() => this.play());
    }

    private moveObjects() {
        this.player.move();
        this.objects.move();
        this.opponents.move(this.player);
        this.bullets.move();
    }

    private render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(-this.player.getX(), -this.player.getY());
        
        this.drawLights();
        this.drawVisibleElements();
        this.drawForeground();

        // this.user.drawTooltip(this.ctx);

        this.ctx.translate(this.player.getX(), this.player.getY());
    }

    private drawLights() {
        this.player.drawLights(this.ctx, this.objects.findInRange.bind(this.objects));
        this.objects.drawLights(this.ctx);
    }

    private drawVisibleElements() {
        this.ctx.globalCompositeOperation = 'source-atop';
        this.objects.draw(this.ctx);
        this.opponents.draw(this.ctx);
        this.player.draw(this.ctx);
        this.bullets.draw(this.ctx);
        this.ctx.globalCompositeOperation = 'source-over';
    }

    private drawForeground() {
        this.objects.drawAtTheEnd(this.ctx);
    }
}