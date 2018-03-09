/**
 * @name storm-guide: GDS-style guide pattern implementation
 * @version 1.1.0: Fri, 09 Mar 2018 14:22:39 GMT
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
var defaults = {
	linkClassName: '.js-guide__link',
	sectionClassName: '.js-guide__section',
	incrementalNavHolder: '.js-guide__incremental',
	activeClassName: 'active'
};

var CONSTANTS = {
	TRIGGER_EVENTS: ['click', 'keydown'],
	TRIGGER_KEYCODES: [13, 32]
};
var hash = window.location && window.location.hash.slice(1) || null;

var navNext = function navNext(data) {
	return '<a href="' + data.link + '" rel="next" class="js-guide__incremental--next guide__incremental--next">\n                                <div class="guide__incremental-part">\n                                    Part ' + data.num + '\n                                </div>\n                                <div class="guide__incremental-title">' + data.title + '</div>\n                            </a>';
};

var navPrevious = function navPrevious(data) {
	return '<a href="' + data.link + '" rel="previous" class="js-guide__incremental--previous guide__incremental--previous">\n                                <div class="guide__incremental-part">\n                                    Part ' + data.num + '\n                                </div>\n                                <div class="guide__incremental-title">' + data.title + '</div>\n                            </a>';
};

var componentPrototype = {
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
		this.bindEvents(this.settings.linkClassName);

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

		var getNavData = function getNavData(i) {
			return {
				link: _this2.links[i].getAttribute('href'),
				num: i + 1,
				title: _this2.links[i].innerText
			};
		};

		this.incrementalNavHolder.innerHTML = (this.currentIndex > 0 ? navPrevious(getNavData(this.currentIndex - 1)) : '') + '\n\t\t\t\t\t\t\t\t\t\t\t\t' + (this.currentIndex !== this.links.length - 1 ? navNext(getNavData(this.currentIndex + 1)) : '');

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

	return Object.assign(Object.create(componentPrototype), {
		settings: Object.assign({}, defaults, opts)
	}).init();
};

var index = { init: init };

exports.default = index;;
}));
