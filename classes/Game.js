function Game() {
    this._frameIndex = 0;
    this._paused = 0;
}
var _p = Game.prototype;

_p.play = function () {
    if (this._paused)
        return;

    player.move();

    canvas.clear();
    player.drawLights();
    player.draw();
    walls.draw(ctx);
    this._frameIndex++;
    window.requestAnimationFrame(this.play.bind(this));
}

_p.over = function () {
    this._paused = 1;
}

_p.getFrameNr = function () {
    return this._frameIndex;
}

_p.init = function () {
    this._getCanvas();
    this._setCanvasSize();
    this._setCanvasEventHandlers();
    this.play();
}

_p._getCanvas = function () {
    canvas = document.getElementsByTagName('CANVAS')[0];
    ctx = canvas.getContext('2d');
}

_p._setCanvasSize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

_p._setCanvasEventHandlers = function () {
    window.addEventListener('resize', this._setCanvasSize);
    window.addEventListener('click', player.attack.bind(player));
}