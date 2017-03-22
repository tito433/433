function StorageUtils(input, output) {
	Plugin.apply(this, arguments);

	this.view = function() {
		console.log(arguments)
		var cmd = arguments.length ? arguments[0] : '';
		switch (cmd) {
			case 'Full Reset':
				localStorage.clear();
				window.location.href = window.location.href;
				break;
			case 'Clear Data':
				localStorage.removeItem(this.settings.storage.data_key);
				window.location.href = window.location.href;
				break;
			default:
				console.log("I dont know what to do with it.");

		}
	}
	this.addControll("Full Reset");
	this.addControll("Clear Data");

}