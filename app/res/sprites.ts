import {IDictionary} from '../utils/common';

export const playerSpriteImgs: IDictionary<string> = {
    handgunIdle: 'sprite/handgun/idle.png',
    handgunDistanceAttack: 'sprite/handgun/distanceAttack.png',
    handgunMove: 'sprite/handgun/move.png',
    handgunAttack: 'sprite/handgun/meleeAttack.png',
    flashLightIdle: 'sprite/flashlight/idle.png', // do zmiany
    flashLightMove: 'sprite/flashlight/move.png', // do zmiany
    flashLightAttack: 'sprite/flashlight/meleeAttack.png',
    knifeIdle: 'sprite/knife/idle.png',
    knifeAttack: 'sprite/knife/meleeAttack.png',
    knifeMove: 'sprite/knife/move.png'
};

interface ISprite {
    center: { x: number; y: number };
    size: number;
    speed: number;
    zoom: number;
    type: string;
}

interface IPlayerSprite extends ISprite {
    weapon: string;
}

interface IZombieSprite extends ISprite {
    name: string;
}

export const playerSpriteParams: IDictionary<IPlayerSprite> = {
    handgunIdle: {
        center: { x: 38, y: 33 },
        size: 20,
        speed: 30,
        zoom: 0.3,
        type: 'idle',
        weapon: 'handgun'
    },
    handgunAttack: {
        center: { x: 38, y: 33 },
        size: 15,
        speed: 30,
        zoom: 0.3,
        type: 'attack',
        weapon: 'handgun'
    },
    handgunMove: {
        center: { x: 38, y: 33 },
        size: 20,
        speed: 30,
        zoom: 0.3,
        type: 'move',
        weapon: 'handgun'
    },
    handgunDistanceAttack: {
        center: { x: 38, y: 33 },
        size: 3,
        speed: 30,
        zoom: 0.3,
        type: 'distanceAttack',
        weapon: 'handgun'
    },
    flashLightIdle: {
        center: { x: 38, y: 33 },
        size: 20,
        speed: 30,
        zoom: 0.3,
        type: 'idle',
        weapon: 'flashLight'
    },
    flashLightMove: {
        center: { x: 38, y: 33 },
        size: 20,
        speed: 30,
        zoom: 0.3,
        type: 'move',
        weapon: 'flashLight'
    },
    flashLightAttack: {
        center: { x: 38, y: 33 },
        size: 15,
        speed: 30,
        zoom: 0.3,
        type: 'attack',
        weapon: 'flashLight'
    },
    knifeIdle: {
        center: { x: 38, y: 33 },
        size: 20,
        speed: 30,
        zoom: 0.3,
        type: 'idle',
        weapon: 'knife'
    },
    knifeAttack: {
        center: { x: 38, y: 33 },
        size: 15,
        speed: 30,
        zoom: 0.3,
        type: 'attack',
        weapon: 'knife'
    },
    knifeMove: {
        center: { x: 38, y: 33 },
        size: 20,
        speed: 30,
        zoom: 0.3,
        type: 'move',
        weapon: 'knife'
    }
};

export const zombieSpriteImgs: IDictionary<string> = {
    attack: 'sprite/zombie/attack.png',
    idle: 'sprite/zombie/idle.png',
    walk: 'sprite/zombie/walk.png'
};

export const zombieSpriteParams: IDictionary<IZombieSprite> = {
    attack: {
        center: { x: 42, y: 48 },
        size: 9,
        speed: 30,
        zoom: 0.3,
        type: 'attack',
        name: 'zombie'
    },
    idle: {
        center: { x: 42, y: 48 },
        size: 17,
        speed: 30,
        zoom: 0.3,
        type: 'idle',
        name: 'zombie'
    },
    walk: {
        center: { x: 42, y: 48 },
        size: 17,
        speed: 30,
        zoom: 0.3,
        type: 'walk',
        name: 'zombie'
    },
}