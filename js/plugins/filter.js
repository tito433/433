function Filter() {
	Plugin.apply(this, arguments);
	Canvas.apply(this, Array.prototype.slice.call(arguments, 1));

	var hasValue = function(data, findValue, index) {
		switch (typeof data) {
			case "object":
			case "array":
				for (var item in data) {
					var r = hasValue(data[item], findValue, item);
					if (r != undefined) return r;
				}
				break;
			default:
				var args = findValue.split(':'),
					key = false,
					value = args[0];

				if (args.length > 1) {
					key = args[0];
					value = args[1];
				}


				var regx = new RegExp(value, "i"),
					match = regx.exec('' + data);

				if (key != false && key == index && match)
					return data;
				if (!key && match)
					return data;
		}
	};

	this.view = function() {
		var input = param && param.filter != undefined ? param.filter : "";
		var data = this.data;
		if (data && data.length) {
			data = data.filter(function(item) {
				return hasValue(item, input) != undefined;
			});
			window.dispatchEvent(new CustomEvent(this.settings.storage.event, {
				'detail': data
			}));
		}

	}


}
Filter.prototype = Object.create(Plugin.prototype);
Filter.prototype.constructor = Filter;