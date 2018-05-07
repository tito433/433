function SeqCal() {
	Plugin.apply(this, arguments);
	Canvas.apply(this, Array.prototype.slice.call(arguments, 1));

	var layout = new Layout(this.width, this.height);
	layout.padding = 10;
	this.addView();
	var inpSize = 4;

	this.draw = function(param) {
		inpSize = arguments.length > 0 && "inpSize" in param ? Number(param.inpSize) : inpSize;
		if (!this.data || !(this.data instanceof Array) || (0 == this.data.length)) {
			return false;
		}
		this.clear();
		layout.clear();
		var days = this.data.reduce(function(r, a) {
			var dt = new Date(a.date),
				date = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
			r[date.getTime()] = r[date.getTime()] || [];
			r[date.getTime()].push(a);
			return r;
		}, Object.create(null));

		for (var i in days) {
			layout.add(new Day(days[i]));
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


function Day(obj) {
	Drawable.call(this);

	this.evts = obj;
	this.marked = false;
	this.fontSize = 10;
	this.h = 30;
	this.lvl = obj.length;
	this.label = this.evts.map(function(dt) {
		var dd = new Date(dt.date),
			h = dd.getHours();
		return h % 12;
	}).join(',');

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
		ctx.fillStyle = '#000';
		ctx.textBaseline = "middle";
		Drawable.prototype.drawLabel.call(this, ctx, this.label, "center");
		ctx.restore();

	}

}

Day.prototype = Object.create(Drawable.prototype);
Day.prototype.constructor = Day;