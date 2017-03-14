function Sound(input, output) {
	Plugin.apply(this, arguments);
	Canvas.call(this, output);

	this.view = function() {
		var self = this;

		loadScript('https://apis.google.com/js/client.js', function() {

			var pickerApiLoaded = false;
			var oauthToken;

			function onAuthApiLoad() {
				window.gapi.auth.authorize({
						'client_id': '247361126631-qeqsa7osg41g90q2f78ld3a1mhj3lv2l.apps.googleusercontent.com',
						'scope': "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.file",
						'immediate': false
					},
					handleAuthResult);
			}

			function onPickerApiLoad() {
				pickerApiLoaded = true;
				createPicker();
			}

			function handleAuthResult(authResult) {
				if (authResult && !authResult.error) {
					oauthToken = authResult.access_token;
					createPicker();
				}
			}

			// Create and render a Picker object for picking user Photos.
			function createPicker() {
				if (pickerApiLoaded && oauthToken) {

					var view = new google.picker.DocsView();
					view.setIncludeFolders(true);
					view.setMimeTypes("audio/mpeg");
					view.setOwnedByMe(true);
					view.setParent('root');
					view.setMode(google.picker.DocsViewMode.LIST);

					var picker = new google.picker.PickerBuilder()
						.enableFeature(google.picker.Feature.NAV_HIDDEN)
						.setOAuthToken(oauthToken)
						.addView(view)
						.setOrigin(window.location.protocol + '//' + window.location.host)
						.setTitle("Select a mp3 File")
						.setCallback(function(data) {
							if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
								var fileId = data[google.picker.Response.DOCUMENTS][0].id;
								var accessToken = gapi.auth.getToken().access_token;
								var xhr = new XMLHttpRequest();
								xhr.open("GET", "https://www.googleapis.com/drive/v3/files/" + fileId + '?alt=media', true);
								xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
								xhr.responseType = 'arraybuffer';
								xhr.onload = function() {
									var audioData = xhr.response;
									var audioCtx = new(window.AudioContext || window.webkitAudioContext)();

									audioCtx.decodeAudioData(audioData, function(buffer) {
										var soundWave = new SoundWave(buffer);
										soundWave.width(self.width);
										soundWave.height(self.height);
										self.add(soundWave);
										self.draw();


									}, function(e) {
										console.log("Error with decoding audio data" + e.err);
									});
								}
								xhr.send();

							}
						}).build();
					picker.setVisible(true);
				}
			}

			function downloadGDriveFile(file) {
				console.log(file)
				if (file.downloadUrl) {
					console.log('Downloading..' + file.downloadUrl)
					var accessToken = gapi.auth.getToken().access_token;
					var xhr = new XMLHttpRequest();
					xhr.open('GET', file.downloadUrl);
					xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
					xhr.onload = function() {
						var content = xhr.responseText;
						console.log("File downloaded:", file.title, content)
					};

					xhr.onerror = function(x, e, t) {
						alert("Download[" + file.title + "] failure." + e);
						console.log("Download[" + file.title + "] failure.", x, e, t);
					};

					xhr.send();
				} else {
					alert("This file cannot be downloaded. file.downloadUrl does not exist.");
					console.log(file)
				}
			}
			gapi.load('auth', {
				'callback': onAuthApiLoad
			});
			gapi.load('picker', {
				'callback': onPickerApiLoad
			});

		});
	}
	this.addView();
}


Sound.prototype = Object.create(Plugin.prototype);
Sound.prototype.constructor = Sound;

function SoundWave(buffer) {
	Drawable.call(this);
	var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
	var source = audioCtx.createBufferSource();
	var splitter = audioCtx.createChannelSplitter();
	source.connect(splitter);
	source.buffer = buffer;


	var analyser = audioCtx.createAnalyser();
	analyser.smoothingTimeConstant = 0;
	analyser.fftSize = 1024;
	source.connect(analyser);
	analyser.connect(audioCtx.destination);
	splitter.connect(analyser, 0, 0);

	var bufferLength = analyser.frequencyBinCount;
	source.connect(audioCtx.destination);

	var scriptNode = audioCtx.createScriptProcessor(4096, 1, 1);
	source.connect(scriptNode);
	scriptNode.connect(audioCtx.destination);
	source.onended = function() {
		source.disconnect(scriptNode);
		scriptNode.disconnect(audioCtx.destination);
	}
	this.draw = function(ctx) {
		var WIDTH = this.width(),
			HEIGHT = this.height();

		scriptNode.onaudioprocess = function() {

			var array = new Uint8Array(bufferLength);
			analyser.getByteFrequencyData(array);
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgb(0, 0, 0)';
			ctx.clearRect(0, 0, WIDTH, HEIGHT);
			ctx.beginPath();
			var sliceWidth = WIDTH * 1.0 / bufferLength;
			var x = 0;
			for (var i = 0; i < bufferLength; i++) {
				var v = array[i] / 128.0;
				var y = v * HEIGHT / 2;

				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			ctx.stroke();
		}

		source.start();
	}

}
SoundWave.prototype = Object.create(Drawable.prototype);
SoundWave.prototype.constructor = SoundWave;