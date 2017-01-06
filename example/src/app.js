import Guide from './libs/storm-guide';

const onDOMContentLoadedTasks = [() => {
	let guide = Guide.init();
	console.log(guide);
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });