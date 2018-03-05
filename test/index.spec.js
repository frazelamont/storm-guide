import should from 'should';
import 'jsdom-global/register';
import Guide from '../dist/storm-guide.standalone';

// window.location = '';

const html = `<div class="guide js-guide">
		<ol class="guide-navigation">
			<li><a href="#section-1" class="js-guide__link guide__link">Section 1</a></li>
			<li><a href="#section-2" class="js-guide__link guide__link">Section 2</a></li>
			<li><a href="#section-3" class="js-guide__link guide__link">Section 3</a></li>
		</ol>
		<section id="section-1" class="tab js-guide__section guide__section">
			One
		</section>
		<section id="section-2"" class="tab js-guide__section guide__section">
			Two
		</section>
		<section id="section-3" class="tab js-guide__section guide__section">
			Three
		</section>
		<div class="js-guide__incremental page-navigation">
		</div>
	</div>`;

document.body.innerHTML = html;

describe('Initialisation', () => {
	let guide = Guide.init('.js-guide');

	it('should return an object', () => {
		should(guide)
		.Object();
	});
	
	it('should have the correct properties', () => {
		guide.should.have.property('links').Array();
		guide.should.have.property('sections').Array();
		guide.should.have.property('settings').Object();
		guide.should.have.property('init').Function();
		guide.should.have.property('setInitialState').Function();
		guide.should.have.property('setVisibility').Function();
		guide.should.have.property('setAria').Function();
		guide.should.have.property('renderIncrementalNav').Function();
		guide.should.have.property('bindEvents').Function();
		guide.should.have.property('change').Function();
		guide.should.have.property('getNextIndex').Function();
	});
	
	/*
	it('should attach the click eventListener to nav links to change currentIndex, currentTitle properties, and set active className on appropriate section', () => {
		ScrollToItem.navItems[0].node.click();
		ScrollToItem.navItems[1].node.click();
		ScrollToItem.navItems[2].node.click();
	});


	it('should attach the click eventListener to nav links to change currentIndex, currentTitle properties, and set active className on appropriate section', () => {
		ScrollToItem.navItems[0].node.click();
		ScrollToItem.navItems[1].node.click();
		ScrollToItem.navItems[2].node.click();
	});

	it('should attach the click eventListener to incremental menu to change currentIndex, currentTitle properties, and set active className on appropriate section', () => {
		ScrollToItem.navItems[0].node.click();
		ScrollToItem.navItems[1].node.click();
		ScrollToItem.navItems[2].node.click();
	});
	*/

});


describe('UI', () => {
	let guide = Guide.init('.js-guide');

	it('should attach the click eventListener to nav links to change currentIndex, currentTitle properties, and set active className on appropriate section', () => {
		guide.links[1].click();
		Array.from(guide.sections[1].classList).should.containEql('active');
		guide.currentIndex.should.equal(1);

		guide.links[1].click();
		Array.from(guide.sections[1].classList).should.containEql('active');
		guide.currentIndex.should.equal(1);
		//check currentIndex, currentTitle properties
	});

	it('should attach the keydown eventListener to nav links to change currentIndex, currentTitle properties, and set active className on appropriate section', () => {
		guide.links[1].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 32,
				keyCode: 32
			})
		);
		Array.from(guide.sections[1].classList).should.containEql('active');
		guide.currentIndex.should.equal(1);
		//check currentIndex, currentTitle properties

		guide.links[2].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 13,
				keyCode: 13
			})
		);
		Array.from(guide.sections[2].classList).should.containEql('active');
		guide.currentIndex.should.equal(2);
		//check currentIndex, currentTitle properties

		guide.links[2].dispatchEvent(
			new window.KeyboardEvent('keydown', { 
				code : 14,
				keyCode: 14
			})
		);
		Array.from(guide.sections[2].classList).should.containEql('active');
		guide.currentIndex.should.equal(2);
		
	});

	
	it('should attach the click eventListener to nav links to change currentIndex, currentTitle properties, and set active className on appropriate section', () => {
		//console.log(guide.currentIndex);
		//console.log(guide.incrementalNavHolder.lastElementChild.classList);

		//click event is triggerde in the Virtual DOM??
		guide.incrementalNavHolder.lastElementChild.click();

		//guide.currentIndex.should.equal(2);
	});
	
});

describe('Errors', () => {
	let html2 = `<div class="guide js-guide">
            <section id="section-1" class="tab js-guide__section guide__section">
                One
            </section>
            <section id="section-2"" class="tab js-guide__section guide__section">
                Two
            </section>
            <section id="section-3" class="tab js-guide__section guide__section">
                Three
            </section>
            <div class="js-guide__incremental page-navigation">
            </div>
        </div>`;

	document.body.innerHTML = html2;

	it('should throw an error if no links, sections, or incremental nav are found', () => {
		Guide.init.bind().should.throw();
	});

});