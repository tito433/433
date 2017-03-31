function UsgsEarthquake(input, output) {
	Plugin.apply(this, arguments);

	Canvas.call(this, output);
	var storage = this.settings.storage;

	var cb_method = this._name + '_cb_' + new Date().getMilliseconds();
	window[cb_method] = function(data) {
		if (data.metadata && data.metadata.status == 200 && data.metadata.count > 0) {
			var events = [];
			data.features.forEach(function(fea) {
				var prop = fea.properties;
				events.push({
					'date': prop.time,
					'title': prop.title,
					'mag': prop.mag,
					'tsunami': prop.tsunami,
					'lon': fea.geometry.coordinates[0],
					'lat': fea.geometry.coordinates[1]
				});
			});
			localStorage.setItem(storage.data_key, JSON.stringify(events));
			window.dispatchEvent(new CustomEvent(storage.event, {
				'detail': events
			}));
		} else {
			console.log("Invalid response found from USGS", data);
		}
	}

	var _fetchData = function(start, end) {
		var script = document.createElement('script');
		script.src = '//earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=' + start + '&endtime=' + end + '&minmagnitude=4&callback=' + cb_method
		document.getElementsByTagName('head')[0].appendChild(script);
	}
	this.view = function(param) {
		require('library/ui', function() {
			var t = new Date(),
				date_to = new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59),
				date_from = new Date(t.getFullYear(), t.getMonth(), 1, 23, 59, 59);

			new DateRangePicker('USGS Earthquake', 'Please select date range to fetch data:', function(startdate, enddate) {
				var st = new Date(startdate),
					ed = new Date(enddate);
				_fetchData(st.getFullYear() + '-' + (st.getMonth() + 1) + '-' + st.getDate(), ed.getFullYear() + '-' + (ed.getMonth() + 1) + '-' + ed.getDate());
			}, date_from, date_to);
		});
	}



	this.addData("USGS Earthquake");
}