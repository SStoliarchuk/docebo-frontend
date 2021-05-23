class Utils {

	/**
	 * Controls the class of an element
	 * @param {HTMLElement} target The target of which to change the class status
	 * @param {string} className the class name to control
	 * @param {string} status if the class should be present or no. if not passed it will invert the current status
	 */
	static toggleClass(target, className, status) {
		// ensure is not null
		if (!target) return;

		// ensure we have a desired status
		if (typeof status === 'undefined')
			status = !Boolean(target.classList.contains(className));

		if (status)
			target.classList.add(className)
		else 
			target.classList.remove(className)
			
	}


}