import Opponent from './Opponent';
import {IPoint, IDictionary} from '../utils/common';
import Vector from '../utils/Vector';
import Player from '../Player';

const ZOMBIE_WALK_DISTANCE = 500;
const ZOMBIE_ATTACK_DISTANCE = 50;

export default class Zombie extends Opponent {
    private audio: {
        hurt: HTMLAudioElement;
        iSeeYou: HTMLAudioElement;
    }

    private _sawPlayer: boolean;

    constructor(position: IPoint, spriteImages: IDictionary<HTMLImageElement>, audio: IDictionary<HTMLAudioElement>) {
        super('zombie', position, spriteImages);

        this.audio = {
            iSeeYou: <HTMLAudioElement>audio['iSeeYou'].cloneNode(),
            hurt: <HTMLAudioElement>audio['hurt'].cloneNode()
        }
    }

    public move(player: Player) {
        var v = new Vector(player.getX() - this.position.x, player.getY() - this.position.y);
        if (v.getSize() > ZOMBIE_WALK_DISTANCE) {
            this.currentSpriteName = 'idle';
            this._sawPlayer = false;
            return;
        }
        if (v.getSize() < ZOMBIE_ATTACK_DISTANCE) {
            this.currentSpriteName = 'attack';
            this.getCurrentSprite().onAnimationEnd = () => player.getDmg(this, this.dmg);
            this.angle = v.getAngle();
            this.audio.hurt.play();
            return;
        }

        if (!this._sawPlayer) {
            this.audio.iSeeYou.play();
            this._sawPlayer = true;
        }
        this.moveToPlayer(player);
    };

    public onDeathEvent() {
        this.emit('new-object', {
            x: this.position.x,
            y: this.position.y,
            r: 40,
            type: 'trophy',
            name: 'brain',
            imgName: 'brain'
        })

        this.emit('new-object', {
            x: this.position.x,
            y: this.position.y,
            type: 'blood'
        });
    }
}