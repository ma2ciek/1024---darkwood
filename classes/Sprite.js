function Sprite(img, animationLength, speed, frameCenter, isLooped, zoom) {
    this._width = img.width / animationLength;
    this._height = img.height;
    this._animationLength = animationLength;
    this._frameCenter = frameCenter || { x: this._width / 2, y: this._height / 2 };
    this._isLooped = isLooped || false;
    this._img = img;
    this._frequency = 1000 / speed; // speed - [frames / second]
    this._timeStamp = Date.now();
    this._index = 0;
    this._zoom = zoom || 1;
}

_p = Sprite.prototype;

_p.animate = function () {
    if ((Date.now() - this._timeStamp) > this._frequency) {
        this.nextFrame();
        this._timeStamp = Date.now();
    }
}

_p.nextFrame = function () {
    if (this._isLooped)
        this._index = (this._index + 1) % this._animationLength;
    else
        this._index = Math.max(this._index + 1, this._animationLength - 1);
   
    if (this._index == 0 && this.onAnimationEnd)
        this.onAnimationEnd();
}

_p.draw = function (ctx, x, y, rotation) {
    var w = this._width;
    var h = this._height;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI + rotation);
    ctx.translate(-this._frameCenter.x, -this._frameCenter.y);
    ctx.drawImage(this._img, this._index * w, 0, w, h, 0, 0, w * this._zoom, h * this._zoom);

    ctx.restore();
}