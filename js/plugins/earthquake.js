function Earthquake(input, output) {
	Plugin.apply(this, arguments);
	Canvas.call(this, output);

	var distance = this.height / 2 - 100;
	var rotation = new Point3D();


	this.view = function(param) {
		this.clear();
		var earth = new Earth(distance);
		earth.position(this.width / 2, this.height / 2);
		earth.rotation(rotation).data(this.data);
		this.add(earth);
		this.draw();
	}

	this.addView();
	if (this._isView()) {
		this.showSettings();
		this.view();
	}
	this.onDrag = function(dx, dy) {
		if (this._isView()) {
			rotation.y += dy / 10;
			rotation.x += Math.round(dx) / 10;
			this.view();
		}

	}
	this.onZoom = function(zoom) {
		if (this._isView()) {
			distance += zoom * 10;
			this.view();
		}
	}
}


function Point3D(x, y, z) {
	this.x = isNaN(Number(x)) ? 0 : x;
	this.y = isNaN(Number(y)) ? 0 : y;
	this.z = isNaN(Number(z)) ? 0 : z;
}

function Earth(radius) {
	Drawable.call(this);

	this._grid_y = new Array();
	this._grid_x = new Array();
	this.r = Math.abs(radius);
	this.rings = 10;
	this._data = [];

	var rad = Math.PI / 180;
	this._rotation = new Point3D();
	var perRing = 360 / this.rings;

	this._createMesh = function() {
		this._grid_x = [];
		for (var i = 0; i < 360; i += perRing) {
			var phi = (this._rotation.y + i);
			this._grid_x.push({
				t: i,
				x: this.r,
				y: Math.cos(phi * rad) * this.r,
				c: (phi % 360 >= 0 && phi % 360 <= 180 ? '#000' : '#ddd')
			});

		}
		this._grid_y = [];
		for (var i = 0; i < 360; i += perRing) {
			var phi = this._rotation.x + i;
			this._grid_y.push({
				t: i,
				x: Math.sin(phi * rad) * this.r,
				y: this.r,
				c: (phi % 360 >= 90 && phi % 360 <= 270 ? '#000' : '#ddd')
			});

		}
	}
	this.rotation = function(dx, dy) {
		if (dx != undefined) {
			if (dx instanceof Point3D) {
				this._rotation = dx;
			} else {
				this._rotation.x = Number(dx);
			}

			if (dy != undefined) {
				this._rotation.y += Number(dy);
			}
			this._createMesh();
			return this;
		} else {
			return this._rotation;
		}
	}
	this.draw = function(ctx) {
		ctx.save();
		ctx.font = "12px Arial";

		for (var i = 0, sz = Math.min(150, this._data.length); i < sz; i++) {
			var dt = this._data[i],
				lat = this._rotation.x - dt.lat - 90,
				lon = this._rotation.y - dt.lon - 90,
				mag = dt.mag;

			var x = this.r * Math.sin(lon * rad) * Math.cos(lat * rad),
				y = this.r * Math.sin(lon * rad) * Math.sin(lat * rad);
			ctx.beginPath();
			ctx.strokeStyle = '#F00';
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + x, this.y + y);
			ctx.stroke();


		}
		ctx.restore();

		ctx.lineWidth = 0.5;
		for (var i = 0, iz = this._grid_x.length; i < iz; i++) {
			var crl = this._grid_x[i];
			// ctx.fillText(crl.t, this.x, this.y + crl.y);
			ctx.beginPath();
			ctx.strokeStyle = crl.c;
			ctx.ellipse(this.x, this.y, crl.x, Math.abs(crl.y), 0, 0, Math.PI, crl.y < 0);
			ctx.stroke();
		}
		//lon
		for (var i = 0, iz = this._grid_y.length; i < iz; i++) {
			var crl = this._grid_y[i];
			// ctx.fillText(crl.t, this.x + crl.x, this.y - 100);
			ctx.beginPath();
			ctx.strokeStyle = crl.c;
			ctx.ellipse(this.x, this.y, Math.abs(crl.x), crl.y, 0, -Math.PI / 2, Math.PI / 2, crl.x < 0);
			ctx.stroke();
		}
		//draw data

	}
	this.data = function(dt) {
		if (undefined != dt) {
			this._data = dt;
			return this;
		} else {
			return this._data;
		}
	}
	this._createMesh();

}
Earth.prototype = Object.create(Drawable.prototype);
Earth.prototype.constructor = Earth;