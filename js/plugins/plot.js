function Plot(input, output) {
	Plugin.apply(this, arguments);

	Canvas.call(this, output);

	this._chart = [];


	var showGrid = false;
	this.addModel('Plot grid', {
		'type': 'checkbox',
		'input.name': 'showGrid',
		'input.value': showGrid
	});

	this.view = function(param) {
		this.clear();
		showGrid = param && param.showGrid != undefined ? param.showGrid : showGrid;
		var _layout = new Layout(this.width, this.height);
		_layout.padding = 20;

		for (var title in this._format) {
			var chart = new Chart().title(title).size(this.width / 2 - 60, this.height / 2 - 40);
			chart.format(this._format[title]).grid(showGrid).data(this.data);
			this.add(chart);
			_layout.add(chart);
		}
		_layout.flowLeft();
		this.draw();
	}

	this.addView();

	this._format = {
		'Original': function(data) {
			var fmtData = [];
			if (data instanceof Array && data.length) {
				var date = new Date(data[0].start.dateTime),
					startDate = new Date(date - 86400000),
					endDate = new Date(data[data.length - 1].end.dateTime);

				startDate.setMinutes(0);
				startDate.setHours(0);

				for (var i = 0, ln = data.length; i < ln; i++) {
					var cDate = new Date(data[i].start.dateTime),
						offsetY = cDate.getHours() + (cDate.getMinutes() / 60);
					fmtData.push(new Point(i, offsetY));
				}
			}
			return fmtData;
		},
		'Gap': function(data) {
			var fmtData = [];
			if (data instanceof Array && data.length) {
				var date = new Date(data[0].start.dateTime);
				for (var i = 0, ln = data.length; i < ln; i++) {
					var cDate = new Date(data[i].start.dateTime),
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
				for (var i = 0, ln = data.length; i < ln; i++) {
					var cDate = new Date(data[i].start.dateTime),
						hour = cDate.getHours(),
						day = cDate.getDate();
					fmtData.push(new Point(day, hour));
				}
			}

			return fmtData;
		}
	}

	if (this._isView()) this.view();
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
	var animate = false;
	var _ctx = false;
	var _data_backup = [];
	var _show_grid = true;

	this._fn_data_format = function(d) {
		return d;
	}

	this.format = function(callBack) {
		this._fn_data_format = callBack;
		return this;
	}
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
		//i clean my mess!
		var data = this._fn_data_format(this._data);
		ctx.clearRect(this.x, this.y, this.width(), this.height());
		if (!data.length) {
			return;
		}
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
		}, 0);
		this._grid.y = data.reduce(function(a, b) {
			return a > b.y ? a : b.y;
		}, 0);

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