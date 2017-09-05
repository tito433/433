function GoogleCalendar() {

	var fetchEvents = function(startdate, enddate) {
		gapi.client.calendar.events.list({
			'calendarId': 'primary',
			'showDeleted': false,
			'singleEvents': true,
			'timeMin': startdate,
			'timeMax': enddate,
			'maxResults': 999999,
			'orderBy': 'startTime'
		}).then(function(response) {
			if (response && response.status != 200) {
				console.log("Invalid response!", response);
				return false;
			}
			var data = response.result.items;
			var dataFormated = [];
			for (var i = 0, ln = data.length; i < ln; i++) {
				if (data[i].creator.self) {
					var dt = new Date(data[i].start.dateTime);
					dataFormated.push({
						'date': dt.getTime(),
						'title': data[i].summary,
						'location': data[i].location
					})
				}
			}
			Application.addData(dataFormated);

		});
	}
	Application.UIButton('data', 'GoogleCalendar', function(e) {
		loadScript('js/library/ui.js', function() {
			new DateRangePicker('Google Calendar', 'Authorize access to Google Calendar to fetch event from following date:', function(startdate, enddate) {
				loadScript('http://apis.google.com/js/api.js', function() {
					gapi.load('client:auth2', function() {
						gapi.client.init({
							'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
							'client_id': '247361126631-qeqsa7osg41g90q2f78ld3a1mhj3lv2l.apps.googleusercontent.com',
							'scope': "https://www.googleapis.com/auth/calendar.readonly"
						}).then(function() {
							if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
								fetchEvents(startdate, enddate)
							} else {
								gapi.auth2.getAuthInstance().isSignedIn.listen(function(e) {
									if (e) fetchEvents(startdate, enddate);
								});
								gapi.auth2.getAuthInstance().signIn();
							}
						});
					});
				});
			})
		});
	});

};


new GoogleCalendar();