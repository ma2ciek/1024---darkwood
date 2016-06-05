export default class Vector extends Array {
    private dim: number;

    constructor(...args: number[]) {
        super();

        this.dim = args.length;
        for (var i = 0; i < this.dim; i++) {
            this[i] = args[i];
        }
    }

    public add(v: Vector) {
        for (var i = 0; i < this.dim; i++)
            this[i] += v[i];
        return this;
    };

    public copy() {
        var v = new Vector();
        v.dim = this.dim;
        for (var i = 0; i < this.dim; i++) {
            v[i] = this[i];
        }
        return v;
    }

    public rotate(angle: number) { // 2dim
        var x = this[0] * Math.cos(angle) - this[1] * Math.sin(angle);
        var y = this[0] * Math.sin(angle) + this[1] * Math.cos(angle);
        this[0] = x;
        this[1] = y;
        return this;
    };

    public getUnit() {
        var v = new Vector();
        v.dim = this.dim;
        for (var i = 0; i < this.dim; i++) {
            v[i] = this[i];
        }
        v.toSize(1);
        return v;
    };

    public getSqSum() {
        var sqSum = 0;
        for (var i = 0; i < this.dim; i++) {
            sqSum += this[i] * this[i];
        }
        return sqSum;
    }

    public getSize() {
        return Math.sqrt(this.getSqSum());
    }

    public toSize(x: number) {
        const size = this.getSize();
        if (size == 0) {
            for (var i = 0; i < this.dim; i++) {
                this[i] = 0;
            }
        } else {
            for (var i = 0; i < this.dim; i++) {
                this[i] *= x / size;
            }
        }
        return this;
    }

    public getAngle() {
        if (this.dim !== 2)
            throw new Error("Wrong dim.");
        return Math.atan2(this[1], this[0]);
    }

    public scale(x: number) {
        for (var i = 0; i < this.dim; i++) {
            this[i] *= x;
        }
        return this;
    }

    static createFromFlapArray (radius: number, i: number) {
        var x = i % (radius << 1);
        var y = i / (radius << 1) | 0;
        return new Vector(radius - x, radius - y);
    }
}