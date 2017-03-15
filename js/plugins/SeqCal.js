function SeqCal() {
	Plugin.apply(this, arguments);
	//adapt drawing
	Canvas.call(this, this.output);


	var layout = new Layout(this.width, this.height);
	layout.padding = 10;



	this.addView();
	var inpSize = 16,
		yoffset = 0;
	this.addSettings([{
		'title': 'SeqCal Cols',
		'type': 'number',
		'value': inpSize,
		'input.name': 'inpSize',
		'input.group': 'input-group',
		'input.class': 'form-control'
	}, {
		'title': 'Y offset',
		'type': 'number',
		'value': yoffset,
		'input.name': 'yoffset',
		'input.group': 'input-group',
		'input.class': 'form-control'
	}]);

	var eventCount = function(data, date) {
		var ct = 0;
		for (var i in data) {
			var dt = new Date(data[i].start.dateTime);
			if (dt.getFullYear() == date.getFullYear() &&
				dt.getMonth() == date.getMonth() &&
				dt.getDate() == date.getDate()) {
				ct++;
			}
		}
		return ct;
	}
	this.view = function(param) {

		this.clear();
		inpSize = param && param.inpSize ? Number(param.inpSize) : inpSize;
		yoffset = param && param.yoffset ? Number(param.yoffset) * 10 : yoffset;

		var data = this.data;
		if (!this.data) return false;
		var rects = [];
		layout.clear();

		for (var i in this.data) {
			var dt = new Date(this.data[i].date);
			var rect = new Day(dt);
			rect.lvl = this.data[i].events.length;
			rects.push(rect);
			this.add(rect);
			layout.add(rect);
		}

		layout.margin.y = Number(yoffset);
		layout.table(inpSize);

		this.draw(rects);

	}


	if (this._isView()) {
		this.showSettings();
		this.view();
	}
	this.onZoom = function(zoom) {
		if (this._isView()) {
			inpSize = inpSize + zoom;
			this.view();
		}
	}
}
SeqCal.prototype = Object.create(Plugin.prototype);
SeqCal.prototype.constructor = SeqCal;


function Day(date) {
	Drawable.call(this);

	this.date = date;
	this.fillStyle = '#fff';
	this.fontColor = '#888';
	this.evts = [];
	this.marked = false;
	this.fontSize = 10;
	this.h = 30;
	this.lvl = 0;
	var colorCodes = ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#7f1ae5'];
	var year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate();
	this.label = [day + '-' + month + '-' + year];

	this.setDate = function(date) {
		this.date = date;
	}

	this.draw = function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = this.fillStyle;
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.closePath();
		ctx.stroke();

		var lvl = this.lvl >= colorCodes.length ? colorCodes.length - 1 : this.lvl;
		ctx.fillStyle = colorCodes[lvl];
		ctx.fill();
		ctx.restore();
		Drawable.prototype.draw.call(this, ctx);

	}

}

Day.prototype = Object.create(Drawable.prototype);
Day.prototype.constructor = Day;