function Earthquake(input, output) {
	Plugin.apply(this, arguments);
	Canvas.call(this, output);

	var distance = this.height / 2 - 100;
	var dataImage = false;
	var yRotate = 0;
	var xRotate = 0;

	this.view = function(param) {
		this.clear();
		var width = this.width;
		var height = this.height;
		var earth = new Earth(Math.abs(distance));
		earth.position(width / 2, height / 2).rotate(xRotate, yRotate);
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
			yRotate += dy / 10;
			xRotate += dx / 10;
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

function Earth(r) {
	Drawable.call(this);
	this.r = r;
	this.rotation = {
		x: 0,
		y: 0
	};

	this.rotate = function(dx, dy) {
		if (undefined !== dx && undefined != dy) {
			this.rotation.x += dx;
			this.rotation.y += dy;
			return this;
		} else {
			return this.rotation;
		}
	}
	var drawPoint = function(ctx, point) {
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#FF0000';
		ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI, false);
		ctx.stroke();
		ctx.restore();
	}
	this.draw = function(ctx) {
		var rad = Math.PI / 180;
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		//axis
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#003300';
		for (var i = 0; i < 360; i += 1) {
			var x1 = this.x + this.r * Math.cos((this.rotation.x + i) * rad);
			var x2 = this.x + this.r * Math.cos((this.rotation.x + i + 180) * rad);
			var y1 = this.y + this.r * Math.sin((this.rotation.y + i) * rad);
			var y2 = this.y + this.r * Math.sin((this.rotation.y + i + 180) * rad);

			var clrn = 255 + 16711425 * (i / 360);
			clrn = clrn.toFixed(0);
			ctx.beginPath();
			ctx.strokeStyle = '#' + Number(clrn).toString(16);
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}
		ctx.restore();

	}

}
Earth.prototype = Object.create(Drawable.prototype);
Earth.prototype.constructor = Earth;