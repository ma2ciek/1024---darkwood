import {IDictionary} from '../utils/common';

export interface ICreatureData {
    life: number;
    dmg: number;
    radius: number;
}

export const creatures: IDictionary<ICreatureData> = {
    zombie: {
        life: 40,
        dmg: 6,
        radius: 40
    }
};

export default creatures;