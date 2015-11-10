var bullets = (function () {
    var list = [];
    var id = 0;

    function Bullet(o) {
        $.extend(this, o);
        this.id = id++;
        this.radius = this.radius || 3;
        this.speed = this.owner.speed;
        this.damage = this.owner.damage;
    }

    return {
        get list() {
            return list;
        },
        add: function (o) {
            list.push(new Bullet(o));
        },
        move: function () {
            for (var i = 0; i < list.length; i++) {
                var b = list[i];
                var c = b.target;

                if (!c) {
                    // Target was already killed
                    list.splice(i, 1);
                    i--;
                } else {
                    // Target still exist
                    var v = new Vector(c.x - b.x, c.y - b.y);
                    if (v.size <= b.speed) {
                        c.onDamage(b, b.damage, 'normal');
                        list.splice(i, 1);
                        i--;
                    } else {
                        b.x += v.unit.x * b.speed;
                        b.y += v.unit.y * b.speed;
                    }
                }
            }
        },
        draw: function (ctx) {
            for (var i = 0; i < list.length; i++) {
                var b = list[i];
                ctx.circle(b.x, b.y, b.radius, b.owner.color, 'rgba(0, 0, 0, 0.5)');
            }
        }
    };
})();