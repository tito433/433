function DateRangePicker(title, subtitle, callBack, startdate, enddate) {
	var d = document,
		div = d.createElement('div'),
		p = d.createElement("p");

	div.style.position = 'absolute';
	div.style.textAlign = 'center';
	div.style.maxWidth = '330px';
	div.style.padding = '10px';
	div.style.top = '10%';
	div.style.background = '#eee';
	div.style.border = '1px solid #ccc';
	div.style.left = '0';
	div.style.right = '0';
	div.style.marginRight = 'auto';
	div.style.marginLeft = 'auto';


	d.body.appendChild(div);
	var h = d.createElement('H1');
	h.appendChild(d.createTextNode(title));
	div.appendChild(h);


	p.appendChild(d.createTextNode(subtitle));
	div.appendChild(p);

	var dPara = d.createElement("p");
	div.appendChild(dPara);
	var t = new Date(),
		date_to = enddate || new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59),
		date_from = startdate || new Date(t.getFullYear() - 1, t.getMonth() + 1, 0, 23, 59, 59);

	var mL = function(ix) {
		return ix > 9 ? ix : '0' + ix;
	}

	//start date
	var calStart = d.createElement('input');
	calStart.type = "date";
	calStart.value = date_from.getUTCFullYear() + "-" + mL(date_from.getUTCMonth() + 1) + "-" + mL(date_from.getUTCDate());;
	dPara.appendChild(calStart);
	dPara.appendChild(d.createTextNode(" to "));
	//end date
	var calEnd = d.createElement('input');
	calEnd.type = "date";
	calEnd.value = date_to.getUTCFullYear() + "-" + mL(date_to.getUTCMonth() + 1) + "-" + mL(date_to.getUTCDate());;
	dPara.appendChild(calEnd);

	var btn = d.createElement("button");
	btn.appendChild(d.createTextNode("Submit"));
	div.appendChild(btn);
	if (callBack && typeof callBack === "function") {
		btn.onclick = function() {
			var date_from2 = new Date(calStart.value),
				date_to2 = new Date(calEnd.value);

			if (date_from2 == 'Invalid Date') {
				console.log('Invalid date_from2, ill use previous ones.', date_from);
			} else {
				date_from = date_from2;
			}
			if (date_to2 == 'Invalid Date') {
				console.log('Invalid date_to2, ill use previous ones.', date_to);
			} else {
				date_to = date_to2;
			}
			div.parentNode.removeChild(div);
			callBack(date_from.toISOString(), date_to.toISOString());
		};
	}

}