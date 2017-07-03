function StorageUtils() {
	Plugin.apply(this, arguments);
	Canvas.apply(this, Array.prototype.slice.call(arguments, 1));

	this.view = function() {
		var cmd = arguments.length ? arguments[0] : '';
		if (typeof this[cmd] === "function") {
			this[cmd](this._ctx);
			return true;
		}

		switch (cmd) {
			case 'RESET':
				localStorage.clear();
				window.location.href = window.location.href;
				break;
			default:
				console.log("I dont know what to do with it.");
		}
	}
	this.addControll("RESET");
	this.addControll("saveAsPng");
	this.addControll("clear");

}