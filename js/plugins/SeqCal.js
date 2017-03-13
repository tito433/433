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
		yoffset = param && param.yoffset ? Number(param.yoffset) : yoffset;

		var data = this.data;
		if (!this.data) return false;
		var rects = [];

		layout.clear();
		var startDate = new Date(data[0].start.dateTime),
			eDate = new Date(data[data.length - 1].end.dateTime);

		startDate.setMinutes(0);
		startDate.setHours(0);

		while (startDate <= eDate) {
			var date = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
			var rect = new Day(date);

			rect.lvl = eventCount(data, date);
			rects.push(rect);

			this.add(rect);
			layout.add(rect);
			startDate.setDate(startDate.getDate() + 1);
		}
		layout.margin.y = Number(yoffset);
		layout.table(inpSize);
		this._getMeaning(rects);
		this.draw(rects);

	}
	this._getMeaning = function(rects) {
		var dt = rects.map(function(obj) {
			return obj.lvl;
		});
		var bites = dt.chunk(16);

		var fnGetHex = function(arr) {

			var bite = arr.chunk(4, true);
			console.log(arr, bite)
				//fix lastbit
			var last = bite[bite.length - 1];
			var ln = 4 - last.length;
			bite[bite.length - 1] = last.unshift(new Array(ln).fill(0));
			var res = bite.reduce(function(acc, val) {
				var sm = 0;
				val.forEach(function(v, idx) {
					if (Number(v) == 1) {
						sm += Math.pow(2, idx);
					}
				});
				if (sm > 9) {
					var rem = sm % 10;
					acc = String.fromCharCode(65 + rem);
				} else {
					acc = sm;
				}
				return acc;

			});
			return res;

		}
		var message = bites.reduce(function(acc, bits) {
			var h = fnGetHex(bits);
			return acc + String.fromCharCode(parseInt(h, 16));
		}, '');
		console.log(message);

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