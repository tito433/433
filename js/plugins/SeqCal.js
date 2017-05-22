function SeqCal() {
	Plugin.apply(this, arguments);
	Canvas.call(this, this.output);

	var layout = new Layout(this.width, this.height);
	layout.padding = 10;
	this.addView();
	var inpSize = 3;

	this.draw = function() {

		if (!this.data || !(this.data instanceof Array) || (0 == this.data.length)) {
			return false;
		}
		var rects = [];
		layout.clear();

		var curDate = new Date(this.data[0].date),
			endDate = new Date(this.data[this.data.length - 1].date);
		while (curDate < endDate) {
			var events = this.data.filter(function(ev) {
				var dt = new Date(ev.date);
				return dt.getFullYear() === curDate.getFullYear() &&
					dt.getMonth() === curDate.getMonth() &&
					dt.getDate() === curDate.getDate();
			});
			if (events.length) {
				layout.add(new Day(events));
			}
			curDate.setDate(curDate.getDate() + 1);
		}

		layout.table(inpSize);
		this.add(layout);
	}
	this.view = function(param) {

		this.clear();
		inpSize = param && param.inpSize ? Number(param.inpSize) : inpSize;

		this.addSettings([{
			'title': 'SeqCal Cols',
			'type': 'number',
			'value': inpSize,
			'input.name': 'inpSize',
			'input.group': 'input-group',
			'input.class': 'form-control'
		}]);
		this.draw();

	}
	this.onDrag = function(dx, dy) {
		if (this._isView()) {
			layout.margin.x -= dx;
			layout.margin.y -= dy;
			this.view();
		}

	}
	this.onZoom = function(zoom) {
		if (this.isView()) {
			inpSize = inpSize + zoom;
			this.draw();
		}
	}
}
SeqCal.prototype = Object.create(Plugin.prototype);
SeqCal.prototype.constructor = SeqCal;


function Day(evts) {
	Drawable.call(this);

	this.fillStyle = '#fff';
	this.fontColor = '#fff';
	this.evts = evts;
	this.marked = false;
	this.fontSize = 10;
	this.h = 30;
	this.lvl = 0;
	this.label = this.evts.map(function(dt, index) {
		var dd = new Date(dt.date);
		return dd.getHours();
	});
	this.lvl = this.evts.length;
	this.draw = function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = this.fillStyle;
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.closePath();
		ctx.stroke();
		var colorCodes = ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#7f1ae5'];
		var lvl = this.lvl >= colorCodes.length ? colorCodes.length - 1 : this.lvl;
		ctx.fillStyle = colorCodes[lvl];
		ctx.fill();
		//draw lablel
		ctx.font = "12px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = this.fontColor;
		ctx.textBaseline = "middle";
		ctx.fillText(this.label, this.x + this.width() / 2, this.y + this.height() / 2)
		ctx.restore();

	}

}

Day.prototype = Object.create(Drawable.prototype);
Day.prototype.constructor = Day;