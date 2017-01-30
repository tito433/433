function SeqCal() {
	Plugin.apply(this, arguments);
	//adapt drawing
	Canvas.call(this, this.output);

	var size = 27,
		fontSize = 12;
	var layout = new Layout(this.width, this.height);
	layout.padding = 3;


	this.view = function() {
		var data = this.data();
		if (data) {

			this.clear();
			layout.clear();
			var startDate = new Date(data[0].start.dateTime),
				eDate = new Date(data[data.length - 1].end.dateTime);

			startDate.setMinutes(0);
			startDate.setHours(0);

			while (startDate <= eDate) {
				var date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
				var rect = new Day(date);
				rect.fontSize = fontSize;
				var todayEvt = data.filter(function(ev) {
					var dt = new Date(ev.start.dateTime);
					return dt.getFullYear() == date.getFullYear() &&
						dt.getMonth() == date.getMonth() && dt.getDate() == date.getDate();
				});

				if (todayEvt.length) {
					for (var i in todayEvt) {
						var d = new Date(todayEvt[i].start.dateTime);
						var hour = d.getHours(),
							mins = d.getMinutes();
						rect.setDate(d);
						rect.events(hour + ':' + mins);
					}

					if (todayEvt.length > 1) {
						rect.fillStyle = '#444';
					}
				}
				startDate.setDate(startDate.getDate() + 1);
				layout.add(rect);
				this.add(rect);
			}
			layout.table(size);
			this.draw();
		} else {
			console.log('SeqCal:view have not engough data!');
		}
	}

	this.addView('SeqCal');
	/* TODO: make rows and cols configurable */
	var inpSize = this.addModel('SeqCal Cols', {
		'type': 'number',
		'value': size,
		'input.group': 'input-group',
		'input.class': 'form-control'
	});

	//we need to decouple 'em. too much bindings
	inpSize.onchange = function(ev) {
		if (this.isView()) {
			size = parseInt(ev.target.value);
			this.view();
		}

	}.bind(this);

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
		if (this.marked) ctx.fill();
		Drawable.prototype.draw.call(this, ctx);
		ctx.restore();
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