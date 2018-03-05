import Guide from './libs/component';

const onDOMContentLoadedTasks = [() => {
	let guide = Guide.init('.js-guide');
	console.log(guide);
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });