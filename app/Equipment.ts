import {IDictionary} from 'utils/common';
import {IGameObject} from 'game-objects/GameObject';

interface IBodySlots {
    head: Slot[];
    neck: Slot[];
    chest: Slot[];
    legs: Slot[];
    hands: Slot[];
    fingers: Slot[];
}

const MAX_WEIGHT = 1000;

export function createSlots(size: number) {
    const arr: Slot[] = [];
    for (var i = 0; i < size; i++)
        arr.push(new Slot());
    return arr;
}

export interface IPickable {
    weight: number;
    name: string;
}

export default class Equipment {
    private weight: number;
    private body: IBodySlots;
    private quickAccess: Slot[];
    private bag: Slot[];

    constructor() {
        this.weight = 0;
        this.createPlayerSlots();
    }

    private createPlayerSlots() {
        this.body = {
            head: createSlots(1),
            neck: createSlots(1),
            chest: createSlots(1),
            legs: createSlots(1),
            hands: createSlots(2),
            fingers: createSlots(2)
        };
        this.quickAccess = createSlots(5);
        this.bag = createSlots(20);
    };

    public add(o: IGameObject) {
        if (this.weight + o.weight > MAX_WEIGHT)
            return false;

        for (var slot of this.bag) {
            if (slot.isEmpty() || slot.getType() == o.getName()) {
                slot.addItem(o);
                this.weight += o.weight;
                return true;
            }
        }
        return false;
    }
}

export class Slot {
    private size: number;
    private type: string;
    constructor() {
        this.size = 0;
        this.type = null;
    }

    public isEmpty() {
        return this.size == 0;
    }

    public getType() {
        return this.type;
    }

    public addItem(o: IGameObject) {
        this.size++;
        this.type = o.getName();
    }
}
