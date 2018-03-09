import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const init = (sel, opts) => {
	if (!document.querySelector(sel)) throw new Error('Guide cannot be initialised, no element found');

	return Object.assign(Object.create(componentPrototype), {
		settings: Object.assign({}, defaults, opts)
	}).init();
};

export default { init };