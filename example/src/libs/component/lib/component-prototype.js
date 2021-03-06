const CONSTANTS = {
		TRIGGER_EVENTS: ['click', 'keydown'],
		TRIGGER_KEYCODES: [13, 32]
	},
	hash = (window.location && window.location.hash.slice(1)) || null;
	
const navNext = data => `<a href="${data.link}" rel="next" class="js-guide__incremental--next guide__incremental--next">
                                <div class="guide__incremental-part">
                                    Part ${data.num}
                                </div>
                                <div class="guide__incremental-title">${data.title}</div>
                            </a>`;

const navPrevious = data => `<a href="${data.link}" rel="previous" class="js-guide__incremental--previous guide__incremental--previous">
                                <div class="guide__incremental-part">
                                    Part ${data.num}
                                </div>
                                <div class="guide__incremental-title">${data.title}</div>
                            </a>`;

export default {
	init(){
		if(window.location) window.location.hash = '';

		this.links = [].slice.call(document.querySelectorAll(this.settings.linkClassName)) || null;
		this.sections = [].slice.call(document.querySelectorAll(this.settings.sectionClassName));
		this.incrementalNavHolder = document.querySelector(this.settings.incrementalNavHolder) || null;
		this.currentIndex = 0;
		this.currentTitle = '';

		if(!this.links.length || !this.sections.length || !this.incrementalNavHolder) throw new Error('Guide could not be initialised, ');
		
		this.setInitialState();
		this.setVisibility();
		this.setAria();
		this.renderIncrementalNav();
		this.bindEvents(this.settings.linkClassName);

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
		let getNavData = i => {
				return {
					link: this.links[i].getAttribute('href'),
					num: i + 1,
					title: this.links[i].innerText
				};
			};
			
		this.incrementalNavHolder.innerHTML = `${this.currentIndex > 0 ? navPrevious(getNavData(this.currentIndex - 1)) : ''}
												${this.currentIndex !== this.links.length - 1 ?  navNext(getNavData(this.currentIndex + 1)): ''}`;

		this.bindEvents('.js-guide__incremental--previous, .js-guide__incremental--next');
	},
	bindEvents(sel) {
		[].slice.call(document.querySelectorAll(sel)).forEach(btn => {
			CONSTANTS.TRIGGER_EVENTS.forEach(ev => {
				btn.addEventListener(ev, e => {
					if(!!e.keyCode && !~CONSTANTS.TRIGGER_KEYCODES.indexOf(e.keyCode)) return;
					e.preventDefault();
					this.change(e.target);
				});
			});
		});
	},
	change(link) {
		let previousIndex = this.currentIndex,
			nextUrl = (link.parentNode.getAttribute('href') || link.getAttribute('href')).split('#')[1],
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