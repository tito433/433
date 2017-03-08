var Plugin = function() {


	if (typeof(Storage) === "undefined") {
		throw "Storage undefined! This app can't run without localStorage. Can you?";
	}

	var self = this;
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
			this.showSettings();
			this.view();
		}.bind(this);
	}
	this.showSettings = function() {
		var parent = this.input.querySelector('.model');
		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}
		_ui_settings_cache.forEach(function(it) {
			var option = {
				'type': 'input',
				'input.name': 'input-' + it.title + new Date().getMilliseconds(),
				'input.wrap': 'li',
				'input.group': false,
				'input.type': 'input',
				'input.value': '',
				'input.class': '',
				'input.addon': false
			}.extend(it);

			var btn = fn_addUI(parent, it.title, option);

			btn.onchange = function() {
				var btnName = this.name,
					btnVal = 0;
				if (this.type == 'checkbox') {
					btnVal = this.checked;
				} else {
					btnVal = this.value;
				}
				var op = [];
				op[btnName] = btnVal;
				console.log('calling view:' + this._name)
				self.view(op);
			}
		});
	}
	this.addSettings = function(btns) {
		_ui_settings_cache = [];
		if (btns.constructor === Array) {
			_ui_settings_cache = btns;
		} else {
			_ui_settings_cache.push(btns);
		}
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