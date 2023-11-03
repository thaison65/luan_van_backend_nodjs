// file continuousTask.js
function runTask() {
	console.log('This task is being run continuously');
	setTimeout(runTask, 300000);
}

export { runTask };
