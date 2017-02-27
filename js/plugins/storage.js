function Storage() {
	Plugin.apply(this, arguments);

	var storage = this.settings.storage;

	if (!this.data) {
		loadScript('https://apis.google.com/js/client.js', function() {
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
			h.appendChild(d.createTextNode('Google Calendar'));
			div.appendChild(h);


			p.appendChild(d.createTextNode("Authorize access to Google Calendar to fetch event from following date:"));
			div.appendChild(p);

			var dPara = d.createElement("p");
			div.appendChild(dPara);
			var t = new Date(),
				date_to = new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59),
				date_from = new Date(t.getFullYear() - 1, t.getMonth() + 1, 0, 23, 59, 59);

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
			btn.appendChild(d.createTextNode("Authorize"));
			div.appendChild(btn);
			btn.addEventListener("click", function() {
				gapi.auth.authorize({
					'client_id': '169881026239-62ks55c662hlrf6hnkui6uspmom0mj9i.apps.googleusercontent.com',
					'scope': "https://www.googleapis.com/auth/calendar.readonly",
					'immediate': false
				}, function(authResult) {
					if (authResult && !authResult.error) {
						div.parentNode.removeChild(div);
						gapi.client.load('calendar', 'v3', function() {
							var date_from = new Date(calStart.value),
								date_to = new Date(calEnd.value);

							gapi.client.calendar.events.list({
								'calendarId': 'primary',
								'showDeleted': false,
								'singleEvents': true,
								'timeMin': date_from.toISOString(),
								'timeMax': date_to.toISOString(),
								'maxResults': 999999,
								'orderBy': 'startTime'
							}).execute(function(resp) {
								localStorage.setItem(storage.data_key, JSON.stringify(resp.items));
								window.dispatchEvent(new CustomEvent(storage.event, {
									'detail': resp.items
								}));
							});
						});

					} else {
						div.appendChild(document.createElement('br'));
						div.appendChild(document.createTextNode("Error:" + authResult.error + "," + authResult.error_subtype));
					}
				});
			}, true);
		});
	}
	this.addControll('Clear Storage', function() {
		localStorage.removeItem(storage.data_key);
		window.location.href = window.location.href;
	});

}
Storage.prototype = Object.create(Plugin.prototype);
Storage.prototype.constructor = Storage;