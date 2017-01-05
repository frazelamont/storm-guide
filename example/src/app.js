import Guide from './libs/storm-guide';

const onDOMContentLoadedTasks = [() => {
	Guide.init();
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });