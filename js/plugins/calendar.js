function Calendar() {
	Plugin.apply(this, arguments);
	Canvas.call(this, this.output);

	var layout = new Layout(this.width, this.height);
	layout.padding = 10;

	this.view = function() {
		if (!this.isView()) {
			return false;
		}
		this.clear();

		var data = this.data();
		if (data) {
			var i = 0,
				ln = data.length;

			layout.clear();
			var startDate = new Date(data[0].start.dateTime),
				eDate = new Date(data[ln - 1].end.dateTime);


			//list of months
			var sDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1),
				eDate = new Date(eDate.getFullYear(), eDate.getMonth() + 1, 1),
				months = [];
			while (sDate < eDate) {
				months.push(sDate.getMonth() + '_' + sDate.getFullYear());
				sDate.setDate(sDate.getDate() + 1);
			}
			months = months.unique();
			for (var idx in months) {
				var month = new Month(months[idx], data);
				layout.add(month);
				this.add(month);
			}
			layout.table(Number(opt.value));
			this.draw();

		} else {
			console.log('Calendar:view have not engough data!');
		}
	}

	this.addView('Calendar');
	var opt = this.addModel('Calendar Cols', {
		'type': 'number',
		'value': 6,
		'input.group': 'input-group',
		'input.class': 'form-control'
	});
	opt.onchange = this.view.bind(this);

}
Calendar.prototype = Object.create(Plugin.prototype);
Calendar.prototype.constructor = Calendar;


function Month(strMY, data) {
	Drawable.call(this);
	var _sp = strMY.split('_'),
		mn = Number(_sp[0]),
		year = Number(_sp[1]);

	var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	this.fillStyle = '#fff';
	this.fontColor = '#888';

	var date = new Date(year, mn, 1);

	this.draw = function(ctx) {
		ctx.save();
		//title
		ctx.font = 'bold 12pt Courier';
		ctx.fillStyle = '#444';
		ctx.textBaseline = "middle";
		ctx.textAlign = "center"
		ctx.fillText(mL[mn] + "'" + year, this.x + this.width() / 2, this.y + 10);
		//draw dates
		ctx.font = 'normal 12pt Courier';
		var w = this.width() / 7,
			y = this.y + 25,
			curDate = new Date(date.getFullYear(), date.getMonth(), 1),
			endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
		while (curDate < endDate) {
			var day = curDate.getDay();
			if (day === 0 && curDate.getDate() > 1) {
				y += w;
			}
			var x = this.x + day * w;
			ctx.beginPath();
			ctx.rect(x, y, w, w);
			ctx.closePath();
			ctx.stroke();
			if (hasEvent(curDate)) {
				ctx.fillStyle = '#ccc';
				ctx.fill();
			}
			ctx.fillStyle = '#444';
			ctx.fillText(curDate.getDate(), x + w / 2, y + w / 2);
			curDate.setDate(curDate.getDate() + 1);
		}
		ctx.restore();
	}

	function hasEvent(date) {
		for (var i in data) {
			var dt = new Date(data[i].start.dateTime);
			if (dt.getFullYear() == date.getFullYear() &&
				dt.getMonth() == date.getMonth() &&
				dt.getDate() == date.getDate()) {
				return true;
			}
		}
		return false;
	}
}

Month.prototype = Object.create(Drawable.prototype);
Month.prototype.constructor = Month;