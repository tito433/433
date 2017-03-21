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
					'date': new Date(prop.time),
					'quake': {
						'title': prop.title,
						'mag': prop.mag,
						'tsunami': prop.tsunami,
						'lat': fea.geometry.coordinates[0],
						'lon': fea.geometry.coordinates[1]
					}
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

	this.view = function(param) {
		console.log('Inside view')
		this.clear();
		var data = this.data;
		if (!data || (data instanceof Array && data.length == 0)) {
			this._fetchData();
			return false;
		}
		console.log("we have data!", data)
		this.draw();
	}



	this._fetchData = function() {
		console.log('Going to fetch data')
		var script = document.createElement('script');
		script.src = '//earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02&minmagnitude=3&callback=' + cb_method
		document.getElementsByTagName('head')[0].appendChild(script);
	}

	this.addControll("USGS Earthquake");

	if (this._isControll()) {
		this.showSettings();
		this.view();
	}
}