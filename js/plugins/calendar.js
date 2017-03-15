function Calendar() {
	Plugin.apply(this, arguments);
	Canvas.call(this, this.output);

	var layout = new Layout(this.width, this.height);
	layout.padding = 20;
	var tblCol = 1;
	this.view = function(param) {
		this.clear();
		tblCol = param && param.tblCol ? Number(param.tblCol) : tblCol;

		if (!this.data || !this.data.length) return false;
		layout.clear();
		var months = this.data.map(function(el) {
			var dt = new Date(el.date);
			return dt.getMonth() + '_' + dt.getFullYear();
		}).unique();

		for (var idx in months) {
			var sp = months[idx].split('_'),
				mn = Number(sp[0]),
				y = Number(sp[1]);
			var monthData = this.data.filter(function(ev) {
				var dt = new Date(ev.date);
				return dt.getMonth() == mn && dt.getFullYear() == y;
			});

			var month = new Month(new Date(y, mn, 1), monthData);
			layout.add(month);
			this.add(month);
		}
		layout.table(tblCol);
		this.draw();
	}

	this.addView();
	this.addSettings([{
		'title': 'Columns',
		'type': 'number',
		'value': tblCol,
		'input.name': 'tblCol',
		'input.group': 'input-group',
		'input.class': 'form-control'

	}]);

	if (this._isView()) {
		this.showSettings();
		this.view();
	}
	this.onZoom = function(zoom) {
		if (this._isView()) {
			tblCol = tblCol + zoom;
			this.view();
		}
	}
}
Calendar.prototype = Object.create(Plugin.prototype);
Calendar.prototype.constructor = Calendar;


function Month(date, data) {
	Drawable.call(this);

	this.date = date;
	this.data = data;

	var mn = this.date.getMonth(),
		year = this.date.getYear() - 100;

	var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	this.fillStyle = '#fff';
	this.fontColor = '#888';


	this.draw = function(ctx) {
		ctx.save();
		//title
		ctx.font = 'bold 12pt Courier';
		ctx.fillStyle = '#444';
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillText(mL[mn] + "'" + year, this.x + this.width() / 2, this.y);
		//draw dates
		ctx.font = 'normal 12pt Courier';
		var w = this.width() / 7,
			h = this.height() - 25,
			y = this.y + 25,
			curDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1),
			endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1),
			lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate(),
			startDay = curDate.getDay(),
			numRows = (startDay + lastDay) / 7;
		if ((startDay + lastDay - 1) % 7 != 0) numRows += 1;
		h = h / numRows;
		while (curDate < endDate) {
			var day = curDate.getDay();
			if (day === 0 && curDate.getDate() > 1) {
				y += h;
			}
			var x = this.x + day * w;
			ctx.save();
			ctx.beginPath();
			ctx.rect(x, y, w, h);
			ctx.closePath();
			ctx.stroke();
			var todays = this.data.find(function(ev) {
					var dt = new Date(ev.date);
					return dt.getFullYear() == curDate.getFullYear() &&
						dt.getMonth() == curDate.getMonth() &&
						dt.getDate() == curDate.getDate();
				}) || {
					events: []
				},
				colorCodes = ['#ffffff', '#ff0000', '#00ff00', '#0000ff'];

			var lvl = todays.events.length > 0 ? todays.events.length : 0;
			lvl = lvl >= colorCodes.length ? colorCodes.length - 1 : lvl;


			ctx.fillStyle = colorCodes[lvl];
			ctx.fill();
			ctx.restore();
			ctx.fillText(curDate.getDate(), x + w / 2, y + w / 2);
			curDate.setDate(curDate.getDate() + 1);
		}
		ctx.restore();
	}

}

Month.prototype = Object.create(Drawable.prototype);
Month.prototype.constructor = Month;