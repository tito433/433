if (!!window.SharedWorker) {
	var plugin = new Plugin(document.getElementById('input'))
	canvas = new Canvas(document.getElementById('output'));

	sharedWorker.forEach(function(sClass) {
		var WorkerIO = new Worker("js/worker/" + sClass + '.js', 'NDN-Worker');
		console.log('WorkerIO:', WorkerIO);

		WorkerIO.addEventListener('message', function(e) {
			console.log('got response', e);
			// canvas.draw(e.data);
		}, false);

		WorkerIO.postMessage(['draw', plugin.data]);
		WorkerIO.addEventListener('error', function(e) {
			throw new Error('WorkerIO Error: could not open SharedWorker', e);
		}, false);

	});
} else {
	console.log('window.SharedWorker does not exist.')
}