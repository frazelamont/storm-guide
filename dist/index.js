/**
 * @name storm-guide: GDS Guide page-like implementation
 * @version 1.0.2: Wed, 07 Jun 2017 13:37:25 GMT
 * @author stormid
 * @license MIT
 */
import defaults from './lib/defaults';
import componentPrototype from './lib/component-prototype';

const init = (sel, opts) => {
	if (!document.querySelector(sel)) throw new Error('Guide cannot be initialised, no element found');

	return Object.assign(Object.create(componentPrototype), {
		settings: Object.assign({}, defaults, opts)
	}).init();
};

export default { init };