import {IDictionary} from './utils/common';

export interface IItem {
    type: string;
    weight: number;
    meleeDmg?: number;
    range?: number;
    DISTANCE_FROM_PLAYER?: number; // TODO
    icon?: HTMLImageElement;
    distanceDmg?: number
}

export interface IITems extends IDictionary<IItem>{
    flashlight: IItem;
    knife: IItem;
    handgun: IItem;
    brain: IItem;
}

export const items: IITems = {
    flashlight: {
        type: 'weapon',
        weight: 3,
        meleeDmg: 10,
        range: 400,
        DISTANCE_FROM_PLAYER: 50,

    },
    knife: {
        type: 'weapon',
        weight: 8,
        meleeDmg: 20
    },
    handgun: {
        type: 'weapon',
        weight: 10,
        meleeDmg: 10,
        distanceDmg: 10
    },
    brain: {
        type: 'trophy',
        weight: 4,
    },
}

export default items;