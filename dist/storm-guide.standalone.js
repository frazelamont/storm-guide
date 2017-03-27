/**
 * @name storm-guide: GDS Guide page-like implementation
 * @version 1.0.0: Sat, 18 Mar 2017 15:37:48 GMT
 * @author stormid
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.StormGuide = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var CONSTANTS = {
	TRIGGER_EVENTS: ['click', 'keydown'],
	TRIGGER_KEYCODES: [13, 32]
},
    defaults = {
	linkClassName: '.js-guide__link',
	sectionClassName: '.js-guide__section',
	incrementalNavHolder: '.js-guide__incremental',
	activeClassName: 'active'
},
    hash = window.location && window.location.hash.slice(1) || null,
    templates = {
	previousNav: ['<a href="{{link}}" rel="previous" class="js-guide__incremental--previous guide__incremental--previous">', '<div class="guide__incremental-part">Part {{num}}</div>', '<div class="guide__incremental-title">{{title}}</div>', '</a>'].join(''),
	nextNav: ['<a href="{{link}}" rel="next" class="js-guide__incremental--next guide__incremental--next">', '<div class="guide__incremental-part">Part {{num}}</div>', '<div class="guide__incremental-title">{{title}}</div>', '</a>'].join('')
},
    render = function render(template, data) {
	for (var k in data) {
		if (data.hasOwnProperty(k)) {
			template = template.split('{{' + k + '}}').join(data[k]);
		}
	}
	return template;
};

var StormGuide = {
	init: function init() {
		if (window.location) window.location.hash = '';

		this.links = [].slice.call(document.querySelectorAll(this.settings.linkClassName)) || null;
		this.sections = [].slice.call(document.querySelectorAll(this.settings.sectionClassName));
		this.incrementalNavHolder = document.querySelector(this.settings.incrementalNavHolder) || null;
		this.currentIndex = 0;
		this.currentTitle = '';

		if (!this.links.length || !this.sections.length || !this.incrementalNavHolder) throw new Error('Guide could not be initialised, ');

		this.setInitialState();
		this.setVisibility();
		this.setAria();
		this.renderIncrementalNav();
		this.bindEvents('.js-guide__link');

		return this;
	},
	setInitialState: function setInitialState() {
		var _this = this;

		this.links.forEach(function (link, i) {
			if (link.getAttribute('href').substr(1) === hash) {
				_this.currentIndex = i;
				_this.currentTitle = link.innerText;
			}
		});
		!this.currentTitle ? this.links[this.currentIndex].innerText : this.currentTitle;
	},
	setVisibility: function setVisibility(previousIndex) {
		if (previousIndex !== undefined) {
			this.links[previousIndex].classList.remove(this.settings.activeClassName);
			this.sections[previousIndex].classList.remove(this.settings.activeClassName);
		}
		this.links[this.currentIndex].classList.add(this.settings.activeClassName);
		this.sections[this.currentIndex].classList.add(this.settings.activeClassName);

		window.scrollTo(0, 0);
		window.setTimeout(function () {
			if (hash && window.location.hash === '') !!window.history && !!window.history.pushState && window.history.pushState({ URL: '#' + hash }, '', '#' + hash);
			window.scrollTo(0, 0);
		}, 0);
	},
	setAria: function setAria() {
		for (var i = 0; i < this.links.length; i++) {
			this.links[i].setAttribute('aria-selected', this.currentIndex === i);
			this.links[i].setAttribute('aria-controls', this.links[i].getAttribute('href').substr(1));
			this.sections[i].setAttribute('aria-hidden', !(this.currentIndex === i));
		}
	},
	renderIncrementalNav: function renderIncrementalNav() {
		var _this2 = this;

		var incrementalNav = '',
		    getNavData = function getNavData(i) {
			return {
				link: _this2.links[i].href,
				num: i + 1,
				title: _this2.links[i].innerText
			};
		};

		if (this.currentIndex > 0) incrementalNav = render(templates.previousNav, getNavData(this.currentIndex - 1));

		if (this.currentIndex !== this.links.length - 1) incrementalNav += render(templates.nextNav, getNavData(this.currentIndex + 1));

		this.incrementalNavHolder.innerHTML = incrementalNav;
		this.bindEvents('.js-guide__incremental--previous, .js-guide__incremental--next');
	},
	bindEvents: function bindEvents(sel) {
		var _this3 = this;

		[].slice.call(document.querySelectorAll(sel)).forEach(function (btn) {
			CONSTANTS.TRIGGER_EVENTS.forEach(function (ev) {
				btn.addEventListener(ev, function (e) {
					if (!!e.keyCode && !~CONSTANTS.TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
					e.preventDefault();
					_this3.change(e.target);
				});
			});
		});
	},
	change: function change(link) {
		var previousIndex = this.currentIndex,
		    nextUrl = (link.parentNode.getAttribute('href') || link.getAttribute('href')).split('#')[1],
		    nextIndex = this.getNextIndex('#' + nextUrl);

		if (previousIndex === nextIndex) return;

		this.currentIndex = nextIndex;
		this.setVisibility(previousIndex);
		this.setAria();
		this.renderIncrementalNav();

		!!window.history && !!window.history.pushState && window.history.pushState({ URL: '#' + nextUrl }, '', '#' + nextUrl);
	},
	getNextIndex: function getNextIndex(href) {
		return this.links.reduce(function (a, link, i) {
			if (link.getAttribute('href') === href) a.push(i);return a;
		}, [])[0];
	}
};

var init = function init(sel, opts) {
	if (!document.querySelector(sel)) throw new Error('Guide cannot be initialised, no element found');

	return Object.assign(Object.create(StormGuide), {
		settings: Object.assign({}, defaults, opts)
	}).init();
};

exports.default = { init: init };;
}));
