import {IGameObject, GameObject, IGameObjectOptions} from './GameObject';

export default class Wall extends GameObject implements IGameObject {
    public color: string;
    
    constructor(params: IGameObjectOptions) {
        super(params);
        this.color = '#000';
    }
}