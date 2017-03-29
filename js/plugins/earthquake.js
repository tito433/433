function Earthquake(input, output) {
	Plugin.apply(this, arguments);
	Canvas.call(this, output);

	var distance = 1000;
	var rotation = new Point3D();


	this.view = function(param) {
		this.clear();
		var earth = new Earth(distance);
		earth.rotation(rotation).size(this.width, this.height);
		this.add(earth);
		this.draw();
	}

	this.addView();
	if (this._isView()) {
		this.showSettings();
		this.view();
	}
	this.onDrag = function(dx, dy) {
		if (this._isView()) {
			rotation.y -= dx / 1000;
			rotation.x -= dy / 1000;
			this.view();
		}

	}
	this.onZoom = function(zoom) {
		if (this._isView()) {
			distance += zoom * 2;
			console.log(distance)
			this.view();
		}
	}
}


function Point3D(x, y, z) {
	this.x = isNaN(Number(x)) ? 0 : x;
	this.y = isNaN(Number(y)) ? 0 : y;
	this.z = isNaN(Number(z)) ? 0 : z;
}

function Earth(radius) {
	Drawable.call(this);

	this.vertices = new Array();
	this.radius = radius;
	this.rings = 10;
	this.slices = 10;


	var M_PI_2 = Math.PI / 2;
	var dTheta = (Math.PI * 2) / this.slices;
	var dPhi = Math.PI / this.rings;
	this._rotation = new Point3D();
	var lastX = -1;
	var lastY = -1;
	// Iterate over latitudes (rings)
	for (var lat = 0; lat < this.rings; ++lat) {
		var phi = M_PI_2 - lat * dPhi;
		var cosPhi = Math.cos(phi);
		var sinPhi = Math.sin(phi);

		// Iterate over longitudes (slices)
		for (var lon = 0; lon < this.slices; ++lon) {
			var theta = lon * dTheta;
			var cosTheta = Math.cos(theta);
			var sinTheta = Math.sin(theta);
			var point = new Point3D(this.radius * cosTheta * cosPhi, this.radius * sinPhi,
				this.radius * sinTheta * cosPhi);
			this.vertices.push(point);

		}
	}
	this.rotation = function(dx, dy) {
		if (dx != undefined) {
			if (dx instanceof Point3D) {
				this._rotation = dx;
			} else {
				this._rotation.x = Number(dx);
			}

			if (dy != undefined) {
				this._rotation.y += Number(dy);
			}
			return this;
		} else {
			return this._rotation;
		}


	}
	this.draw = function(ctx) {
		lastX = -1;
		lastY = -1;
		// draw each vertex to get the first sphere skeleton
		for (var i = 0, iz = this.vertices.length; i < iz; i++) {
			this.strokeSegment(i, ctx, this.width(), this.height());
		}

		// now walk through rings to draw the slices
		// for (var i = 0; i < this.slices; i++) {
		// 	for (var j = 0; j < this.rings; j++) {
		// 		this.strokeSegment(i + (j * (this.slices + 1)), ctx, this.width(), this.height());
		// 	}
		// }
	}

	this.strokeSegment = function(index, ctx, width, height) {
		if (index > this.vertices.length) {
			console.log('Invalid index', index, this.vertices.length);
			return;
		}
		var x, y;
		var p = this.vertices[index];
		if (p == undefined) {
			console.log(this, index, this.vertices.length)
		}
		rotateX(p, this._rotation.x);
		rotateY(p, this._rotation.y);
		rotateZ(p, this._rotation.z);

		x = projection(p.x, p.z, width / 2.0, 100.0, this.radius);
		y = projection(p.y, p.z, height / 2.0, 100.0, this.radius);

		if (lastX == -1 && lastY == -1) {
			lastX = x;
			lastY = y;

			return;
		}
		if (x >= 0 && x < width && y >= 0 && y < height) {
			if (p.z < 0) {
				ctx.strokeStyle = "gray";
			} else {
				ctx.strokeStyle = "black";
			}

			ctx.beginPath();
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(x, y);
			ctx.stroke();
			ctx.closePath();
			lastX = x;
			lastY = y;
		} else {

			lastX = -1;
			lastY = -1;
		}
	}

	var rotateX = function(point, radians) {
		if (point == undefined || point.y == undefined) {
			console.log(this, point, radians);
			return;
		}
		var y = point.y;
		point.y = (y * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
		point.z = (y * Math.sin(radians)) + (point.z * Math.cos(radians));
	}
}
Earth.prototype = Object.create(Drawable.prototype);
Earth.prototype.constructor = Earth;



function rotateY(point, radians) {

	var x = point.x;
	point.x = (x * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
	point.z = (x * Math.sin(radians)) + (point.z * Math.cos(radians));


}

function rotateZ(point, radians) {

	var x = point.x;
	point.x = (x * Math.cos(radians)) + (point.y * Math.sin(radians) * -1.0);
	point.y = (x * Math.sin(radians)) + (point.y * Math.cos(radians));
}

function projection(xy, z, xyOffset, zOffset, distance) {
	return ((distance * xy) / (z - zOffset)) + xyOffset;
}