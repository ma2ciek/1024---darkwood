var dirX = 0;
var dirY = 0;
var canvas;
var ctx;

var keyboard = new Keyboard()
var keys = keyboard.getKeys();
var player;
var objects;
var opponents;
var user = new User();
var game = new Game();
var audio = {};

window.addEventListener('load', game.counter.count.bind(game.counter))

function getScreenPosition(o) {
    return {
        x: o.x - player.getX() + canvas.width / 2,
        y: o.y - player.getY() + canvas.height / 2
    }
}

function getWorldPosition(x, y) {
    return {
        x: x + player.getX() - canvas.width / 2,
        y: y + player.getY() - canvas.height / 2
    }
}

function rand(x, y) {
    return Math.random() * (y - x) + x;
}

function chance(chance, fn, args) {
    if (Math.random() < chance)
        fn.call(null, args);
}