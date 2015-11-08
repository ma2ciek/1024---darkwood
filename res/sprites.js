var playerSpriteImgs = {
    handgunIdle: 'sprite/handgun/idle.png',
    handgunAttack: 'sprite/handgun/meleeatack.png',
    flashLightIdle: 'sprite/flashlight/move.png', // do zmiany
    flashLightAttack: 'sprite/flashlight/meleeatack.png',
    knifeIdle: 'sprite/knife/idle.png',
    knifeAttack: 'sprite/knife/meleeattack.png',
    knifeMove: 'sprite/knife/move.png'
};

var playerSpriteParams = {
    handgunIdle: {
        center: { x: 38, y: 33 },
        isLooped: true,
        size: 20,
        speed: 30,
        zoom: 0.3,
        type: 'idle',
        weapon: 'handgun'
    },
    handgunAttack: {
        center: { x: 38, y: 33 },
        isLooped: true,
        size: 15,
        speed: 30,
        zoom: 0.3,
        type: 'attack',
        weapon: 'handgun'
    },
    flashLightIdle: {
        center: { x: 38, y: 33 },
        isLooped: true,
        size: 20,
        speed: 30,
        zoom: 0.3,
        type: 'idle',
        weapon: 'flashLight'
    },
    flashLightAttack: {
        center: { x: 38, y: 33 },
        isLooped: true,
        size: 15,
        speed: 30,
        zoom: 0.3,
        type: 'attack',
        weapon: 'flashLight'
    },
    knifeIdle: {
        center: { x: 38, y: 33 },
        isLooped: true,
        size: 20,
        speed: 30,
        zoom: 0.3,
        type: 'idle',
        weapon: 'knife'
    },
    knifeAttack: {
        center: { x: 38, y: 33 },
        isLooped: true,
        size: 15,
        speed: 30,
        zoom: 0.3,
        type: 'attack',
        weapon: 'knife'
    },
    knifeMove: {
        center: { x: 38, y: 33 },
        isLooped: true,
        size: 20,
        speed: 30,
        zoom: 0.3,
        type: 'move',
        weapon: 'knife'
    }
};