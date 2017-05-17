function Fourier(input, output) {
	Plugin.apply(this, arguments);

	Canvas.call(this, output);
	var dayHour = true;
	this.addSettings();

	var inpDeg = 180;
	var inpAmp = 0.21;
	var startDeg = 0;

	this.draw = function(param) {
		this.clear();
		if (!this.data || !this.data.length) return false;

		if (param) {
			dayHour = param.dayHour != undefined ? param.dayHour : dayHour;
			inpDeg = param.inpDeg ? Number(param.inpDeg) : inpDeg;
			inpAmp = param.inpAmp ? Number(param.inpAmp) : inpAmp;
		}


		//move bottom to a drwable object and put it to screen?

		var freq = this.data.map(function(dt) {
			var date = new Date(dt.date);
			var a = date.getHours(),
				f = date.getDate();
			return {
				'a': a,
				'f': f
			};
		});
		var drawer = new MFourier(freq, {
			'dayHour': dayHour,
			'inpDeg': inpDeg,
			'inpAmp': inpAmp
		});
		this.add(drawer);

	}
	this.view = function() {
		this.addSettings([{
			'title': 'Fourier span.',
			'type': 'number',
			'value': inpDeg,
			'input.name': 'inpDeg',
			'input.group': 'input-group',
			'input.class': 'form-control',
			'input.addon': '&deg;'
		}, {
			'title': 'Day or Hour',
			'type': 'checkbox',
			'input.value': dayHour,
			'input.name': 'dayHour',
			'input.addon': false
		}, {
			'title': 'Amplitude',
			'type': 'number',
			'value': inpAmp,
			'input.name': 'inpAmp',
			'input.group': 'input-group',
			'input.class': 'form-control',
			'input.addon': 'x'
		}]);
		this.draw();
	}
	this.addView();

	this.onZoom = function(zoom) {
		if (this.isView()) {
			inpAmp += zoom / 360;
			this.draw();
		}
	}
}

function MFourier(freq, settings) {
	Drawable.call(this);
	this.draw = function(ctx) {

		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
		var y = this.y + this.height / 2;
		ctx.moveTo(this.x, y);
		var np = settings.inpDeg / 180,
			points = [],
			rad = Math.PI / 180;

		for (var i = this.x; i <= this.width; i++) {
			x = i;
			y = 0;
			t = i / this.width;
			for (var fi in freq) {
				var A = settings.inpAmp * freq[fi].a,
					f = freq[fi].f;
				y += A * Math.sin(np * Math.PI * f * t + (rad * startDeg));
			}
			points.push(new Point(x, y));

		}



		ctx.lineWidth = 0.5;
		for (var i = 0, ln = points.length; i < ln; i++) {
			var point = points[i];

			ctx.beginPath();
			var x = point.x,
				y = point.y,
				ay = Math.min(this.y, Math.abs(y));

			ctx.moveTo(x, this.y);
			var py = (ay * (100 / this.y));
			var clrn = 255 + 16711425 * (py / 100);
			clrn = clrn.toFixed(0);
			ctx.strokeStyle = '#' + Number(clrn).toString(16);
			ctx.lineTo(x, this.y - y);
			ctx.stroke();
		}


		//x axis
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = '#433';
		ctx.lineWidth = 2;
		ctx.moveTo(0, this.y);
		ctx.lineTo(this.width, this.y);
		ctx.stroke();
	}
}
MFourier.prototype = Object.create(Drawable.prototype);
MFourier.prototype.constructor = MFourier;