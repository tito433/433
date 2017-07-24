var IO = {};

Object.defineProperty(IO, 'settings', {
	get: function() {
		return this._settings;
	},
	set: function(y) {
		this._settings = y;
	}
});

Object.defineProperty(IO, 'input', {
	get: function() {
		if (this._settings && this._settings.storage.data) {
			try {
				this._data = JSON.parse(localStorage.getItem(this._settings.storage.data));
			} catch (err) {}
		}
		return this._data;
	},
	set: function(y) {
		if (this._settings && this._settings.storage.data) {
			localStorage.setItem(this._settings.storage.data, JSON.stringify(y));
			window.dispatchEvent(new CustomEvent(this._settings.event, {
				'detail': y
			}));
		}
		this._data = y;
	}
});
IO.draw = function(who) {
	try {
		var _act = JSON.parse(localStorage.getItem(this.settings.storage.active));
		console.log(_act)
		if (_act == this.getName()) {
			this.draw();
		}
	} catch (err) {}
}