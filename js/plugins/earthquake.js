function Earthquake(input, output) {
	Plugin.apply(this, arguments);
	Canvas.call(this, output);

	var distance = this.height / 2;
	var dataImage = false;
	var yRotate = 0;
	var xRotate = 0;

	this.view = function(param) {

		this.clear();
		var width = this.width;
		var height = this.height;

		require('http://www.webglearth.com/v2/api.js', function() {
			var earth = new WE.map(output, {
				atmosphere: true,
				center: [0, 0],
				zoom: 0
			});
			WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
				tileSize: 256,
				bounds: [
					[-85, -180],
					[85, 180]
				],
				minZoom: 0,
				maxZoom: 16,
				tms: true
			}).addTo(earth);
		});
	}

	this.addView();
	if (this._isView()) {
		this.showSettings();
		this.view();
	}
	this.onDrag = function(dx, dy) {
		if (this._isView()) {
			yRotate += dx * Math.PI / 180;
			xRotate += dy * Math.PI / 180;
			this.view();
		}

	}
	this.onZoom = function(zoom) {
		if (this._isView()) {
			distance += zoom * 10;
			this.view();
		}
	}
}