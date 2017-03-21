function GoogleCalendar(input, output) {
	Plugin.apply(this, arguments);
	Canvas.call(this, output);

	var storage = this.settings.storage;

	this.view = function() {
		var data = this.data;
		if (!data || (data instanceof Array && data.length == 0)) {
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
						'client_id': '247361126631-qeqsa7osg41g90q2f78ld3a1mhj3lv2l.apps.googleusercontent.com',
						'scope': "https://www.googleapis.com/auth/calendar.readonly",
						'immediate': false
					}, function(authResult) {
						if (authResult && !authResult.error) {
							div.parentNode.removeChild(div);
							gapi.client.load('calendar', 'v3', function() {
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


								gapi.client.calendar.events.list({
									'calendarId': 'primary',
									'showDeleted': false,
									'singleEvents': true,
									'timeMin': date_from.toISOString(),
									'timeMax': date_to.toISOString(),
									'maxResults': 999999,
									'orderBy': 'startTime'
								}).execute(function(resp) {
									var data = resp.items;
									var startDate = new Date(data[0].start.dateTime),
										eDate = new Date(data[data.length - 1].end.dateTime);
									var getEvents = function(data, date) {
										var ct = [];
										for (var i in data) {
											var dt = new Date(data[i].start.dateTime);
											if (dt.getFullYear() == date.getFullYear() &&
												dt.getMonth() == date.getMonth() &&
												dt.getDate() == date.getDate()) {
												ct.push(data[i].start.dateTime);
											}
										}
										return ct;
									}
									startDate.setMinutes(0);
									startDate.setHours(0);
									var dataFormated = [];
									while (startDate <= eDate) {
										var rect = {
											'date': '' + startDate,
											events: getEvents(data, startDate)
										};
										dataFormated.push(rect);
										startDate.setDate(startDate.getDate() + 1);
									}
									localStorage.setItem(storage.data_key, JSON.stringify(dataFormated));
									window.dispatchEvent(new CustomEvent(storage.event, {
										'detail': dataFormated
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


	}

	this.addControll('Google Calendar');

	if (this._isControll()) {
		this.showSettings();
		this.view();
	}
}
Storage.prototype = Object.create(Plugin.prototype);
Storage.prototype.constructor = Storage;