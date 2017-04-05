function Logo(input, output) {
	Canvas.call(this, output);


	var ctx = this._ctx;


	//draw cricle
	var zoom = 2;
	var radius = 128;

	var center = new Point(this.width / 2, this.height / 2);

	ctx.save();


	ctx.beginPath();
	ctx.fillStyle = '#000';
	ctx.lineWidth = 3;
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = '#000';
	ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = '#FFF';
	ctx.arc(center.x, center.y, radius, Math.PI / 2, 1.5 * Math.PI);
	ctx.fill();

	ctx.beginPath();

	ctx.fillStyle = '#000';
	ctx.arc(center.x, center.y + radius / 2, radius / 2, Math.PI / 2, 1.5 * Math.PI);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = '#FFF';
	ctx.arc(center.x, center.y - radius / 2, radius / 2, Math.PI / 2, 1.5 * Math.PI, true);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(center.x, center.y + radius / 2, radius / 6, 0, 2 * Math.PI);
	ctx.fill();

	ctx.beginPath();
	ctx.fillStyle = '#000';
	ctx.arc(center.x, center.y - radius / 2, radius / 6, 0, 2 * Math.PI);
	ctx.fill();

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