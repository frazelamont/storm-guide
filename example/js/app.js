(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
	var guide = _component2.default.init('.js-guide');
	console.log(guide);
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
	onDOMContentLoadedTasks.forEach(function (fn) {
		return fn();
	});
});

},{"./libs/component":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var init = function init(sel, opts) {
	if (!document.querySelector(sel)) throw new Error('Guide cannot be initialised, no element found');

	return Object.assign(Object.create(_componentPrototype2.default), {
		settings: Object.assign({}, _defaults2.default, opts)
	}).init();
};

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var CONSTANTS = {
	TRIGGER_EVENTS: ['click', 'keydown'],
	TRIGGER_KEYCODES: [13, 32]
},
    hash = window.location && window.location.hash.slice(1) || null;

var navNext = function navNext(data) {
	return '<a href="' + data.link + '" rel="next" class="js-guide__incremental--next guide__incremental--next">\n                                <div class="guide__incremental-part">\n                                    Part ' + data.num + '\n                                </div>\n                                <div class="guide__incremental-title">' + data.title + '</div>\n                            </a>';
};

var navPrevious = function navPrevious(data) {
	return '<a href="' + data.link + '" rel="previous" class="js-guide__incremental--previous guide__incremental--previous">\n                                <div class="guide__incremental-part">\n                                    Part ' + data.num + '\n                                </div>\n                                <div class="guide__incremental-title">' + data.title + '</div>\n                            </a>';
};

exports.default = {
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

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    linkClassName: '.js-guide__link',
    sectionClassName: '.js-guide__section',
    incrementalNavHolder: '.js-guide__incremental',
    activeClassName: 'active'
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO0tBQUksUUFBUSxvQkFBQSxBQUFNLEtBQWxCLEFBQVksQUFBVyxBQUN2QjtTQUFBLEFBQVEsSUFBUixBQUFZLEFBQ1o7QUFIRCxBQUFnQyxDQUFBOztBQUtoQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFO3lCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7U0FBQSxBQUFRO0FBQXhDLEFBQWdEO0FBQXBHLENBQUE7Ozs7Ozs7OztBQ1BqQzs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0tBQUksQ0FBQyxTQUFBLEFBQVMsY0FBZCxBQUFLLEFBQXVCLE1BQU0sTUFBTSxJQUFBLEFBQUksTUFBVixBQUFNLEFBQVUsQUFFbEQ7O2VBQU8sQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7WUFDSSxPQUFBLEFBQU8sT0FBUCxBQUFjLHdCQURsQixBQUFpRCxBQUM3QyxBQUE0QjtBQURpQixBQUN2RCxFQURNLEVBQVAsQUFBTyxBQUVKLEFBQ0g7QUFORDs7a0JBUWUsRUFBRSxNLEFBQUY7Ozs7Ozs7O0FDWGYsSUFBTTtpQkFDWSxDQUFBLEFBQUMsU0FERCxBQUNBLEFBQVUsQUFDMUI7bUJBQWtCLENBQUEsQUFBQyxJQUZyQixBQUFrQixBQUVF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Q0FBQyxPQUFBLEFBQU8sUUFBOUIsQUFBc0MsYUFBYyxPQUFBLEFBQU8sUUFBUCxBQUFlLFVBQVUsRUFBRSxLQUFLLE1BQWhDLEFBQXlCLEFBQWEsV0FBdEMsQUFBaUQsSUFBSSxNQUF6RyxBQUFvRCxBQUEyRCxBQUMvRztBQXpGYSxBQTBGZDtBQTFGYyxxQ0FBQSxBQTBGRCxNQUFLLEFBQ2pCO2NBQU8sQUFBSyxNQUFMLEFBQVcsT0FBTyxVQUFBLEFBQUMsR0FBRCxBQUFJLE1BQUosQUFBVSxHQUFNLEFBQUU7T0FBRyxLQUFBLEFBQUssYUFBTCxBQUFrQixZQUFyQixBQUFpQyxNQUFNLEVBQUEsQUFBRSxLQUFGLEFBQU8sR0FBSSxPQUFBLEFBQU8sQUFBSTtBQUFqRyxHQUFBLEVBQUEsQUFBbUcsSUFBMUcsQUFBTyxBQUF1RyxBQUM5RztBLEFBNUZhO0FBQUEsQUFDZDs7Ozs7Ozs7O21CQ3JCYyxBQUNJLEFBQ2Y7c0JBRlcsQUFFTyxBQUNsQjswQkFIVyxBQUdXLEFBQ3RCO3FCLEFBSlcsQUFJTTtBQUpOLEFBQ1giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImltcG9ydCBHdWlkZSBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuXHRsZXQgZ3VpZGUgPSBHdWlkZS5pbml0KCcuanMtZ3VpZGUnKTtcblx0Y29uc29sZS5sb2coZ3VpZGUpO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0aWYgKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCkpIHRocm93IG5ldyBFcnJvcignR3VpZGUgY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBlbGVtZW50IGZvdW5kJyk7XG5cblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHR9KS5pbml0KCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJjb25zdCBDT05TVEFOVFMgPSB7XG5cdFx0VFJJR0dFUl9FVkVOVFM6IFsnY2xpY2snLCAna2V5ZG93biddLFxuXHRcdFRSSUdHRVJfS0VZQ09ERVM6IFsxMywgMzJdXG5cdH0sXG5cdGhhc2ggPSAod2luZG93LmxvY2F0aW9uICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNsaWNlKDEpKSB8fCBudWxsO1xuXHRcbmNvbnN0IG5hdk5leHQgPSBkYXRhID0+IGA8YSBocmVmPVwiJHtkYXRhLmxpbmt9XCIgcmVsPVwibmV4dFwiIGNsYXNzPVwianMtZ3VpZGVfX2luY3JlbWVudGFsLS1uZXh0IGd1aWRlX19pbmNyZW1lbnRhbC0tbmV4dFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3VpZGVfX2luY3JlbWVudGFsLXBhcnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhcnQgJHtkYXRhLm51bX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJndWlkZV9faW5jcmVtZW50YWwtdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPmA7XG5cbmNvbnN0IG5hdlByZXZpb3VzID0gZGF0YSA9PiBgPGEgaHJlZj1cIiR7ZGF0YS5saW5rfVwiIHJlbD1cInByZXZpb3VzXCIgY2xhc3M9XCJqcy1ndWlkZV9faW5jcmVtZW50YWwtLXByZXZpb3VzIGd1aWRlX19pbmNyZW1lbnRhbC0tcHJldmlvdXNcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImd1aWRlX19pbmNyZW1lbnRhbC1wYXJ0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQYXJ0ICR7ZGF0YS5udW19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3VpZGVfX2luY3JlbWVudGFsLXRpdGxlXCI+JHtkYXRhLnRpdGxlfTwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYT5gO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGluaXQoKXtcblx0XHRpZih3aW5kb3cubG9jYXRpb24pIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJyc7XG5cblx0XHR0aGlzLmxpbmtzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3MubGlua0NsYXNzTmFtZSkpIHx8IG51bGw7XG5cdFx0dGhpcy5zZWN0aW9ucyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNldHRpbmdzLnNlY3Rpb25DbGFzc05hbWUpKTtcblx0XHR0aGlzLmluY3JlbWVudGFsTmF2SG9sZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNldHRpbmdzLmluY3JlbWVudGFsTmF2SG9sZGVyKSB8fCBudWxsO1xuXHRcdHRoaXMuY3VycmVudEluZGV4ID0gMDtcblx0XHR0aGlzLmN1cnJlbnRUaXRsZSA9ICcnO1xuXG5cdFx0aWYoIXRoaXMubGlua3MubGVuZ3RoIHx8ICF0aGlzLnNlY3Rpb25zLmxlbmd0aCB8fCAhdGhpcy5pbmNyZW1lbnRhbE5hdkhvbGRlcikgdGhyb3cgbmV3IEVycm9yKCdHdWlkZSBjb3VsZCBub3QgYmUgaW5pdGlhbGlzZWQsICcpO1xuXHRcdFxuXHRcdHRoaXMuc2V0SW5pdGlhbFN0YXRlKCk7XG5cdFx0dGhpcy5zZXRWaXNpYmlsaXR5KCk7XG5cdFx0dGhpcy5zZXRBcmlhKCk7XG5cdFx0dGhpcy5yZW5kZXJJbmNyZW1lbnRhbE5hdigpO1xuXHRcdHRoaXMuYmluZEV2ZW50cyh0aGlzLnNldHRpbmdzLmxpbmtDbGFzc05hbWUpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdFx0XG5cdH0sXG5cdHNldEluaXRpYWxTdGF0ZSgpe1xuXHRcdHRoaXMubGlua3MuZm9yRWFjaCgobGluaywgaSkgPT4ge1xuXHRcdFx0aWYobGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkgPT09IGhhc2gpIHtcblx0XHRcdFx0dGhpcy5jdXJyZW50SW5kZXggPSBpO1xuXHRcdFx0XHR0aGlzLmN1cnJlbnRUaXRsZSA9IGxpbmsuaW5uZXJUZXh0O1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCF0aGlzLmN1cnJlbnRUaXRsZSA/IHRoaXMubGlua3NbdGhpcy5jdXJyZW50SW5kZXhdLmlubmVyVGV4dCA6IHRoaXMuY3VycmVudFRpdGxlO1xuXHR9LFxuXHRzZXRWaXNpYmlsaXR5KHByZXZpb3VzSW5kZXgpe1xuXHRcdGlmKHByZXZpb3VzSW5kZXggIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dGhpcy5saW5rc1twcmV2aW91c0luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3NOYW1lKTtcblx0XHRcdHRoaXMuc2VjdGlvbnNbcHJldmlvdXNJbmRleF0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzTmFtZSk7XG5cdFx0fVxuXHRcdHRoaXMubGlua3NbdGhpcy5jdXJyZW50SW5kZXhdLmNsYXNzTGlzdC5hZGQodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzc05hbWUpO1xuXHRcdHRoaXMuc2VjdGlvbnNbdGhpcy5jdXJyZW50SW5kZXhdLmNsYXNzTGlzdC5hZGQodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzc05hbWUpO1xuXHRcdFxuXHRcdHdpbmRvdy5zY3JvbGxUbygwLDApO1xuXHRcdHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdGlmKGhhc2ggJiYgd2luZG93LmxvY2F0aW9uLmhhc2ggPT09ICcnKSAgKCEhd2luZG93Lmhpc3RvcnkgJiYgISF3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IFVSTDogYCMke2hhc2h9YH0sICcnLCBgIyR7aGFzaH1gKTtcblx0XHRcdHdpbmRvdy5zY3JvbGxUbygwLDApO1xuXHRcdH0sIDApO1xuXHR9LFxuXHRzZXRBcmlhKCl7XG5cdFx0Zm9yKGxldCBpID0gMDsgaSA8IHRoaXMubGlua3MubGVuZ3RoOyBpKyspe1xuXHRcdFx0dGhpcy5saW5rc1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0aGlzLmN1cnJlbnRJbmRleCA9PT0gaSk7XG5cdFx0XHR0aGlzLmxpbmtzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycsIHRoaXMubGlua3NbaV0uZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpKTtcblx0XHRcdHRoaXMuc2VjdGlvbnNbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICEodGhpcy5jdXJyZW50SW5kZXggPT09IGkpKTtcblx0XHR9XG5cdH0sXG5cdHJlbmRlckluY3JlbWVudGFsTmF2KCl7XG5cdFx0bGV0IGdldE5hdkRhdGEgPSBpID0+IHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRsaW5rOiB0aGlzLmxpbmtzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpLFxuXHRcdFx0XHRcdG51bTogaSArIDEsXG5cdFx0XHRcdFx0dGl0bGU6IHRoaXMubGlua3NbaV0uaW5uZXJUZXh0XG5cdFx0XHRcdH07XG5cdFx0XHR9O1xuXHRcdFx0XG5cdFx0dGhpcy5pbmNyZW1lbnRhbE5hdkhvbGRlci5pbm5lckhUTUwgPSBgJHt0aGlzLmN1cnJlbnRJbmRleCA+IDAgPyBuYXZQcmV2aW91cyhnZXROYXZEYXRhKHRoaXMuY3VycmVudEluZGV4IC0gMSkpIDogJyd9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQke3RoaXMuY3VycmVudEluZGV4ICE9PSB0aGlzLmxpbmtzLmxlbmd0aCAtIDEgPyAgbmF2TmV4dChnZXROYXZEYXRhKHRoaXMuY3VycmVudEluZGV4ICsgMSkpOiAnJ31gO1xuXG5cdFx0dGhpcy5iaW5kRXZlbnRzKCcuanMtZ3VpZGVfX2luY3JlbWVudGFsLS1wcmV2aW91cywgLmpzLWd1aWRlX19pbmNyZW1lbnRhbC0tbmV4dCcpO1xuXHR9LFxuXHRiaW5kRXZlbnRzKHNlbCkge1xuXHRcdFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKS5mb3JFYWNoKGJ0biA9PiB7XG5cdFx0XHRDT05TVEFOVFMuVFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XG5cdFx0XHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKGV2LCBlID0+IHtcblx0XHRcdFx0XHRpZighIWUua2V5Q29kZSAmJiAhfkNPTlNUQU5UUy5UUklHR0VSX0tFWUNPREVTLmluZGV4T2YoZS5rZXlDb2RlKSkgcmV0dXJuO1xuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR0aGlzLmNoYW5nZShlLnRhcmdldCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0sXG5cdGNoYW5nZShsaW5rKSB7XG5cdFx0bGV0IHByZXZpb3VzSW5kZXggPSB0aGlzLmN1cnJlbnRJbmRleCxcblx0XHRcdG5leHRVcmwgPSAobGluay5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnaHJlZicpIHx8IGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJykpLnNwbGl0KCcjJylbMV0sXG5cdFx0XHRuZXh0SW5kZXggPSB0aGlzLmdldE5leHRJbmRleCgnIycgKyBuZXh0VXJsKTtcblx0XHRcblx0XHRpZihwcmV2aW91c0luZGV4ID09PSBuZXh0SW5kZXgpIHJldHVybjtcblx0XHRcblx0XHR0aGlzLmN1cnJlbnRJbmRleCA9IG5leHRJbmRleDtcblx0XHR0aGlzLnNldFZpc2liaWxpdHkocHJldmlvdXNJbmRleCk7XG5cdFx0dGhpcy5zZXRBcmlhKCk7XG5cdFx0dGhpcy5yZW5kZXJJbmNyZW1lbnRhbE5hdigpO1xuXG5cdFx0KCEhd2luZG93Lmhpc3RvcnkgJiYgISF3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUpICYmIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7IFVSTDogJyMnICsgbmV4dFVybCB9LCAnJywgJyMnICsgbmV4dFVybCk7XG5cdH0sXG5cdGdldE5leHRJbmRleChocmVmKXtcblx0XHRyZXR1cm4gdGhpcy5saW5rcy5yZWR1Y2UoKGEsIGxpbmssIGkpID0+IHsgaWYobGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSA9PT0gaHJlZikgYS5wdXNoKGkpOyByZXR1cm4gYTsgfSwgW10pWzBdO1xuXHR9XG59OyIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICBsaW5rQ2xhc3NOYW1lOiAnLmpzLWd1aWRlX19saW5rJyxcbiAgICBzZWN0aW9uQ2xhc3NOYW1lOiAnLmpzLWd1aWRlX19zZWN0aW9uJyxcbiAgICBpbmNyZW1lbnRhbE5hdkhvbGRlcjogJy5qcy1ndWlkZV9faW5jcmVtZW50YWwnLFxuICAgIGFjdGl2ZUNsYXNzTmFtZTogJ2FjdGl2ZSdcbn07Il19
