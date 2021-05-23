class CarouselCard {

	/**
	 * @param {{
	 * 	cardinality: "single" | "collection" | "placeholder",
	 * 	duration: number,
	 * 	image: string,
	 * 	title: string,
	 * 	type: string,
	 * }} config the configuration of this card
	 */
	constructor(config) {
		this.config = config;
	}

	getHtml() {
		
		/** @type CarouselCard['config'] */
		const c = this.config || {};

		// return the placeholder version
		if (c.cardinality === 'placeholder')
			return `
				<div class='card-container'>
					<div class='card card-type-${c.cardinality}'>
						<div class='img-container'></div>
						<div class='card-text'>
							<div></div>
							<div></div>
						</div>
					</div>
				</div>
				`;

		return `
			<div class='card-container'>
				${c.cardinality !== 'collection' ? '' : `
					<div class='card card-collection-stack'></div>
					<div class='card card-collection-stack'></div>
				`}
				<div class='card card-type-${c.cardinality}'>
					<div class='img-container'>
						<img src='${c.image}'/>
						<div class='img-text'>
							<span>${c.type}</span>
							${typeof c.duration === 'undefined' ? '' : `
								<span>${this.convertSecondsToHumanString(c.duration)}</span>
							`}
						</div>
					</div>
					<div class='card-text'>
						<h3>${c.title}</h3>
					</div>
				</div>
			</div>
		`;
	}

	/**
	 * converts the number of seconds to a format usable in the card
	 * @param {number} sec the seconds to convert
	 */
	convertSecondsToHumanString(sec) {
		// more than an hour
		if (sec >= 3600) {
			const h = Math.floor(sec / 3600);
			const m = Math.floor(sec % 3600 / 60);
			return h + 'h ' + m + 'm';
		}
		else {
			const m = Math.floor(sec / 60);
			const s = sec % 60;
			return m + ':' + s;
		}
	}

}