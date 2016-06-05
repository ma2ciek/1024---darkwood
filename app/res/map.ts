import { rand } from '../utils/common';
import { IGameObjectOptions } from '../game-objects/GameObject';

export interface ICreatureData {
    x: number;
    y: number;
    type: string;
}

export interface IMap {
    data: IGameObjectOptions[];
    creatures: ICreatureData[]
}


export const map: IMap = {
    data: [
        { x: 0, y: 0,type: 'bg', imgName: 'bg1Tiled' },
        { x: 300, y: 300, r: 200, type: 'lamp' },
        { x: 300, y: 800, r: 200, type: 'lamp' },
        { x: 800, y: 300, r: 200, type: 'lamp' },
        { x: 800, y: 800, r: 200, type: 'lamp' },
        { x: 550, y: 550, r: 300, type: 'lamp', power: 1, on: false },
        { x: 250, y: 650, size: 400, type: 'tree', imgName: 'tree1' },
        { x: 800, y: 650, size: 400, type: 'tree', imgName: 'tree2' },
        { x: 600, y: 1250, size: 400, type: 'tree', imgName: 'tree3' }],
    creatures: [
        { x: 600, y: 600, type: 'zombie' },
        { x: 1300, y: 900, type: 'zombie' },
        { x: -500, y: -450, type: 'zombie' },
        { x: -300, y: 150, type: 'zombie' }
    ]
};

export const randomMap: IMap = (() => {
    const map: IMap = {
        data: [{ x:0, y:0, type: 'bg', imgName: 'bg1Tiled' }],
        creatures: []
    };
    
    const dim = {
        MIN_X: -10000,
        MIN_Y: -10000,
        MAX_X: 10000,
        MAX_Y: 10000
    }
    
    for (var i = 0; i < 500; i++) {
        map.data.push({
            type: 'lamp',
            x: rand(dim.MIN_X, dim.MAX_X) | 0,
            y: rand(dim.MIN_Y, dim.MAX_Y) | 0,
            r: rand(100, 400) | 0,
            power: rand(0.4, 1),
            on: !!(rand(0.5, 2) | 0)
        })
        map.data.push({
            type: 'tree',
            size: rand(300, 500) | 0,
            x: rand(dim.MIN_X, dim.MAX_X) | 0,
            y: rand(dim.MIN_Y, dim.MAX_Y) | 0,
            imgName: 'tree' + (rand(1, 4) | 0)
        });
        map.creatures.push({
            type: 'zombie',
            x: rand(dim.MIN_X, dim.MAX_X) | 0,
            y: rand(dim.MIN_Y, dim.MAX_Y) | 0,
        });
    }
    return map;
})();