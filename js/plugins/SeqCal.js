function SeqCal() {
	Plugin.apply(this, arguments);
	//adapt drawing
	Canvas.call(this, this.output);

	var fontSize = 12;
	var layout = new Layout(this.width, this.height);
	layout.padding = 10;



	this.addView();
	var inpSize = this.addModel('SeqCal Cols', {
		'type': 'number',
		'value': 27,
		'input.group': 'input-group',
		'input.class': 'form-control'
	});

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
	this.view = function() {
		this.clear();
		var data = this.data;
		if (!this.data) return false;



		layout.clear();
		var startDate = new Date(data[0].start.dateTime),
			eDate = new Date(data[data.length - 1].end.dateTime);

		startDate.setMinutes(0);
		startDate.setHours(0);

		while (startDate <= eDate) {
			var date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
			var rect = new Day(date);
			rect.fontSize = fontSize;

			var lvl = eventCount(data, date),
				colorCodes = ['#ffffff', '#ff0000', '#00ff00', '#0000ff'];
			lvl = lvl >= colorCodes.length ? colorCodes.length - 1 : lvl;
			rect.fillStyle = colorCodes[lvl];

			layout.add(rect);
			this.add(rect);
			startDate.setDate(startDate.getDate() + 1);
		}
		layout.table(parseInt(inpSize.value));
		this.draw();

	}
	if (this._isView()) this.view();
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

	var year = date.getFullYear(),
		month = date.getMonth(),
		day = date.getDate();
	this.label = [month + '-' + day, year];

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
		ctx.fill();
		ctx.restore();
		Drawable.prototype.draw.call(this, ctx);

	}
	this.events = function() {
		if (arguments.length == 0) {
			return this.evts;
		} else {
			this.evts = this.evts.concat(Array.prototype.slice.call(arguments));
			this.label = [this.date.getMonth() + '-' + this.date.getDate()];
			this.label = this.label.concat(this.evts);
			this.fillStyle = '#888';
			this.fontColor = '#fff';
			this.marked = true;
			return this;
		}
	}
}

Day.prototype = Object.create(Drawable.prototype);
Day.prototype.constructor = Day;