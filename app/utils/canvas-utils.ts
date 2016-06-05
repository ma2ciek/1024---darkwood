export function drawArc(ctx: CanvasRenderingContext2D,
    x: number, y: number, r: number, color: string | CanvasGradient, start?: number, end?: number) {
    ctx.beginPath();
    start = start || 0;
    end = end || Math.PI * 2;
    ctx.fillStyle = color;
    ctx.arc(x, y, r, start, end);
    ctx.lineTo(x, y);
    ctx.fill();
    ctx.closePath();
}

export function drawText(ctx: CanvasRenderingContext2D, text: string,
    x: number, y: number, color: string, horizontalCenter: string, verticalCenter: string) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.textBaseline = verticalCenter;
    ctx.textAlign = horizontalCenter;
    ctx.fillText(text, x, y);
    ctx.closePath();
}
