function Fourier(input, output) {
	Plugin.apply(this, arguments);

	Canvas.call(this, output);
	var dayHour = true;
	this.addSettings();
	var inpDeg = 180;
	var inpAmp = 0.21;
	var startDeg = 0;

	this.view = function(param) {

		dayHour = param && param.dayHour != undefined ? param.dayHour : dayHour;
		inpDeg = param && param.inpDeg ? Number(param.inpDeg) : inpDeg;
		inpAmp = param && param.inpAmp ? Number(param.inpAmp) : inpAmp;
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

		var ctx = this._ctx;
		var checkType = dayHour ? 0 : 1,
			lblArr = ['day', 'hour'];
		this.x = 0;
		this.y = 0;
		ctx.clearRect(0, 0, this.width, this.height);
		ctx.save();
		ctx.font = 'bold 14pt Courier';
		ctx.fillStyle = '#aaa';
		ctx.textBaseline = "middle";
		ctx.textAlign = "right"
		ctx.fillText('Fourier', this.x + this.width, 8);
		ctx.font = 'bold 10pt Courier';
		ctx.fillText('Frequency:' + lblArr[checkType], this.x + this.width, 25);


		if (!this.data || !(this.data instanceof Array) || (0 == this.data.length)) {
			console.log('No data exit now.')
			return false;
		}


		var freq = [];
		this.data.forEach(function(dt) {
			var date = new Date(dt.date);
			var a = date.getHours(),
				f = date.getDate();

			if (dayHour) {
				f = date.getHours();
				a = date.getDate();
			}
			freq.push({
				'a': a,
				'f': f
			});

		});
		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
		this.x = 0;
		this.y = this.height / 2;
		ctx.moveTo(this.x, this.y);
		var np = inpDeg / 180;
		var points = [],
			rad = Math.PI / 180;

		for (var i = this.x; i <= this.width; i++) {
			x = i;
			y = 0;
			t = i / this.width;
			for (var fi in freq) {
				var A = inpAmp * freq[fi].a,
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

	this.addView();
	if (this._isView()) {
		this.view();
	}
	this.onDrag = function(dx, dy) {
		if (this._isView()) {
			startDeg += dx;
			this.view();
		}

	}
	this.onZoom = function(zoom) {
		if (this._isView()) {
			inpAmp += zoom / 360;
			this.view();
		}
	}
}