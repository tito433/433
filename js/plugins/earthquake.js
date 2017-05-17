function Point3D(x, y, z) {
	this.x = isNaN(Number(x)) ? 0 : x;
	this.y = isNaN(Number(y)) ? 0 : y;
	this.z = isNaN(Number(z)) ? 0 : z;
}

function Earthquake(input, output) {
	Plugin.apply(this, arguments);
	Canvas.call(this, output);

	var distance = this.height / 2 - 100;
	var rotation = new Point3D();
	this.draw = function(param) {
		this.clear();
		var earth = new Earth(distance);
		earth.position(this.width / 2, this.height / 2);
		this.add(earth);
	}

	this.addView();

	this.onDrag = function(dx, dy) {
		if (this.isView()) {
			rotation.y -= Math.round(dy) / 50;
			rotation.x += Math.round(dx) / 30;
			this.draw();
		}

	}
	this.onZoom = function(zoom) {
		if (this.isView()) {
			distance += zoom * 10;
			this.draw();
		}
	}
}

function Earth(radius) {
	Drawable.call(this);
	var dt = 0;

	this.rotation = function(dx, dy) {
		if (dx != undefined) {
			if (dx instanceof Point3D) {
				this._rotation = dx;
			} else {
				this._rotation.x = Number(dx);
			}

			if (dy != undefined) {
				this._rotation.y = Number(dy);
			}
			return this;
		} else {
			return this._rotation;
		}
	}
	this.draw = function(ctx) {
		dt += 0.013;
		ctx.save();
		ctx.font = "12px Arial";
		ctx.textAlign = "center";

		var dx = this.x,
			dy = this.y;

		ctx.beginPath();
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#00F';
		ctx.moveTo(dx - 20, this.y);
		ctx.lineTo(dx + 20, this.y);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(dx, dy - 20);
		ctx.lineTo(dx, dy + 20);
		ctx.stroke();

		dx = this.x + radius * Math.cos(dt);
		dy = this.y + radius * Math.sin(dt);

		ctx.beginPath();
		ctx.lineWidth = 20;
		ctx.strokeStyle = '#000';
		ctx.arc(dx, dy, 45, 0, 2 * Math.PI);
		ctx.stroke();
		//draw data
		ctx.restore();

	}

}
Earth.prototype = Object.create(Drawable.prototype);
Earth.prototype.constructor = Earth;