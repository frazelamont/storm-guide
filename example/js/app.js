(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFBLGFBQUEsUUFBQSxrQkFBQSxDQUFBOzs7Ozs7OztBQUVBLElBQU0sMEJBQTBCLENBQUMsWUFBTTtBQUN0QyxLQUFJLFFBQVEsWUFBQSxPQUFBLENBQUEsSUFBQSxDQUFaLFdBQVksQ0FBWjtBQUNBLFNBQUEsR0FBQSxDQUFBLEtBQUE7QUFGRCxDQUFnQyxDQUFoQzs7QUFLQSxJQUFHLHNCQUFILE1BQUEsRUFBaUMsT0FBQSxnQkFBQSxDQUFBLGtCQUFBLEVBQTRDLFlBQU07QUFBRSx5QkFBQSxPQUFBLENBQWdDLFVBQUEsRUFBQSxFQUFBO0FBQUEsU0FBQSxJQUFBO0FBQWhDLEVBQUE7QUFBcEQsQ0FBQTs7Ozs7Ozs7O0FDUGpDLElBQUEsWUFBQSxRQUFBLGdCQUFBLENBQUE7Ozs7QUFDQSxJQUFBLHNCQUFBLFFBQUEsMkJBQUEsQ0FBQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxJQUFPLENBQUEsR0FBQSxFQUFBLElBQUEsRUFBZTtBQUMzQixLQUFJLENBQUMsU0FBQSxhQUFBLENBQUwsR0FBSyxDQUFMLEVBQWtDLE1BQU0sSUFBQSxLQUFBLENBQU4sK0NBQU0sQ0FBTjs7QUFFbEMsUUFBTyxPQUFBLE1BQUEsQ0FBYyxPQUFBLE1BQUEsQ0FBYyxxQkFBNUIsT0FBYyxDQUFkLEVBQWlEO0FBQ3ZELFlBQVUsT0FBQSxNQUFBLENBQUEsRUFBQSxFQUFrQixXQUFsQixPQUFBLEVBQUEsSUFBQTtBQUQ2QyxFQUFqRCxFQUFQLElB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LGdCQUFnQixLQUFwQixZQUFBO0FBQUEsTUFDQyxVQUFVLENBQUMsS0FBQSxVQUFBLENBQUEsWUFBQSxDQUFBLE1BQUEsS0FBd0MsS0FBQSxZQUFBLENBQXpDLE1BQXlDLENBQXpDLEVBQUEsS0FBQSxDQUFBLEdBQUEsRUFEWCxDQUNXLENBRFg7QUFBQSxNQUVDLFlBQVksS0FBQSxZQUFBLENBQWtCLE1BRi9CLE9BRWEsQ0FGYjs7QUFJQSxNQUFHLGtCQUFILFNBQUEsRUFBZ0M7O0FBRWhDLE9BQUEsWUFBQSxHQUFBLFNBQUE7QUFDQSxPQUFBLGFBQUEsQ0FBQSxhQUFBO0FBQ0EsT0FBQSxPQUFBO0FBQ0EsT0FBQSxvQkFBQTs7QUFFQyxHQUFDLENBQUMsT0FBRixPQUFBLElBQW9CLENBQUMsQ0FBQyxPQUFBLE9BQUEsQ0FBdkIsU0FBQyxJQUFtRCxPQUFBLE9BQUEsQ0FBQSxTQUFBLENBQXlCLEVBQUUsS0FBSyxNQUFoQyxPQUF5QixFQUF6QixFQUFBLEVBQUEsRUFBcUQsTUFBekcsT0FBb0QsQ0FBbkQ7QUF4RlksRUFBQTtBQUFBLGVBQUEsU0FBQSxZQUFBLENBQUEsSUFBQSxFQTBGSTtBQUNqQixTQUFPLEtBQUEsS0FBQSxDQUFBLE1BQUEsQ0FBa0IsVUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLENBQUEsRUFBZ0I7QUFBRSxPQUFHLEtBQUEsWUFBQSxDQUFBLE1BQUEsTUFBSCxJQUFBLEVBQXVDLEVBQUEsSUFBQSxDQUFBLENBQUEsRUFBVyxPQUFBLENBQUE7QUFBdEYsR0FBQSxFQUFBLEVBQUEsRUFBUCxDQUFPLENBQVA7QUFDQTtBQTVGYSxDOzs7Ozs7OztrQkNwQkE7QUFDWCxtQkFEVyxpQkFBQTtBQUVYLHNCQUZXLG9CQUFBO0FBR1gsMEJBSFcsd0JBQUE7QUFJWCxxQkFBaUI7QUFKTixDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IEd1aWRlIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cdGxldCBndWlkZSA9IEd1aWRlLmluaXQoJy5qcy1ndWlkZScpO1xuXHRjb25zb2xlLmxvZyhndWlkZSk7XG59XTtcbiAgICBcbmlmKCdhZGRFdmVudExpc3RlbmVyJyBpbiB3aW5kb3cpIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcy5mb3JFYWNoKChmbikgPT4gZm4oKSk7IH0pOyIsImltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2xpYi9kZWZhdWx0cyc7XG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xuXG5jb25zdCBpbml0ID0gKHNlbCwgb3B0cykgPT4ge1xuXHRpZiAoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsKSkgdGhyb3cgbmV3IEVycm9yKCdHdWlkZSBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGVsZW1lbnQgZm91bmQnKTtcblxuXHRyZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuY3JlYXRlKGNvbXBvbmVudFByb3RvdHlwZSksIHtcblx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdH0pLmluaXQoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImNvbnN0IENPTlNUQU5UUyA9IHtcblx0XHRUUklHR0VSX0VWRU5UUzogWydjbGljaycsICdrZXlkb3duJ10sXG5cdFx0VFJJR0dFUl9LRVlDT0RFUzogWzEzLCAzMl1cblx0fSxcblx0aGFzaCA9ICh3aW5kb3cubG9jYXRpb24gJiYgd2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkpIHx8IG51bGw7XG5cdFxuY29uc3QgbmF2TmV4dCA9IGRhdGEgPT4gYDxhIGhyZWY9XCIke2RhdGEubGlua31cIiByZWw9XCJuZXh0XCIgY2xhc3M9XCJqcy1ndWlkZV9faW5jcmVtZW50YWwtLW5leHQgZ3VpZGVfX2luY3JlbWVudGFsLS1uZXh0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJndWlkZV9faW5jcmVtZW50YWwtcGFydFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUGFydCAke2RhdGEubnVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImd1aWRlX19pbmNyZW1lbnRhbC10aXRsZVwiPiR7ZGF0YS50aXRsZX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+YDtcblxuY29uc3QgbmF2UHJldmlvdXMgPSBkYXRhID0+IGA8YSBocmVmPVwiJHtkYXRhLmxpbmt9XCIgcmVsPVwicHJldmlvdXNcIiBjbGFzcz1cImpzLWd1aWRlX19pbmNyZW1lbnRhbC0tcHJldmlvdXMgZ3VpZGVfX2luY3JlbWVudGFsLS1wcmV2aW91c1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3VpZGVfX2luY3JlbWVudGFsLXBhcnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBhcnQgJHtkYXRhLm51bX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJndWlkZV9faW5jcmVtZW50YWwtdGl0bGVcIj4ke2RhdGEudGl0bGV9PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9hPmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcblx0aW5pdCgpe1xuXHRcdGlmKHdpbmRvdy5sb2NhdGlvbikgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnJztcblxuXHRcdHRoaXMubGlua3MgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZXR0aW5ncy5saW5rQ2xhc3NOYW1lKSkgfHwgbnVsbDtcblx0XHR0aGlzLnNlY3Rpb25zID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2V0dGluZ3Muc2VjdGlvbkNsYXNzTmFtZSkpO1xuXHRcdHRoaXMuaW5jcmVtZW50YWxOYXZIb2xkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuc2V0dGluZ3MuaW5jcmVtZW50YWxOYXZIb2xkZXIpIHx8IG51bGw7XG5cdFx0dGhpcy5jdXJyZW50SW5kZXggPSAwO1xuXHRcdHRoaXMuY3VycmVudFRpdGxlID0gJyc7XG5cblx0XHRpZighdGhpcy5saW5rcy5sZW5ndGggfHwgIXRoaXMuc2VjdGlvbnMubGVuZ3RoIHx8ICF0aGlzLmluY3JlbWVudGFsTmF2SG9sZGVyKSB0aHJvdyBuZXcgRXJyb3IoJ0d1aWRlIGNvdWxkIG5vdCBiZSBpbml0aWFsaXNlZCwgJyk7XG5cdFx0XG5cdFx0dGhpcy5zZXRJbml0aWFsU3RhdGUoKTtcblx0XHR0aGlzLnNldFZpc2liaWxpdHkoKTtcblx0XHR0aGlzLnNldEFyaWEoKTtcblx0XHR0aGlzLnJlbmRlckluY3JlbWVudGFsTmF2KCk7XG5cdFx0dGhpcy5iaW5kRXZlbnRzKHRoaXMuc2V0dGluZ3MubGlua0NsYXNzTmFtZSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0XHRcblx0fSxcblx0c2V0SW5pdGlhbFN0YXRlKCl7XG5cdFx0dGhpcy5saW5rcy5mb3JFYWNoKChsaW5rLCBpKSA9PiB7XG5cdFx0XHRpZihsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpLnN1YnN0cigxKSA9PT0gaGFzaCkge1xuXHRcdFx0XHR0aGlzLmN1cnJlbnRJbmRleCA9IGk7XG5cdFx0XHRcdHRoaXMuY3VycmVudFRpdGxlID0gbGluay5pbm5lclRleHQ7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0IXRoaXMuY3VycmVudFRpdGxlID8gdGhpcy5saW5rc1t0aGlzLmN1cnJlbnRJbmRleF0uaW5uZXJUZXh0IDogdGhpcy5jdXJyZW50VGl0bGU7XG5cdH0sXG5cdHNldFZpc2liaWxpdHkocHJldmlvdXNJbmRleCl7XG5cdFx0aWYocHJldmlvdXNJbmRleCAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHR0aGlzLmxpbmtzW3ByZXZpb3VzSW5kZXhdLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5zZXR0aW5ncy5hY3RpdmVDbGFzc05hbWUpO1xuXHRcdFx0dGhpcy5zZWN0aW9uc1twcmV2aW91c0luZGV4XS5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuc2V0dGluZ3MuYWN0aXZlQ2xhc3NOYW1lKTtcblx0XHR9XG5cdFx0dGhpcy5saW5rc1t0aGlzLmN1cnJlbnRJbmRleF0uY2xhc3NMaXN0LmFkZCh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzTmFtZSk7XG5cdFx0dGhpcy5zZWN0aW9uc1t0aGlzLmN1cnJlbnRJbmRleF0uY2xhc3NMaXN0LmFkZCh0aGlzLnNldHRpbmdzLmFjdGl2ZUNsYXNzTmFtZSk7XG5cdFx0XG5cdFx0d2luZG93LnNjcm9sbFRvKDAsMCk7XG5cdFx0d2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdFx0aWYoaGFzaCAmJiB3aW5kb3cubG9jYXRpb24uaGFzaCA9PT0gJycpICAoISF3aW5kb3cuaGlzdG9yeSAmJiAhIXdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgVVJMOiBgIyR7aGFzaH1gfSwgJycsIGAjJHtoYXNofWApO1xuXHRcdFx0d2luZG93LnNjcm9sbFRvKDAsMCk7XG5cdFx0fSwgMCk7XG5cdH0sXG5cdHNldEFyaWEoKXtcblx0XHRmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5saW5rcy5sZW5ndGg7IGkrKyl7XG5cdFx0XHR0aGlzLmxpbmtzW2ldLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRoaXMuY3VycmVudEluZGV4ID09PSBpKTtcblx0XHRcdHRoaXMubGlua3NbaV0uc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgdGhpcy5saW5rc1tpXS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKS5zdWJzdHIoMSkpO1xuXHRcdFx0dGhpcy5zZWN0aW9uc1tpXS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgISh0aGlzLmN1cnJlbnRJbmRleCA9PT0gaSkpO1xuXHRcdH1cblx0fSxcblx0cmVuZGVySW5jcmVtZW50YWxOYXYoKXtcblx0XHRsZXQgZ2V0TmF2RGF0YSA9IGkgPT4ge1xuXHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdGxpbms6IHRoaXMubGlua3NbaV0uZ2V0QXR0cmlidXRlKCdocmVmJyksXG5cdFx0XHRcdFx0bnVtOiBpICsgMSxcblx0XHRcdFx0XHR0aXRsZTogdGhpcy5saW5rc1tpXS5pbm5lclRleHRcblx0XHRcdFx0fTtcblx0XHRcdH07XG5cdFx0XHRcblx0XHR0aGlzLmluY3JlbWVudGFsTmF2SG9sZGVyLmlubmVySFRNTCA9IGAke3RoaXMuY3VycmVudEluZGV4ID4gMCA/IG5hdlByZXZpb3VzKGdldE5hdkRhdGEodGhpcy5jdXJyZW50SW5kZXggLSAxKSkgOiAnJ31cblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCR7dGhpcy5jdXJyZW50SW5kZXggIT09IHRoaXMubGlua3MubGVuZ3RoIC0gMSA/ICBuYXZOZXh0KGdldE5hdkRhdGEodGhpcy5jdXJyZW50SW5kZXggKyAxKSk6ICcnfWA7XG5cblx0XHR0aGlzLmJpbmRFdmVudHMoJy5qcy1ndWlkZV9faW5jcmVtZW50YWwtLXByZXZpb3VzLCAuanMtZ3VpZGVfX2luY3JlbWVudGFsLS1uZXh0Jyk7XG5cdH0sXG5cdGJpbmRFdmVudHMoc2VsKSB7XG5cdFx0W10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpLmZvckVhY2goYnRuID0+IHtcblx0XHRcdENPTlNUQU5UUy5UUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcblx0XHRcdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuXHRcdFx0XHRcdGlmKCEhZS5rZXlDb2RlICYmICF+Q09OU1RBTlRTLlRSSUdHRVJfS0VZQ09ERVMuaW5kZXhPZihlLmtleUNvZGUpKSByZXR1cm47XG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdHRoaXMuY2hhbmdlKGUudGFyZ2V0KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSxcblx0Y2hhbmdlKGxpbmspIHtcblx0XHRsZXQgcHJldmlvdXNJbmRleCA9IHRoaXMuY3VycmVudEluZGV4LFxuXHRcdFx0bmV4dFVybCA9IChsaW5rLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdocmVmJykgfHwgbGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSkuc3BsaXQoJyMnKVsxXSxcblx0XHRcdG5leHRJbmRleCA9IHRoaXMuZ2V0TmV4dEluZGV4KCcjJyArIG5leHRVcmwpO1xuXHRcdFxuXHRcdGlmKHByZXZpb3VzSW5kZXggPT09IG5leHRJbmRleCkgcmV0dXJuO1xuXHRcdFxuXHRcdHRoaXMuY3VycmVudEluZGV4ID0gbmV4dEluZGV4O1xuXHRcdHRoaXMuc2V0VmlzaWJpbGl0eShwcmV2aW91c0luZGV4KTtcblx0XHR0aGlzLnNldEFyaWEoKTtcblx0XHR0aGlzLnJlbmRlckluY3JlbWVudGFsTmF2KCk7XG5cblx0XHQoISF3aW5kb3cuaGlzdG9yeSAmJiAhIXdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgVVJMOiAnIycgKyBuZXh0VXJsIH0sICcnLCAnIycgKyBuZXh0VXJsKTtcblx0fSxcblx0Z2V0TmV4dEluZGV4KGhyZWYpe1xuXHRcdHJldHVybiB0aGlzLmxpbmtzLnJlZHVjZSgoYSwgbGluaywgaSkgPT4geyBpZihsaW5rLmdldEF0dHJpYnV0ZSgnaHJlZicpID09PSBocmVmKSBhLnB1c2goaSk7IHJldHVybiBhOyB9LCBbXSlbMF07XG5cdH1cbn07IiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIGxpbmtDbGFzc05hbWU6ICcuanMtZ3VpZGVfX2xpbmsnLFxuICAgIHNlY3Rpb25DbGFzc05hbWU6ICcuanMtZ3VpZGVfX3NlY3Rpb24nLFxuICAgIGluY3JlbWVudGFsTmF2SG9sZGVyOiAnLmpzLWd1aWRlX19pbmNyZW1lbnRhbCcsXG4gICAgYWN0aXZlQ2xhc3NOYW1lOiAnYWN0aXZlJ1xufTsiXX0=
