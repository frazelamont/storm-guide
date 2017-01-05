import should from 'should';
import Guide from '../dist/storm-guide';
import 'jsdom-global/register';

const html = ``;

document.body.innerHTML = html;

/*
describe('Initialisation', () => {

	let ScrollToItem = ScrollTo.init('.js-scroll-to', {
		callback(){
			
		}
	});

	it('should return a scroll to object', () => {
		should(ScrollToItem)
		.Object();
	});
	
	it('should throw an error if no link elements are found', () => {
		ScrollTo.init.bind(ScrollTo, '.js-err').should.throw();
	});
	
	it('each array item should be an object with the correct properties', () => {
		ScrollToItem.should.have.property('DOMElements').Array();
		ScrollToItem.should.have.property('settings').Object();
		ScrollToItem.should.have.property('init').Function();
		ScrollToItem.should.have.property('initListeners').Function();
		ScrollToItem.should.have.property('initFocusable').Function();
		ScrollToItem.should.have.property('scrollTo').Function();
		ScrollToItem.should.have.property('destroy').Function();
	});
	
	it('should attach the handleClick eventListener to DOMElement click event to toggle className', () => {
		ScrollToItem.navItems[0].node.click();
		ScrollToItem.navItems[1].node.click();
		ScrollToItem.navItems[2].node.click();
	});

});

describe('Destroy', () => {

	let ScrollToItem = ScrollTo.init('.js-scroll-to', {
		focus: false
	});
	it('should remove the eventListeners from the nav items', () => {
		ScrollToItem.destroy();
	});
});
*/