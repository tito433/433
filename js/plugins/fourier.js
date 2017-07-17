function Fourier() {
	Plugin.apply(this, arguments);
	Canvas.apply(this, Array.prototype.slice.call(arguments, 1));

	var dayHour = true;
	var inpDeg = 360;
	var inpAmp = 1;
	var startDeg = 0;

	this.draw = function(param) {
		this.clear();
		if (!this.data || !(this.data instanceof Array) || (0 == this.data.length)) {
			return false;
		}
		dayHour = arguments.length > 0 && "dayHour" in param ? Number(param.dayHour) : dayHour;
		inpDeg = arguments.length > 0 && "inpDeg" in param ? param.inpDeg : inpDeg;
		inpAmp = arguments.length > 0 && "inpAmp" in param ? param.inpAmp : inpAmp;

		var freq = this.data.map(function(dt) {
			var date = new Date(dt.date);
			var a = date.getHours(),
				f = date.getDate();
			return {
				'a': a,
				'f': f
			};
		});
		var fourier = new MFourier(freq, {
			'inpDeg': inpDeg,
			'inpAmp': inpAmp
		});
		fourier.width(this.width).position(0, this.height / 2);
		this.add(fourier);

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
			inpDeg += zoom;
			this.draw();
		}
	}
}

function MFourier(freq, settings) {
	Drawable.call(this);
	this.freq = freq;
	this.settings = settings;
	this.draw = function(ctx) {

		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
		var y = this.y + this.height / 2;
		ctx.moveTo(this.x, y);
		var np = this.settings.inpDeg / 180,
			points = [],
			rad = Math.PI / 180;
		for (var i = this.x, sz = this.width(); i <= sz; i++) {
			x = i;
			y = 0;
			t = i / sz;
			for (var fi in this.freq) {
				var A = this.settings.inpAmp * this.freq[fi].a,
					f = this.freq[fi].f;
				y += A * Math.sin(Math.PI * np * f * t);
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
			var py = (Math.abs(ay) * (100 / this.y));
			var clrn = 16711425 * (py / 100);
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