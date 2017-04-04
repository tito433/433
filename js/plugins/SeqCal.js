function SeqCal() {
	Plugin.apply(this, arguments);
	//adapt drawing
	Canvas.call(this, this.output);


	var layout = new Layout(this.width, this.height);
	layout.padding = 10;



	this.addView();
	var inpSize = 16;


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

		this.addSettings([{
			'title': 'SeqCal Cols',
			'type': 'number',
			'value': inpSize,
			'input.name': 'inpSize',
			'input.group': 'input-group',
			'input.class': 'form-control'
		}]);


		if (!this.data || !(this.data instanceof Array) || (0 == this.data.length)) {
			console.log('No data exit now.')
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

			var rect = new Day(curDate);
			rect.lvl = events && events.length > 0 ? events.length : 0;
			rects.push(rect);
			this.add(rect);
			layout.add(rect);
			curDate.setDate(curDate.getDate() + 1);
		}

		layout.table(inpSize);
		this.draw(rects);

	}


	if (this._isView()) {
		this.view();
	}
	this.onDrag = function(dx, dy) {
		if (this._isView()) {
			layout.margin.x -= dx;
			layout.margin.y -= dy;
			this.view();
		}

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
		var colorCodes = ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#7f1ae5'];
		var lvl = this.lvl >= colorCodes.length ? colorCodes.length - 1 : this.lvl;
		ctx.fillStyle = colorCodes[lvl];
		ctx.fill();
		//draw lablel
		ctx.font = "12px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = 'black';
		ctx.textBaseline = "middle";
		ctx.fillText(this.label, this.x + this.width() / 2, this.y + this.height() / 2)
		ctx.restore();

	}

}

Day.prototype = Object.create(Drawable.prototype);
Day.prototype.constructor = Day;