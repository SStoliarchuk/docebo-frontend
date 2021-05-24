const Utils = require('../utils.js');

describe('Utils', () => {

	describe('toggles classes in a DOM element', () => {
	
		const fn = Utils.toggleClass;

		it('adds class if not prsent only once', () => {
			const el = document.createElement('div');
			expect(el.className).toEqual('');
			
			fn(el, 'asd', true);
			expect(el.className).toEqual('asd');

			fn(el, 'asd', true);
			fn(el, 'asd', true);
			expect(el.className).toEqual('asd');
		});

		it('removes a class even if it is specified multiple times', () => {
			const el = document.createElement('div');
			el.className = 'a a a a';
			expect(el.className).toEqual('a a a a');

			fn(el, 'a', false);
			expect(el.className).toEqual('');
		});

		it('toggles the current class presence if a desired state is not specified', () => {
			const el = document.createElement('div');
			expect(el.className).toEqual('');
			fn(el, 'a');
			expect(el.className).toEqual('a');

			fn(el, 'a');
			expect(el.className).toEqual('');
		});

	});

});
