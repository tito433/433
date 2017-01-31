var Plugin = function() {

	if (typeof(Storage) === "undefined") {
		throw "Storage undefined! This app can't run without localStorage. Can you?";
	}

	this.input = arguments[0] || null;
	this.output = arguments[1] || null;

	this.settings = {
		'storage': {
			'data_key': '433.storage.data',
			'event': '433.data.change',
			'active': '433.state',
			'ui_view': '433.ui.view',
		}
	};
	var _get_storageJson = function(key) {
		var _dt = null;
		try {
			_dt = JSON.parse(localStorage.getItem(key));
		} catch (err) {}
		return _dt;
	}
	var _data = _get_storageJson(this.settings.storage.data_key);
	var _name = this.getName();

	//need deprication, because i know who am i.
	this.isView = function() {
		var state = _get_storageJson(this.settings.storage.ui_view);
		return state == this.getName();
	}
	this._updateData = function() {
		if (arguments.length == 1 && arguments[0] instanceof Event) {
			_data = arguments[0].detail && arguments[0].detail instanceof Array ? arguments[0].detail : [];
			if (this.isView()) this.view();
		}
	}

	window.addEventListener(this.settings.storage.event, this._updateData.bind(this), false);
	this.data = function() {
		if (arguments.length > 0 && typeof arguments[0] === Array) {
			_data = arguments[0];
			return this;
		} else {
			return _data;
		}
	}
	var fn_addUI = function(parent, label, option) {
		var d = document,
			btn = d.createElement('input');

		if (option['input.wrap']) {
			var li = d.createElement(option['input.wrap']),
				p = d.createElement("P");

			p.appendChild(d.createTextNode(label));
			li.appendChild(p);
			parent.appendChild(li);
			parent = li;
		}
		if (option['input.group']) {
			var igdiv = d.createElement("DIV");
			igdiv.className = option['input.group'];
			parent.appendChild(igdiv);
			parent = igdiv;
		}
		//input prop
		btn.className = option['input.class'] || '';
		btn.type = option['type'] || 'input';
		btn.value = option['value'] || '';
		parent.appendChild(btn);

		if ("button" === option.type) {
			btn.innerHTML = label;
		} else if ('checkbox' === option.type) {
			var id = new Date().getTime() + Math.random();
			btn.id = id;
			btn.className = 'tgl';
			btn.checked = true;
			var label = d.createElement('label');
			label.innerHTML = ' ';
			label.htmlFor = id;
			parent.appendChild(label);
		}

		//has addon?
		if (option['input.addon']) {
			var span = d.createElement('span');
			span.className = 'input-group-addon';
			span.innerHTML = option['input.addon'];
			parent.appendChild(span);
		}

		if (option.onchange && typeof option.onchange == 'function') {
			if (btn instanceof HTMLButtonElement) {
				btn.onclick = option.onchange;
			} else if (btn instanceof HTMLInputElement) {
				btn.onchange = option.onchange;
			}
		}
		return btn;

	}
	this.addView = function(label) {
		var label = label || this.getName(),
			btn = fn_addUI(this.input.querySelector('.view'), label, {
				'type': 'submit',
				'value': label
			});
		btn.onclick = function() {
			localStorage.setItem(this.settings.storage.ui_view, this.getName());
			this.view();
		}.bind(this);
	}
	this.addModel = function(label, options) {
		var option = {
			'type': 'input',
			'input.wrap': 'li',
			'input.group': false,
			'input.type': 'input',
			'input.value': '',
			'input.class': '',
			'input.addon': false
		}.extend(options);

		var btn = fn_addUI(this.input.querySelector('.model'), label, option);
		btn.onchange = function() {
			this.view();
		}.bind(this)
		return btn;
	}

	this.addControl = function(label) {
		//for now as method not defined. let assume it would be like addView.
		return this.addView(label, callBack);
	};
}