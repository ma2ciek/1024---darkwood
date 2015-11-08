function Vector() {
	var v = [];
	for (var i = 0; i < arguments.length; i++) {
		if (typeof arguments[i] === 'number')
			v.push(arguments[i]);
		else if (Array.isArray(arguments[i]))
			v = v.concat(arguments[i]);
	}

	this.dim = v.length;
	for (var i = 0; i < this.dim; i++) {
		this[i] = v[i];
	}
}
Vector.prototype = Object.create(null);

Vector.prototype.add = function(v) {
	for(var i=0; i<this.dim; i++) {
		this[i] += v[i];
	}
	return this;
};

Vector.prototype.copy = function() {
	var v = new Vector();
	v.dim = this.dim;
	for(var i=0; i<this.dim; i++) {
		v[i] = this[i];
	}
	return v;
}

Vector.prototype.rotate = function(angle) { // 2dim
	var x = this[0] * Math.cos(angle) - this[1] * Math.sin(angle);
	var y = this[0] * Math.sin(angle) + this[1] * Math.cos(angle);
	this[0] = x;
	this[1] = y;
	return this;
};

Vector.prototype.getUnit = function () {
	var v = new Vector();
	v.dim = this.dim;
	for (var i = 0; i < this.dim; i++) {
		v[i] = this[i];
	}
	v.toSize(1);
	return v;
};

Vector.prototype.getSqSum = function() {
	var sqSum = 0;
	for (var i = 0; i < this.dim; i++) {
		sqSum += this[i] * this[i];
	}
	return sqSum;
};

Vector.prototype.getSize = function() {
	return Math.sqrt(this.getSqSum());
};

Vector.prototype.toSize = function (x) {
	var size = this.getSize();
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
};

Vector.prototype.getAngle = function() {
	if(this.dim !== 2)
		throw new Error("Wrong dim.");
	return Math.atan2(this[1], this[0]);
};

Vector.prototype.scale = function (x) {
	for (var i = 0; i < this.dim; i++) {
		this[i] *= x;
	}
	return this;
};

Vector.prototype.multiplyByMatrix = function (matrix) {
	var v = [];
	for (var i = 0; i < matrix.length; i++) {
		var row = matrix[i];
		if (row.length !== this.dim)
			throw new Error('Wrong matrix. Expected ' + this.dim + ' rows in ' + (i + 1) + '. column');
		var sum = 0;
		for (var j = 0; j < row.length; j++) {
			sum += this[j] * row[j];
		}
		v[i] = sum;
	}
	this.createFrom(v);
	return this;
};

Vector.createFromFlapArray = function (radius, i) {
	var x = i % (radius << 1);
	var y = i / (radius << 1) | 0;
	return new Vector(radius - x, radius - y);
};