function Cycloid() {
	Plugin.apply(this, arguments);
	//adapt drawing
	Canvas.call(this, this.output);

	var _name = this.getName();


	this.addView(_name);
	/* TODO: make rows and cols configurable */
	var inpRadious = this.addModel(_name + ' Radius', {
		'type': 'number',
		'value': 43,
		'input.group': 'input-group',
		'input.class': 'form-control'
	});

	this.view = function() {
		this.clear();

		var data = this.data();
		if (!data) {
			console.log("Not engough data!", this);
			return false;
		}
		var centerX = this.width / 2,
			centerY = this.height / 2,
			radius = parseInt(inpRadious.value);

		for (var i in data) {
			var date = new Date(data[i].start.dateTime),
				hour = date.getHours(),
				hour = hour.mapTo(0, 23, 0, 4);

			var circle = new PeripheralCircle(centerX, centerY, radius, hour);
			this.add(circle);
			radius += hour;

		}
		this.draw();
	}

}
Cycloid.prototype = Object.create(Plugin.prototype);
Cycloid.prototype.constructor = Cycloid;

function PeripheralCircle(x, y, r) {
	Drawable.call(this);
	this.x = x;
	this.y = y;
	this.r = r;

	this.draw = function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
		ctx.strokeStyle = '#444';
		ctx.stroke();
		ctx.restore();
	}
}

PeripheralCircle.prototype = Object.create(Drawable.prototype);
PeripheralCircle.prototype.constructor = PeripheralCircle;