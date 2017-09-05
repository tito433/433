'use strict';
var Plugin = (function(self) {

	if (typeof(Storage) === "undefined") {
		throw "Storage undefined! self app can't run without localStorage. Can you?";
	}

	self.input = document.getElementById('input');
	self.output = document.getElementById('output');
	self.settings = {
		'storage': {
			'data': '433.storage.data',
			'event': '433.data.change',
			'active': '433.state'
		}
	};
	var _get_storageJson = function(key) {
		var _dt = null;
		try {
			_dt = JSON.parse(localStorage.getItem(key));
		} catch (err) {}
		return _dt;
	}
	self.data = _get_storageJson(self.settings.storage.data);

	self.draw = function() {};

	self.getData = function() {
		return self.data;
	}
	self.isView = function() {
		var state = localStorage.getItem(self.settings.storage.active);
		return state == self.getName();
	}

	self._updateData = function() {
		if (arguments.length == 1 && arguments[0] instanceof Event) {
			self.data = arguments[0].detail && arguments[0].detail instanceof Array ? arguments[0].detail : [];
			if (self.isView()) self.draw();
		}
	}

	window.addEventListener(self.settings.storage.event, self._updateData.bind(self), false);

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
	self.addView = function(label) {
		var label = label || self.getName(),
			btn = fn_addUI(self.input.querySelector('.view'), label, {
				'type': 'submit',
				'input.name': 'view-' + label,
				'value': label
			});
		btn.onclick = function() {
			localStorage.setItem(self.settings.storage.active, self.getName());
			self.view();
		}.bind(self);
	}

	self.addSettings = function(btns) {
		var option = {
			'type': 'input',
			'input.name': 'input-' + new Date().getTime(),
			'input.wrap': 'li',
			'input.group': false,
			'input.type': 'input',
			'input.value': '',
			'input.class': '',
			'input.addon': false,
			'title': 'Option'
		};

		var parent = self.input.querySelector('.model');

		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}


		if (btns) {
			if (btns.constructor === Array) {
				for (var bi = 0, bz = btns.length; bi < bz; bi++) {
					var op = option.extend(btns[bi]);
					var btn = fn_addUI(parent, op.title, op);
					btn.onchange = function(evt) {
						var tr = evt.target,
							val = tr.type === 'checkbox' ? (tr.checked) : tr.value;
						self.draw({
							[tr.name]: val
						});
					}.bind(self);
				}
			} else if (btns.constructor === Object) {
				var op = option.extend(btns);
				var btn = fn_addUI(parent, op.title, op);
				btn.onchange = function(evt) {
					var tr = evt.target,
						val = tr.type === 'checkbox' ? (tr.checked) : tr.value;
					self.draw({
						[tr.name]: val
					});
				}.bind(self);
			}
		}
	}
	self.getParamFromEvent = function(event, prmName) {
		if (event instanceof Event) {
			var elem = event.target;
			if (elem.name === prmName) {
				return elem.type === 'checkbox' ? elem.checked : elem.value;
			}

		}

	}
	self.addControll = function(label) {
		var label = label || self._name,
			btn = fn_addUI(self.input.querySelector('.controll'), label, {
				'type': 'button',
				'input.name': 'input-control-' + label + new Date().getMilliseconds(),
				'value': label
			});
		btn.onclick = function() {
			self.view.call(self, label);
		}.bind(self);
		return btn;
	}
	self.addData = function(label) {
		var label = label || self._name,
			btn = fn_addUI(self.input.querySelector('.data'), label, {
				'type': 'button',
				'input.name': 'input-control-' + label + new Date().getMilliseconds(),
				'value': label
			});
		btn.onclick = self.view.bind(self);
		return btn;
	}

	//do need?
	// self.UI = {
	// 	menu: {
	// 		menuDom: document.getElementById('nav-toggle'),

	// 		get show() {
	// 			if (!self.menuDom) return undefined;
	// 			return self.menuDom;
	// 		},
	// 		set show(val) {
	// 			if (!self.menuDom) return undefined;
	// 			self.menuDom.checked = val;
	// 		},
	// 	}
	// };

	return self;
})(Plugin || {});