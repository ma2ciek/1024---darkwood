var bullets = (function () {
    var list = [];
    var id = 0;

    function Bullet(o) {
        copy(this, o);
        this.id = id++;
        this.radius = this.radius || 3;
        this.v = new Vector(o.destX - o.x, o.destY - o.y);
        this.v.toSize(1);
    }

    return {
        getAll() {
            return list;
        },
        add: function (o) {
            list.push(new Bullet(o));
        },
        move: function () {
            for (var i = 0; i < list.length; i++) {
                var b = list[i];

                b.x += b.v[0] * b.speed;
                b.y += b.v[1] * b.speed;
            }
        },
        draw: function (ctx) {
            for (var i = 0; i < list.length; i++) {
                var b = list[i];
                var rel = getScreenPosition(b);
                drawArc(ctx, rel.x, rel.y, b.radius, 'rgba(0, 0, 0, 0.5)');
            }
        }
    };
})();