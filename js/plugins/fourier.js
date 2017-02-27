function Fourier(input, output) {
	Plugin.apply(this, arguments);

	Canvas.call(this, output);

	this.view = function() {
		var ctx = this._ctx;
		this.x = 0;
		this.y = this.height / 2;
		ctx.clearRect(this.x, this.y, this.width, this.height);
		ctx.save();
		ctx.font = 'bold 10pt Courier';
		ctx.fillStyle = '#444';
		ctx.textBaseline = "middle";
		ctx.textAlign = "right"
		ctx.fillText('Fourier', this.x + this.width, 8);
		//x axis
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = '#ff0000';
		ctx.lineWidth = 2;
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.width, this.y);
		ctx.stroke();
		ctx.restore();

		var perY = this.height / (2 * 24);

		if (this.data && this.data.length) {
			for (var i = 0, ln = this.data.length; i < 20; i++) {
				var cDate = new Date(this.data[i].start.dateTime),
					hour = cDate.getHours(),
					day = cDate.getDate();
				this._drawSine(ctx, perY * hour, day);
			}
		}

		ctx.restore();

	}
	this._drawSine = function(ctx, amp, freq) {
		ctx.beginPath();
		ctx.lineWidth = 0.5;
		ctx.moveTo(this.x, this.y);
		for (var i = 0; i <= this.width; i++) {
			x = i;
			cx = (2 * freq * Math.PI) / (this.width / i);
			y = amp * Math.sin(cx);
			ctx.lineTo(x, this.y - y);

		}
		ctx.stroke();
	}
	this.addView();
	if (this._isView()) this.view();
}

// //make this Chart resizeable.
function FChart() {
	Drawable.call(this);
	this._data = [];
	this._grid = {
		'x': 133,
		'y': 24
	};
	this._title = false;
	var animate = false;
	var _ctx = false;
	var _data_backup = [];

	this.data = function() {
		if (arguments.length == 1) {
			this._data = arguments[0] || [];
			return this;
		} else {
			return this._data;
		}
	}
	this.grid = function(b) {
		if (typeof b === 'boolean') {
			_show_grid = b;
			return this;
		} else {
			return _show_grid;
		}
	}
	this.draw = function(ctx) {
		//i clean my mess!


		var x = this.x,
			y = this.y,
			w = this.width(),
			h = this.height();
		ctx.save();
		if (this._title) {
			ctx.font = 'bold 16pt Courier';
			ctx.fillStyle = '#444';
			ctx.textBaseline = "middle";
			ctx.textAlign = "center"
			ctx.fillText(this._title, this.x + this.width() / 2, this.y + 8);
			y += 25;
			h -= 25;

		}
		this._grid.x = this._data.reduce(function(a, b) {
			return a > b.x ? a : b.x;
		}, 0);
		this._grid.y = this._data.reduce(function(a, b) {
			return a > b.y ? a : b.y;
		}, 0);

		if (this._grid.y) {
			x += 20;
			w -= 20;
		}


		if (this._grid.x) {
			for (var i = 1, ln = 360; i <= ln; i++) {
				var ix = i.mapTo(1, ln, x, x + w);
				if (i % 2 == 0) {
					if (_show_grid) this.drawLine(ctx, ix, y + h, ix, y);
					this.label(ctx, ix, y + h, i, 3);
				}
			}
		}

		new Line(3).position(x, y).size(x, y + h).draw(ctx);
		if (this._grid.y) {
			for (var i = 0, ln = this._grid.y; i <= ln; i++) {
				var iy = this.mapTo(i, 0, ln, y + h, y);
				if (i && i % 3 == 0) this.label(ctx, x, iy, i, 4);
				if (_show_grid) this.drawLine(ctx, x, iy, x + w, iy);
			}

		}
		if (this._data && this._data.length) {
			for (var i in this._data) {
				var point = this._data[i];
				var mapToY = this.mapTo(point.y, 0, this._grid.y, y + h, y);
				var mapToX = this.mapTo(point.x, 0, this._grid.x, x, x + w);
				if (this.vision(mapToX, mapToY)) {
					ctx.beginPath();
					ctx.fillStyle = '#000';
					ctx.arc(mapToX, mapToY, 2, 0, 2 * Math.PI);
					ctx.fill();
				}

			}
			ctx.restore();
		}

	}
	this.drawLine = function(ctx, x, y, w, h) {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = '#ccc';
		ctx.lineWidth = 0.5;
		ctx.moveTo(x, y);
		ctx.lineTo(w, h);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}
	this.label = function(ctx, x, y, txt, dir) {
		ctx.save();
		ctx.beginPath();
		var lx = x,
			ly = y,
			lx2 = x,
			ly2 = y;
		switch (dir) {
			case 4:
				lx -= 4;
				x -= 15;
				break;
			case 3:
				ly2 += 4;
				y += 15
			default:
				break;
		}
		ctx.font = '10px arial';
		ctx.fillStyle = ctx.strokeStyle = '#000';
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillText(txt, x, y);
		ctx.moveTo(lx, ly);
		ctx.lineTo(lx2, ly2);
		ctx.stroke();
		ctx.restore();
	}
	this.title = function() {
		if (arguments.length) {
			this._title = arguments[0];
			return this;
		} else {
			return this._title;
		}
	}

}
FChart.prototype = Object.create(Drawable.prototype);
FChart.prototype.constructor = FChart;