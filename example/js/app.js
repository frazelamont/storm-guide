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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTs7Ozs7Ozs7QUFFQSxJQUFNLDJCQUEyQixZQUFNLEFBQ3RDO0tBQUksUUFBUSxvQkFBQSxBQUFNLEtBQWxCLEFBQVksQUFBVyxBQUN2QjtTQUFBLEFBQVEsSUFBUixBQUFZLEFBQ1o7QUFIRCxBQUFnQyxDQUFBOztBQUtoQyxJQUFHLHNCQUFILEFBQXlCLGVBQVEsQUFBTyxpQkFBUCxBQUF3QixvQkFBb0IsWUFBTSxBQUFFO3lCQUFBLEFBQXdCLFFBQVEsVUFBQSxBQUFDLElBQUQ7U0FBQSxBQUFRO0FBQXhDLEFBQWdEO0FBQXBHLENBQUE7Ozs7Ozs7OztBQ1BqQzs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU0sT0FBTyxTQUFQLEFBQU8sS0FBQSxBQUFDLEtBQUQsQUFBTSxNQUFTLEFBQzNCO0tBQUksQ0FBQyxTQUFBLEFBQVMsY0FBZCxBQUFLLEFBQXVCLE1BQU0sTUFBTSxJQUFBLEFBQUksTUFBVixBQUFNLEFBQVUsQUFFbEQ7O2VBQU8sQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7WUFDSSxPQUFBLEFBQU8sT0FBUCxBQUFjLHdCQURsQixBQUFpRCxBQUM3QyxBQUE0QjtBQURpQixBQUN2RCxFQURNLEVBQVAsQUFBTyxBQUVKLEFBQ0g7QUFORDs7a0JBUWUsRUFBRSxNLEFBQUY7Ozs7Ozs7O0FDWGYsSUFBTTtpQkFDWSxDQUFBLEFBQUMsU0FERCxBQUNBLEFBQVUsQUFDMUI7bUJBQWtCLENBQUEsQUFBQyxJQUZyQixBQUFrQixBQUVF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QUE5QixBQUFzQyxhQUFjLE9BQUEsQUFBTyxRQUFQLEFBQWUsVUFBVSxFQUFFLEtBQUssTUFBaEMsQUFBeUIsQUFBYSxXQUF0QyxBQUFpRCxJQUFJLE1BQXpHLEFBQW9ELEFBQTJELEFBQy9HO0FBekZhLEFBMEZkO0FBMUZjLHFDQUFBLEFBMEZELE1BQUssQUFDakI7Y0FBTyxBQUFLLE1BQUwsQUFBVyxPQUFPLFVBQUEsQUFBQyxHQUFELEFBQUksTUFBSixBQUFVLEdBQU0sQUFBRTtPQUFHLEtBQUEsQUFBSyxhQUFMLEFBQWtCLFlBQXJCLEFBQWlDLE1BQU0sRUFBQSxBQUFFLEtBQUYsQUFBTyxHQUFJLE9BQUEsQUFBTyxBQUFJO0FBQWpHLEdBQUEsRUFBQSxBQUFtRyxJQUExRyxBQUFPLEFBQXVHLEFBQzlHO0EsQUE1RmE7QUFBQSxBQUNkOzs7Ozs7Ozs7bUJDckJjLEFBQ0ksQUFDZjtzQkFGVyxBQUVPLEFBQ2xCOzBCQUhXLEFBR1csQUFDdEI7cUIsQUFKVyxBQUlNO0FBSk4sQUFDWCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9cmV0dXJuIGV9KSgpIiwiaW1wb3J0IEd1aWRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cdGxldCBndWlkZSA9IEd1aWRlLmluaXQoJy5qcy1ndWlkZScpO1xuXHRjb25zb2xlLmxvZyhndWlkZSk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsKSkgdGhyb3cgbmV3IEVycm9yKCdHdWlkZSBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGVsZW1lbnQgZm91bmQnKTtcblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdH0pLmluaXQoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImNvbnN0IENPTlNUQU5UUyA9IHtcblx0XHRUUklHR0VSX0VWRU5UUzogWydjbGljaycsICdrZXlkb3duJ10sXG5cdFx0VFJJR0dFUl9LRVlDT0RFUzogWzEzLCAzMl1cblx0fSxcblx0aGFzaCA9ICh3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkpIHx8IG51bGw7XG5cdFxuY29uc3QgbmF2TmV4dCA9IGRhdGEgPT4gYDxhIGhyZWY9XCIke2RhdGEubGlua31cIiByZWw9XCJuZXh0XCIgY2xhc3M9XCJqcy1ndWlkZV9faW5jcmVtZW50YWwtLW5leHQgZ3VpZGVfX2luY3JlbWVudGFsLS1uZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJndWlkZV9faW5jcmVtZW50YWwtcGFydFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFydCAke2RhdGEubnVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImd1aWRlX19pbmNyZW1lbnRhbC10aXRsZVwiPiR7ZGF0YS50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+YDtcblxuY29uc3QgbmF2UHJldmlvdXMgPSBkYXRhID0+IGA8YSBocmVmPVwiJHtkYXRhLmxpbmt9XCIgcmVsPVwicHJldmlvdXNcIiBjbGFzcz1cImpzLWd1aWRlX19pbmNyZW1lbnRhbC0tcHJldmlvdXMgZ3VpZGVfX2luY3JlbWVudGFsLS1wcmV2aW91c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3VpZGVfX2luY3JlbWVudGFsLXBhcnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhcnQgJHtkYXRhLm51bX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJndWlkZV9faW5jcmVtZW50YWwtdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpe1xuXHRcdGlmKHdpbmRvdy5sb2NhdGlvbikgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnJztcblxuXHRcdHRoaXMubGlua3MgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy5saW5rQ2xhc3NOYW1lKSkgfHwgbnVsbDtcblx0XHR0aGlzLnNlY3Rpb25zID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3Muc2VjdGlvbkNsYXNzTmFtZSkpO1xuXHRcdHRoaXMuaW5jcmVtZW50YWxOYXZIb2xkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2V0dGluZ3MuaW5jcmVtZW50YWxOYXZIb2xkZXIpIHx8IG51bGw7XG5cdFx0dGhpcy5jdXJyZW50SW5kZXggPSAwO1xuXHRcdHRoaXMuY3VycmVudFRpdGxlID0gJyc7XG5cblx0XHRpZighdGhpcy5saW5rcy5sZW5ndGggfHwgIXRoaXMuc2VjdGlvbnMubGVuZ3RoIHx8ICF0aGlzLmluY3JlbWVudGFsTmF2SG9sZGVyKSB0aHJvdyBuZXcgRXJyb3IoJ0d1aWRlIGNvdWxkIG5vdCBiZSBpbml0aWFsaXNlZCwgJyk7XG5cdFx0XG5cdFx0dGhpcy5zZXRJbml0aWFsU3RhdGUoKTtcblx0XHR0aGlzLnNldFZpc2liaWxpdHkoKTtcblx0XHR0aGlzLnNldEFyaWEoKTtcblx0XHR0aGlzLnJlbmRlckluY3JlbWVudGFsTmF2KCk7XG5cdFx0dGhpcy5iaW5kRXZlbnRzKCcuanMtZ3VpZGVfX2xpbmsnKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHRcdFxuXHR9LFxuXHRzZXRJbml0aWFsU3RhdGUoKXtcblx0XHR0aGlzLmxpbmtzLmZvckVhY2goKGxpbmssIGkpID0+IHtcblx0XHRcdGlmKGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpID09PSBoYXNoKSB7XG5cdFx0XHRcdHRoaXMuY3VycmVudEluZGV4ID0gaTtcblx0XHRcdFx0dGhpcy5jdXJyZW50VGl0bGUgPSBsaW5rLmlubmVyVGV4dDtcblx0XHRcdH1cblx0XHR9KTtcblx0XHQhdGhpcy5jdXJyZW50VGl0bGUgPyB0aGlzLmxpbmtzW3RoaXMuY3VycmVudEluZGV4XS5pbm5lclRleHQgOiB0aGlzLmN1cnJlbnRUaXRsZTtcblx0fSxcblx0c2V0VmlzaWJpbGl0eShwcmV2aW91c0luZGV4KXtcblx0XHRpZihwcmV2aW91c0luZGV4ICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHRoaXMubGlua3NbcHJldmlvdXNJbmRleF0uY2xhc3NMaXN0LnJlbW92ZSh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzTmFtZSk7XG5cdFx0XHR0aGlzLnNlY3Rpb25zW3ByZXZpb3VzSW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzc05hbWUpO1xuXHRcdH1cblx0XHR0aGlzLmxpbmtzW3RoaXMuY3VycmVudEluZGV4XS5jbGFzc0xpc3QuYWRkKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3NOYW1lKTtcblx0XHR0aGlzLnNlY3Rpb25zW3RoaXMuY3VycmVudEluZGV4XS5jbGFzc0xpc3QuYWRkKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3NOYW1lKTtcblx0XHRcblx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwwKTtcblx0XHR3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRpZihoYXNoICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoID09PSAnJykgICghIXdpbmRvdy5oaXN0b3J5ICYmICEhd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBVUkw6IGAjJHtoYXNofWB9LCAnJywgYCMke2hhc2h9YCk7XG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oMCwwKTtcblx0XHR9LCAwKTtcblx0fSxcblx0c2V0QXJpYSgpe1xuXHRcdGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmxpbmtzLmxlbmd0aDsgaSsrKXtcblx0XHRcdHRoaXMubGlua3NbaV0uc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdGhpcy5jdXJyZW50SW5kZXggPT09IGkpO1xuXHRcdFx0dGhpcy5saW5rc1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnLCB0aGlzLmxpbmtzW2ldLmdldEF0dHJpYnV0ZSgnaHJlZicpLnN1YnN0cigxKSk7XG5cdFx0XHR0aGlzLnNlY3Rpb25zW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAhKHRoaXMuY3VycmVudEluZGV4ID09PSBpKSk7XG5cdFx0fVxuXHR9LFxuXHRyZW5kZXJJbmNyZW1lbnRhbE5hdigpe1xuXHRcdGxldCBnZXROYXZEYXRhID0gaSA9PiB7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0bGluazogdGhpcy5saW5rc1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSxcblx0XHRcdFx0XHRudW06IGkgKyAxLFxuXHRcdFx0XHRcdHRpdGxlOiB0aGlzLmxpbmtzW2ldLmlubmVyVGV4dFxuXHRcdFx0XHR9O1xuXHRcdFx0fTtcblx0XHRcdFxuXHRcdHRoaXMuaW5jcmVtZW50YWxOYXZIb2xkZXIuaW5uZXJIVE1MID0gYCR7dGhpcy5jdXJyZW50SW5kZXggPiAwID8gbmF2UHJldmlvdXMoZ2V0TmF2RGF0YSh0aGlzLmN1cnJlbnRJbmRleCAtIDEpKSA6ICcnfVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JHt0aGlzLmN1cnJlbnRJbmRleCAhPT0gdGhpcy5saW5rcy5sZW5ndGggLSAxID8gIG5hdk5leHQoZ2V0TmF2RGF0YSh0aGlzLmN1cnJlbnRJbmRleCArIDEpKTogJyd9YDtcblxuXHRcdHRoaXMuYmluZEV2ZW50cygnLmpzLWd1aWRlX19pbmNyZW1lbnRhbC0tcHJldmlvdXMsIC5qcy1ndWlkZV9faW5jcmVtZW50YWwtLW5leHQnKTtcblx0fSxcblx0YmluZEV2ZW50cyhzZWwpIHtcblx0XHRbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSkuZm9yRWFjaChidG4gPT4ge1xuXHRcdFx0Q09OU1RBTlRTLlRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuXHRcdFx0XHRidG4uYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG5cdFx0XHRcdFx0aWYoISFlLmtleUNvZGUgJiYgIX5DT05TVEFOVFMuVFJJR0dFUl9LRVlDT0RFUy5pbmRleE9mKGUua2V5Q29kZSkpIHJldHVybjtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0dGhpcy5jaGFuZ2UoZS50YXJnZXQpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9LFxuXHRjaGFuZ2UobGluaykge1xuXHRcdGxldCBwcmV2aW91c0luZGV4ID0gdGhpcy5jdXJyZW50SW5kZXgsXG5cdFx0XHRuZXh0VXJsID0gKGxpbmsucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSB8fCBsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpKS5zcGxpdCgnIycpWzFdLFxuXHRcdFx0bmV4dEluZGV4ID0gdGhpcy5nZXROZXh0SW5kZXgoJyMnICsgbmV4dFVybCk7XG5cdFx0XG5cdFx0aWYocHJldmlvdXNJbmRleCA9PT0gbmV4dEluZGV4KSByZXR1cm47XG5cdFx0XG5cdFx0dGhpcy5jdXJyZW50SW5kZXggPSBuZXh0SW5kZXg7XG5cdFx0dGhpcy5zZXRWaXNpYmlsaXR5KHByZXZpb3VzSW5kZXgpO1xuXHRcdHRoaXMuc2V0QXJpYSgpO1xuXHRcdHRoaXMucmVuZGVySW5jcmVtZW50YWxOYXYoKTtcblxuXHRcdCghIXdpbmRvdy5oaXN0b3J5ICYmICEhd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBVUkw6ICcjJyArIG5leHRVcmwgfSwgJycsICcjJyArIG5leHRVcmwpO1xuXHR9LFxuXHRnZXROZXh0SW5kZXgoaHJlZil7XG5cdFx0cmV0dXJuIHRoaXMubGlua3MucmVkdWNlKChhLCBsaW5rLCBpKSA9PiB7IGlmKGxpbmsuZ2V0QXR0cmlidXRlKCdocmVmJykgPT09IGhyZWYpIGEucHVzaChpKTsgcmV0dXJuIGE7IH0sIFtdKVswXTtcblx0fVxufTsiLCJleHBvcnQgZGVmYXVsdCB7XG4gICAgbGlua0NsYXNzTmFtZTogJy5qcy1ndWlkZV9fbGluaycsXG4gICAgc2VjdGlvbkNsYXNzTmFtZTogJy5qcy1ndWlkZV9fc2VjdGlvbicsXG4gICAgaW5jcmVtZW50YWxOYXZIb2xkZXI6ICcuanMtZ3VpZGVfX2luY3JlbWVudGFsJyxcbiAgICBhY3RpdmVDbGFzc05hbWU6ICdhY3RpdmUnXG59OyJdfQ==
