function Calendar() {
	Canvas.apply(this, ['#output']);

	var layout = new Layout(this.width, this.height);
	layout.padding = 20;
	var tblCol = 4;


	this.draw = function(param) {
		tblCol = param && param.tblCol ? Number(param.tblCol) : tblCol;
		var data = Application.getData() || [];
		if (!data.length) return false;
		layout.clear();

		var months = data.reduce(function(acc, val) {
			var dt = new Date(val.date);
			acc[dt.getMonth() + '_' + dt.getFullYear()] = 1;
			return acc;
		}, []);

		for (var idx in months) {
			var sp = idx.split('_'),
				mn = Number(sp[0]),
				y = Number(sp[1]);
			var monthData = data.filter(function(ev) {
				var dt = new Date(ev.date);
				return dt.getMonth() == mn && dt.getFullYear() == y;
			});

			var month = new Month(new Date(y, mn, 1), monthData);
			layout.add(month);
		}
		layout.table(tblCol, 3);
		this.add(layout);
	}
	this.view = function() {
		Application.addSettings([{
			'title': 'Columns',
			'type': 'number',
			'value': tblCol,
			'input.name': 'tblCol',
			'input.group': 'input-group',
			'input.class': 'form-control'

		}], this.view);
		this.draw();
	}

	Application.UIButton('view', 'Calendar', this.view.bind(this));

	this.onZoom = function(zoom) {
		if (this.isView()) {
			layout.margin.y += zoom * 10;
			this.draw();
		}
	}
}
Calendar.prototype = Plugin;

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
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		var title = mL[mn] + "'" + year;
		ctx.fillText(title, this.x + this.width() / 2, this.y + 8);
		//draw dates
		ctx.font = 'normal 12pt Courier';
		var w = this.width() / 7,
			h = this.height() - 18,
			y = this.y + 18,
			curDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1),
			endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1),
			lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate(),
			startDay = curDate.getDay();


		ctx.strokeStyle = '#ccc';

		h = h / 6;
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

			var events = this.data.filter(function(ev) {
					var dt = new Date(ev.date);
					return dt.getFullYear() === curDate.getFullYear() &&
						dt.getMonth() === curDate.getMonth() &&
						dt.getDate() === curDate.getDate();
				}),
				colorCodes = ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#7f1ae5'];

			var lvl = events && events.length > 0 ? events.length : 0;
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

new Calendar();