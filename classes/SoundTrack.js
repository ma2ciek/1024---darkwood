function SoundTrack(list, isRandom) {
    this._list = list;
    this._index = 0;
    this._isRandom = isRandom;
}

SoundTrack.prototype.play = function () {
    var audioName = this._list[this._index];
    audio[audioName].play()
    audio[audioName].onended = this._next.bind(this)
};

SoundTrack.prototype._next = function () {
    this._index = (this._index + 1) % this._list.length;
    this._list[this._index].currentTime = 0;
    this.play();
};