var Application = Application || {};

(function(global) {
	"use strict";

	var input = document.getElementById('input'),
		settings = {
			'storage': {
				'data': '433.storage.data',
				'event': '433.data.change',
				'active': '433.state'
			}
		};
	global.setData = function(data) {
		localStorage.setItem(settings.storage.data, JSON.stringify(data));
		window.dispatchEvent(new CustomEvent(settings.storage.event, {
			'detail': data
		}));
	};
	global.getData = function() {
		var _dt = [];
		try {
			_dt = JSON.parse(localStorage.getItem(settings.storage.data));
		} catch (err) {}
		return _dt;
	};
	global.addData = function(data) {
		var _dt;
		try {
			_dt = JSON.parse(localStorage.getItem(settings.storage.data));
		} catch (err) {}
		_dt = _dt || [];
		_dt = _dt.concat(data);
		this.setData(_dt);
	}
	global.remData = function() {
		localStorage.removeItem(settings.storage.data);
		window.dispatchEvent(new CustomEvent(settings.storage.event, {
			'detail': []
		}));
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
			if (btn.type === 'button') {
				btn.onclick = option.onchange;
			} else {
				btn.onchange = option.onchange;
			}
		}
		return btn;
	}

	global.addSettings = function(btns, onchange) {
		var option = {
			'type': 'input',
			'input.name': 'input-' + new Date().getTime(),
			'input.wrap': 'li',
			'input.group': false,
			'input.type': 'input',
			'input.value': '',
			'input.class': '',
			'input.addon': false,
			'title': 'Option',
			'onchange': onchange || function() {}
		};

		var parent = input.querySelector('.model');

		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}


		if (btns) {
			if (btns.constructor === Array) {
				for (var bi = 0, bz = btns.length; bi < bz; bi++) {
					var op = option.extend(btns[bi]);
					fn_addUI(parent, op.title, op);
				}
			} else if (btns.constructor === Object) {
				btns = option.extend(btns);
				fn_addUI(parent, btns.title, btns);
			}
		}
	}
	global.UIButton = function(selector, label, onchange) {
		var selector = selector || 'data',
			label = label || this._name,
			btn = fn_addUI(input.querySelector('.' + selector), label, {
				'type': 'button',
				'value': label,
				'onchange': onchange
			});
		return btn;
	}

	return global;
})(Application);