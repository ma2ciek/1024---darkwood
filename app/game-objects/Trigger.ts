import {IGameObjectOptions, GameObject, IGameObject} from './GameObject';

export interface ITriggerOptions extends IGameObjectOptions {
    audio: string;
}

export default class AudioTrigger extends GameObject implements IGameObject {
    private audio: string;
    
    constructor(options: ITriggerOptions) {
        super(options);
        this.audio = options.audio;
    }
}
