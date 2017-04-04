function Logo(input, output) {
	Canvas.call(this, output);

	var ctx = this._ctx;


	//draw cricle
	var zoom = 2;
	var radius = 256;

	var center = new Point(this.width / 2, this.height / 2);
	ctx.save();

	ctx.strokeStyle = '#666';
	ctx.lineWidth = zoom * 1.5;

	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.stroke();
	var points = [];
	//get positions
	for (var i = 1; i <= 9; i++) {
		var deg = (i * 40) - 90,
			degRad = deg * Math.PI / 180;
		points[i] = new Point(center.x + radius * Math.cos(degRad), center.y + radius * Math.sin(degRad));
	}
	//draw connection
	var connecion = [1, 2, 4, 8, 7, 5];
	ctx.beginPath();
	ctx.strokeStyle = '#f00';
	ctx.lineWidth = zoom * 1;
	ctx.moveTo(points[connecion[0]].x, points[connecion[0]].y);
	for (var i = 1, ln = connecion.length; i < ln; i++) {
		ctx.lineTo(points[connecion[i]].x, points[connecion[i]].y);
	}
	ctx.closePath();
	ctx.stroke();
	//draw poller
	ctx.beginPath();
	ctx.setLineDash([zoom * 1, zoom * 5]);
	ctx.strokeStyle = '#00f';
	ctx.lineWidth = zoom * 1;
	ctx.moveTo(points[3].x, points[3].y);
	ctx.lineTo(points[9].x, points[9].y);
	ctx.lineTo(points[6].x, points[6].y);
	ctx.stroke();

	ctx.restore();
	//save screen?


	this.screenShoot = function(ctx, x, y, w, h) {
		var data = ctx.getImageData(x, y, w, h);
		var tc = document.createElement('canvas');
		tc.width = w;
		tc.height = h;

		var tcc = tc.getContext("2d");
		tcc.putImageData(data, 0, 0);

		window.open(tc.toDataURL("image/png"), '_blank');
	}

	// this.screenShoot(ctx, center.x - radius, center.y - radius, 2 * radius, 2 * radius);
}