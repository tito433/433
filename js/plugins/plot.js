function Plot() {
	Plugin.apply(this, arguments);
	Canvas.apply(this, Array.prototype.slice.call(arguments, 1));

	this._chart = [];
	var _layout = new Layout(this.width, this.height);
	var showGrid = false;
	_layout.padding = 20;

	this._format = {
		'Event Count': function(data) {
			var fmtData = [];
			if (data instanceof Array && data.length) {
				data.forEach(function(dt, idx) {
					var dt = new Date(dt.date);
					fmtData.push(new Point(idx, dt.getHours()));
				});
			}
			return fmtData;
		},
		'Gap': function(data) {
			var fmtData = [];
			if (data instanceof Array && data.length) {
				var date = new Date(data[0].date);
				for (var i = 0, ln = data.length; i < ln; i++) {
					var cDate = new Date(data[i].date),
						offsetY = Math.round((cDate - date) / 86400000);
					date = cDate;
					fmtData.push(new Point(i, offsetY));
				}
			}

			return fmtData;
		},
		'Days': function(data) {
			var fmtData = [];
			if (data instanceof Array && data.length) {
				data.forEach(function(dt) {
					var dt = new Date(dt.date);
					var idx = dt.getDate();
					var pval = fmtData[idx] ? fmtData[idx].y : 0;
					fmtData[idx] = new Point(idx, pval + 1);
				});
			}
			return fmtData;
		}
	}
	this.draw = function(param) {
		this.clear();
		showGrid = param && param.showGrid != undefined ? param.showGrid : showGrid;
		for (var title in this._format) {
			var chart = new Chart().title(title).size(this.width / 2 - 60, this.height / 2 - 40);
			chart.grid(showGrid).data(this._format[title](this.data));
			_layout.add(chart);
		}
		_layout.table(2, 2);
		this.add(_layout);
	}
	this.view = function() {
		this.addSettings({
			'title': 'Plot grid',
			'type': 'checkbox',
			'input.name': 'showGrid',
			'input.value': showGrid
		});
		this.draw();
	}

	this.addView();
}

//make this Chart resizeable.
function Chart() {
	Drawable.call(this);
	this._data = [];
	this._grid = {
		'x': 133,
		'y': 24
	};
	this._title = false;
	var _show_grid = true;

	this.data = function() {
		if (arguments.length == 1) {
			this._data = arguments[0];
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
		var data = this._data;


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
		this._grid.x = data.reduce(function(a, b) {
			return a > b.x ? a : b.x;
		}, 365);
		this._grid.y = data.reduce(function(a, b) {
			return a > b.y ? a : b.y;
		}, 24);

		if (this._grid.y) {
			x += 20;
			w -= 20;
		}
		if (this._grid.x) {
			h -= 20;
			new Line().position(x, y + h).size(x + w, y + h).draw(ctx);

			var tagGap = Math.floor(this._grid.x / 30);
			for (var i = 0, ln = this._grid.x; i <= ln; i++) {
				var ix = this.mapTo(i, 0, ln, x, x + w);
				if (i && i % tagGap == 0) {
					if (_show_grid) this.drawLine(ctx, ix, y + h, ix, y);
					if (i % (tagGap * 2) == 0) this.label(ctx, ix, y + h, i, 3);
				}
			}
		}

		if (this._grid.y) {
			new Line().position(x, y).size(x, y + h).draw(ctx);
			for (var i = 0, ln = this._grid.y; i <= ln; i++) {
				var iy = this.mapTo(i, 0, ln, y + h, y);
				if (i && i % 2 == 0) this.label(ctx, x, iy, i, 4);
				if (_show_grid) this.drawLine(ctx, x, iy, x + w, iy);
			}

		}
		if (data && data.length) {
			for (var i in data) {
				var point = data[i];
				var mapToY = this.mapTo(point.y, 0, this._grid.y, y + h, y);
				var mapToX = this.mapTo(point.x, 0, this._grid.x, x, x + w);
				ctx.beginPath();
				ctx.fillStyle = '#000';
				ctx.arc(mapToX, mapToY, 2, 0, 2 * Math.PI);
				ctx.fill();
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
	this.mapTo = function(x, a, b, c, d) {
		return (x - a) / (b - a) * (d - c) + c;
	}

}
Chart.prototype = Object.create(Drawable.prototype);
Chart.prototype.constructor = Chart;