function AudioTrigger(params) {
    GameObject.call(this, params);
    this._audio =  params.audio
}
extend(AudioTrigger, GameObject);
