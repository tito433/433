self.addEventListener('message', function(e) {
	var data = e.data,
		sl_num = 1000 * (new Number(data) + 1);

	function sleep(ml) {
		var currentTime = new Date().getTime();
		while (currentTime + ml >= new Date().getTime()) {}
	}

	console.log('Thread ' + data + " sleep before:" + sl_num)
	sleep(sl_num)
	console.log('Thread ' + data + " sleep after:" + sl_num)

	switch (data) {
		case 'stop':
			self.postMessage('WORKER DIED');
			self.close(); // Terminates the worker.
			break;
		default:
			self.postMessage('Started drawing...');

	};


}, false);