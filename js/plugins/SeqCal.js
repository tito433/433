function SeqCal() {
	Plugin.apply(this, arguments);
	Canvas.apply(this, Array.prototype.slice.call(arguments, 1));

	var layout = new Layout(this.width, this.height);
	layout.padding = 10;
	this.addView();
	var inpSize = 4,
		showEmpty = true;

	this.draw = function(param) {
		inpSize = arguments.length > 0 && "inpSize" in param ? Number(param.inpSize) : inpSize;
		showEmpty = arguments.length > 0 && "showEmpty" in param ? param.showEmpty : showEmpty;
		if (!this.data || !(this.data instanceof Array) || (0 == this.data.length)) {
			return false;
		}

		layout.clear();
		var curDate = new Date(this.data[0].date),
			endDate = new Date(this.data[this.data.length - 1].date);
		while (curDate <= endDate) {
			var events = this.data.filter(function(ev) {
				var dt = new Date(ev.date);
				return dt.getFullYear() === curDate.getFullYear() &&
					dt.getMonth() === curDate.getMonth() &&
					dt.getDate() === curDate.getDate();
			});
			if (events.length == 0 && showEmpty || events.length > 0) {
				layout.add(new Day(curDate, events));
			}

			curDate.setDate(curDate.getDate() + 1);
		}

		layout.table(inpSize);
		this.add(layout);
	}
	this.view = function() {
		this.addSettings([{
			'title': 'SeqCal Cols',
			'type': 'number',
			'value': inpSize,
			'input.name': 'inpSize',
			'input.group': 'input-group',
			'input.class': 'form-control'
		}, {
			'title': 'Show empty',
			'type': 'checkbox',
			'input.name': 'showEmpty',
			'input.value': showEmpty
		}]);
		this.draw();
	}
	this.onZoom = function(zoom) {
		if (this.isView()) {
			layout.margin.y += zoom * 100;
			this.draw();
		}
	}
}
SeqCal.prototype = Object.create(Plugin.prototype);
SeqCal.prototype.constructor = SeqCal;


function Day(date, evts) {
	Drawable.call(this);

	this.fillStyle = '#fff';
	this.date = date;
	this.evts = evts;
	this.marked = false;
	this.fontSize = 10;
	this.h = 30;
	this.lvl = 0;
	this.label = this.evts.map(function(dt, index) {
		var dd = new Date(dt.date),
			h = dd.getHours();
		return h > 12 ? h - 12 : h;
	});
	this.draw = function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = this.fillStyle;
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.closePath();
		ctx.stroke();
		var colorCodes = ['#fff', '#f7b9b9', '#f95959', '#f70404'];
		var lvl = this.lvl >= colorCodes.length ? colorCodes.length - 1 : this.evts.length;
		ctx.fillStyle = colorCodes[lvl];
		ctx.fill();
		//draw lablel
		ctx.beginPath();
		ctx.font = "12px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = '#000';
		ctx.textBaseline = "middle";
		ctx.fillText(this.label, this.x + this.width() / 2, this.y + this.height() / 2)
		ctx.restore();

	}

}

Day.prototype = Object.create(Drawable.prototype);
Day.prototype.constructor = Day;