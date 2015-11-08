var dirX = 0;
var dirY = 0;
var canvas;
var ctx;

var PLAYER_BASIC_RANGE = 400;
var PLAYER_BASIC_SPEED = 4;
var LIGHT_WIDTH = 50;

var weapons = ["flashLight", "knife", "handgun"];

var keyboard = new Keyboard()
var keys = keyboard.getKeys();
var player = new Player();

var walls = new WallManager();
walls.create({
    x: 200,
    y: 200,
    w: 200,
    h: 200
});

var user = new User();
var game = new Game();

window.addEventListener('load', game.init.bind(game))

function rel(o) {
    return {
        x: o.x - player.getX() + canvas.width / 2,
        y: o.y - player.getY() + canvas.height / 2
    }
}

function rand(x, y) {
    return Math.random() * (y - x) + x;
}

function chance(chance, fn, args) {
    if (Math.random() < chance)
        fn.apply(null, args);
}