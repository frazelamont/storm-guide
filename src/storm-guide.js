const defaults = {
		linkClassName: '.js-guide__link',
		sectionClassName: '.js-guide__section',
		incrementalNavHolder: '.js-guide__incremental',
		activeClassName: 'active'
	},
	hash = location.hash.slice(1) || null,
	templates = {
		previousNav: ['<a href="{{link}}" rel="previous" class="js-guide__incremental--previous nav-incremental-link page-navigation__prev">',
						'<div class="nav-incremental__part">Part {{num}}</div>',
						'<div class="nav-incremental__title">{{title}}</div>',
						'</div>'].join(''),
		nextNav: ['<a href="{{link}}" rel="next" class="js-guide__incremental--previous nav-incremental-link page-navigation__prev">',
						'<div class="nav-incremental__part">Part {{num}}</div>',
						'<div class="nav-incremental__title">{{title}}</div>',
						'</div>'].join('')
	},
	render = function(template, data){
		for(var k in data){
			if(data.hasOwnProperty(k)){
				template = template.split('{{' + k + '}}').join(data[k]);
			}
		}
		return template;
	};

const StormGuide = {
	init(){
		if(hash) window.location.hash = '';

		this.links = [].slice.call(document.querySelectorAll(this.settings.linkClassName)) || null;
		this.sections = [].slice.call(document.querySelectorAll(this.settings.sectionClassName));
		this.incrementalNavHolder = document.querySelector(this.settings.incrementalNavHolder) || null;
		this.currentIndex = 0;
		this.currentTitle = '';

		if(!this.links || !this.sections || !this.incrementalNavHolder) throw new Error('Guide could not be initialised, ');
		
		this.setInitialState();
		this.setVisibility();
		this.setAria();
		this.renderIncrementalNav();
		this.bindEvents('.js-guide__link');

		return this;
		
	},
	setInitialState(){
		this.links.forEach((link, i) => {
			if(link.getAttribute('href').substr(1) === hash) {
				this.currentIndex = i;
				this.currentTitle = link.innerText;
			}
		});
		!this.currentTitle ? this.links[this.currentIndex].innerText : this.currentTitle;
	},
	setVisibility(previousIndex){
		if(previousIndex !== undefined) {
			this.links[previousIndex].classList.remove(this.settings.activeClassName);
			this.sections[previousIndex].classList.remove(this.settings.activeClassName);
		}
		this.links[this.currentIndex].classList.add(this.settings.activeClassName);
		this.sections[this.currentIndex].classList.add(this.settings.activeClassName);
		
		window.scrollTo(0,0);
		window.setTimeout(() => {
			if(hash && window.location.hash === '')  (!!window.history && !!window.history.pushState) && window.history.pushState({ URL: `#${hash}`}, '', `#${hash}`);
			window.scrollTo(0,0);
		}, 0);
	},
	setAria(){
		for(let i = 0; i < this.links.length; i++){
			this.links[i].setAttribute('aria-selected', this.currentIndex === i);
			this.links[i].setAttribute('aria-controls', this.links[i].getAttribute('href').substr(1));
			this.sections[i].setAttribute('aria-hidden', !(this.currentIndex === i));
		}
	},
	renderIncrementalNav(){
		var incrementalNav = '',
			getNavData = i => {
				return {
					link: this.links[i].href,
					num: i + 1,
					title: this.links[i].innerText
				};
			};
		
		if(this.currentIndex > 0) incrementalNav = render(templates.previousNav, getNavData(this.currentIndex - 1));
		
		if(this.currentIndex !== this.links.length - 1) incrementalNav += render(templates.nextNav, getNavData(this.currentIndex + 1));
		
		this.incrementalNavHolder.innerHTML = incrementalNav;
		this.bindEvents('.js-guide__incremental--previous, .js-guide__incremental--next');
	},
	bindEvents(sel) {
		[].slice.call(document.querySelectorAll(sel)).forEach(btn => {
			btn.addEventListener('click', this.change.bind(this));
		});
	},
	change(e) {
		e.preventDefault();
		let previousIndex = this.currentIndex,
			nextUrl = (e.target.parentNode.getAttribute('href') || e.target.getAttribute('href')).split('#')[1],
			nextIndex = this.getNextIndex('#' + nextUrl);
		
		if(previousIndex === nextIndex) return;
		
		this.currentIndex = nextIndex;
		this.setVisibility(previousIndex);
		this.setAria();
		this.renderIncrementalNav();

		(!!window.history && !!window.history.pushState) && window.history.pushState({ URL: '#' + nextUrl }, '', '#' + nextUrl);
	},
	getNextIndex(href){
		return this.links.reduce((a, link, i) => { if(link.getAttribute('href') === href) a.push(i); return a; }, [])[0];
	}
};

const init = opts => {
	return Object.assign(Object.create(StormGuide), {
		settings: Object.assign({}, defaults, opts)
	}).init();
};

export default { init };