function Game() {
    this._frameIndex = 0;
    this._paused = 0;
    this.counter = new Counter(2, this.init.bind(this));
    this._loadAudio();
}
var _p = Game.prototype;

_p._loadAudio = function () {
    var self = this;
    loadAudioFiles(audioUrls, function (list) {
        audio = list;
        console.log(list);
        self._createSoundTrack();
        self.counter.count();
    });
};

_p._createSoundTrack = function () {
    this._audioList = ['darkAtmosphere', 'ambientWind', "TheCaveOfAncientWarriors", "findNothing"];
    this._soundtrack = new SoundTrack(this._audioList);
}

_p.play = function () {
    if (this._paused)
        return;

    player.move();
    objects.move();
    opponents.move();


    canvas.clear();
    player.drawLights();
    objects.draw(ctx);

    ctx.globalCompositeOperation = 'source-atop'
    
    opponents.draw();
    ctx.globalCompositeOperation = 'source-over'

    player.draw();

    user.drawTooltip();

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
    player = new Player();
    opponents = new OpponentManager(map);
    objects = new GameObjectManager(map);
    this.play();
    this._soundtrack.play();
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
    // TODO: move to User.js
    window.addEventListener('resize', this._setCanvasSize);
}