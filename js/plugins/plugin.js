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
	this.data = _get_storageJson(this.settings.storage.data_key);
	this._name = this.getName();

	//Check storage, is it me showing off?
	this._isView = function() {
		var ui_view = localStorage.getItem(this.settings.storage.ui_view);
		return ui_view == this._name;
	}
	this._updateData = function() {
		if (arguments.length == 1 && arguments[0] instanceof Event) {
			this.data = arguments[0].detail && arguments[0].detail instanceof Array ? arguments[0].detail : null;
			if (this._isView()) this.view();
		}
	}

	window.addEventListener(this.settings.storage.event, this._updateData.bind(this), false);
	var _ui_settings_cache = [];
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
		btn.name = option['input.name'];
		parent.appendChild(btn);

		if ("button" === option.type) {
			btn.innerHTML = label;
		} else if ('checkbox' === option.type) {
			var id = new Date().getTime() + Math.random();
			btn.id = id;
			btn.className = 'tgl';
			btn.checked = option['input.value'];
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
		var label = label || this._name,
			btn = fn_addUI(this.input.querySelector('.view'), label, {
				'type': 'submit',
				'input.name': 'view-' + label,
				'value': label
			});
		btn.onclick = function() {
			localStorage.setItem(this.settings.storage.ui_view, this._name);
			fn_showSettings.call(this);
			this.view();
		}.bind(this);
	}
	var fn_showSettings = function() {
		var btns = [],
			parent = this.input.querySelector('.model');
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
		for (var idx in _ui_settings_cache) {
			var it = _ui_settings_cache[idx];
			var label = it.lbl,
				opt = it.opt;
			var btn = fn_addUI(parent, label, opt);
			(function(b, self) {
				b.onchange = function() {
					localStorage.setItem(self.settings.storage.ui_view, self._name);
					var btnName = b.name,
						btnVal = 0;
					if (b.type == 'checkbox') {
						btnVal = b.checked;
					} else {
						btnVal = b.value;
					}
					var op = [];
					op[btnName] = btnVal;
					self.view(op);
				}.bind(self);
			})(btn, this);

			btns.push(btn);
		}
		return btns;
	}
	this.addModel = function(label, options) {
		var option = {
			'type': 'input',
			'input.name': 'input-' + label + new Date().getMilliseconds(),
			'input.wrap': 'li',
			'input.group': false,
			'input.type': 'input',
			'input.value': '',
			'input.class': '',
			'input.addon': false
		}.extend(options);

		_ui_settings_cache.push({
			'lbl': label,
			'opt': option
		});

		var btns = fn_showSettings.call(this);
		return btns[btns.length - 1];
	}
	this.addControll = function(label, _callBack) {
		if (_callBack != undefined) {
			var label = label || this._name,
				btn = fn_addUI(this.input.querySelector('.controll'), label, {
					'type': 'button',
					'input.name': 'input-control-' + label + new Date().getMilliseconds(),
					'value': label
				});
			btn.onclick = _callBack.bind(this);
			return btn;
		}
		return false;

	}
}