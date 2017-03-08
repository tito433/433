function Fourier(input, output) {
	Plugin.apply(this, arguments);

	Canvas.call(this, output);
	var dayHour = false;
	this.addSettings();
	var inpDeg = 360;
	this.addSettings([{
		'title': 'Fourier span.',
		'type': 'number',
		'value': inpDeg,
		'input.name': 'inpDeg',
		'input.group': 'input-group',
		'input.class': 'form-control',
		'input.addon': '&deg;'
	}, {
		'title': 'Fourier day/hour',
		'type': 'checkbox',
		'input.value': dayHour,
		'input.name': 'dayHour'
	}]);

	this.view = function(param) {

		dayHour = param && param.dayHour != undefined ? param.dayHour : dayHour;
		inpDeg = param && param.inpDeg ? Number(param.inpDeg) : inpDeg;
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
			console.log('Nothing to draw');
			return false;
		}


		var freq = this.data.map(function(dt) {
			var cDate = new Date(dt.start.dateTime),
				a = cDate.getHours() + 1,
				f = cDate.getDate();
			if (checkType) {
				f = cDate.getHours() + 1;
				a = cDate.getDate();
			}
			return {
				'a': a,
				'f': f
			};
		});
		ctx.beginPath();
		ctx.strokeStyle = '#aaa';
		ctx.lineWidth = 0.5;
		this.x = this.width / 2;
		this.y = this.height / 2;
		ctx.moveTo(this.x, this.y);
		var np = inpDeg / 180;
		for (var i = this.x; i < this.width; i++) {
			x = i;
			y = 0;
			t = i / this.width;
			for (var fi in freq) {
				var amp = freq[fi].a,
					fr = freq[fi].f;
				y += amp * Math.sin(fr * np * t * Math.PI);
			}

			ctx.lineTo(x, this.y - y);

		}
		ctx.stroke();

		//x axis
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = '#433';
		ctx.lineWidth = 2;
		ctx.moveTo(0, this.y);
		ctx.lineTo(this.width, this.y);
		ctx.stroke();
		//center x
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(this.x, this.height);
		ctx.lineTo(this.x, 0);
		ctx.stroke();
		ctx.restore();

	}

	this.addView();
	if (this._isView()) {
		this.showSettings();
		this.view();
	}
}