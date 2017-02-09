function Cycloid() {
	Plugin.apply(this, arguments);
	//adapt drawing
	Canvas.call(this, this.output);

	var self = this;


	this.addView();

	this.view = function() {
		this.clear();
		var centerX = this.width / 2,
			centerY = this.height / 2;
		var maxR = this.height / 2;

		var data = this.data;
		if (!this.data) return false;
		for (var i = 0, ln = this.data.length; i < ln; i++) {
			var date = new Date(this.data[i].start.dateTime);
			var day = date.getDate(),
				hour = date.getHours();
			var layer = new PeripheralCircle(centerX, centerY, day.mapTo(1, 31, 0, maxR));
			layer.size = hour;
			this.add(layer);
		}
		this.draw();
	}

	if (this._isView()) this.view();
}
Cycloid.prototype = Object.create(Plugin.prototype);
Cycloid.prototype.constructor = Cycloid;

function PeripheralCircle(x, y, r) {
	Drawable.call(this);
	this.x = x;
	this.y = y;
	this.r = r;
	this.size = 12;

	var getRandom = function(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	this.draw = function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		var spec = Math.round(this.size.mapTo(0, 23, 430, 740));

		var clrIndx = Math.round(spec.mapTo(430, 740, 255, 16711680));
		var clr = '#' + clrIndx.toString(16)
		// ctx.strokeStyle = clr;
		// ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		// ctx.stroke();

		var sr = this.r / this.size,
			k = this.size + 1;
		ctx.beginPath();
		ctx.strokeStyle = clr;


		var theta = 0,
			rad = Math.PI / 180;

		while (theta <= 360) {
			var deg = rad * theta;
			var x = sr * k * Math.cos(deg) - sr * Math.cos(k * deg),
				y = sr * k * Math.sin(deg) - sr * Math.sin(k * deg);
			if (theta == 0) {
				ctx.moveTo(this.x + x, this.y + y);
			} else {
				ctx.lineTo(this.x + x, this.y + y);
			}
			theta++;
		}
		ctx.stroke();
		ctx.restore();
	}

}

PeripheralCircle.prototype = Object.create(Drawable.prototype);
PeripheralCircle.prototype.constructor = PeripheralCircle;