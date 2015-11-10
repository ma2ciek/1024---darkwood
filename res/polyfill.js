HTMLCanvasElement.prototype.clear = function () {
    var ctx = this.getContext('2d');
    ctx.clearRect(0, 0, this.width, this.height);
}


function drawArc(ctx, x, y, r, color, start, end) {
    ctx.beginPath();
    start = start || 0;
    end = end || Math.PI * 2;
    ctx.fillStyle = color;
    ctx.arc(x, y, r, start, end);
    ctx.lineTo(x, y, r);
    ctx.fill();
    ctx.closePath();
}

function drawText(ctx, text, x, y, color, horizontalCenter, verticalCenter) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.textBaseline = verticalCenter;
    ctx.textAlign = horizontalCenter;
    ctx.fillText(text, x, y);
    ctx.closePath();
}

function extend(dest, src) {
    dest.prototype = Object.create(src.prototype, {
        constructor: {
            value: dest.prototype
        },
        _master: {
            value: src.prototype
        }
    });
}