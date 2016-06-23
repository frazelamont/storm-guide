/**
 * @name storm-guide: GDS Guide page-like implementation
 * @version 0.1.0: Thu, 23 Jun 2016 12:28:40 GMT
 * @author stormid
 * @license MIT
 */(function(root, factory) {
if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.StormGeocoder = factory();
  }
}(this, function() {
    'use strict';

     var defaults = {
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
            var r = template;

            for(var k in data){
                if(data.hasOwnProperty(k)){
                    template = template.split('{{' + k + '}}').join(data[k]);
                }
            }
            return template;
        },
        StormGuide = {
            init: function(){
                this.links = [].slice.call(document.querySelectorAll(this.settings.linkClassName)) || null;
                this.sections = [].slice.call(document.querySelectorAll(this.settings.sectionClassName));
                this.incrementalNavHolder = document.querySelector(this.settings.incrementalNavHolder) || null;
                this.currentIndex = 0;
                this.currentTitle = '';

                if(!this.links || !this.sections || !this.incrementalNavHolder) {
                    throw new Error('Guide could not be initialised, ');
                }
                this.setInitialState();
                this.setVisibility();
                this.setAria();
                this.renderIncrementalNav();
                
            },
            setInitialState: function(){
                this.links.forEach(function(link, i){
                    if(link.getAttribute('href').substr(1) === hash) {
                        this.currentIndex = i;
                        this.currentTitle = link.innerText;
                    }
                }.bind(this));
                !this.currentTitle ? this.links[this.currentIndex].innerText : this.currentTitle;
            },
            setVisibility: function(previousIndex){
                if(previousIndex !== undefined) {
                    this.links[previousIndex].classList.remove(this.settings.activeClassName);
                    this.sections[previousIndex].classList.remove(this.settings.activeClassName);
                }
                this.links[this.currentIndex].classList.add(this.settings.activeClassName);
                this.sections[this.currentIndex].classList.add(this.settings.activeClassName);
                window.setTimeout(function(){window.scrollTo(0,0);}, 0);
            },
            setAria: function(){
                this.links.forEach(function(link, i) {
                    STORM.UTILS.attributelist.set(link, {
                        'aria-selected': this.currentIndex === i,
                        'aria-controls': link.getAttribute('href').substr(1)
                    });
                }.bind(this));
                
                this.sections.forEach(function(section, i) {
                    STORM.UTILS.attributelist.set(section, {
                        'aria-hidden': !(this.currentIndex === i)
                    });
                }.bind(this));
            },
            renderIncrementalNav: function(){
                var incrementalNav = '',
                    getNavData = function(i) {
                        return {
                            link: this.links[i].href,
                            num: i + 1,
                            title: this.links[i].innerText
                        };
                    }.bind(this);
                
                if(this.currentIndex > 0) {
                    incrementalNav = render(templates.previousNav, getNavData(this.currentIndex - 1));
                }
                if(this.currentIndex !== this.links.length - 1) {
                    incrementalNav += render(templates.nextNav, getNavData(this.currentIndex + 1));

                }
                this.incrementalNavHolder.innerHTML = incrementalNav;
                this.bindEvents();
            },
            bindEvents: function() {
                [].slice.call(document.querySelectorAll('.js-guide__incremental--previous, .js-guide__incremental--next, .js-guide__link')).forEach(function(btn){
                    btn.addEventListener('click', this.change.bind(this));
                }.bind(this));
            },
            change: function(e) {
                e.preventDefault();
                var previousIndex = this.currentIndex,
                    nextUrl = (e.target.parentNode.getAttribute('href') || e.target.getAttribute('href')).split('#')[1],
                    nextIndex = this.getNextIndex('#' + nextUrl);
                
                if(previousIndex === nextIndex) { return; }
                
                this.currentIndex = nextIndex;
                this.setVisibility(previousIndex);
                this.setAria();
                this.renderIncrementalNav();

                //window.location.hash = `#${(e.target.parentNode.getAttribute('href') || e.target.getAttribute('href')).split('#')[1]}`;
                window.history.pushState({ URL: '#' + nextUrl }, '', '#' + nextUrl);
            },
            getNextIndex: function(href){
                var index = null;
                this.links.forEach(function(link, i) {
                    if(link.getAttribute('href') === href) {
                        index = i;
                    }
                });
                return index;
            }
        };
	
	function init(opts) {
        return Object.assign(Object.create(StormGuide), {
            settings: Object.assign({}, defaults, opts)
        }).init();
        
    }

    return { init: init };

 }));