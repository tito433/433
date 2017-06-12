function StorageUtils(input, output) {
	Plugin.apply(this, arguments);
	Canvas.call(this, this.output);

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