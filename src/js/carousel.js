class Carousel {
	
	/**
	 * @param {{
	 * 	container: string,
	 * 	title: string,
	 * 	subtitle: string,
	 * 	fetchCards: (chunkSize: number) => (CarouselCard[]) | (Promise<CarouselCard[]>)
	 * }} config
	 */
	constructor(config) {
		
		/**
		 * The amount of cards to use as placeholder when the fetchCards function is loading
		 */
		this.PLACEHOLDER_CARDS_NUMBER = 3;

		/**
		 * The amount of cards to request
		 */
		this.DEFAULT_CHUNK_SIZE = 6;

		// TODO add support for generic query selector instead of only id selector
		config.container = '#' + config.container;
		this.config = config;

		this.createCarouselComponent();
	}

	/**
	 * Creates the HTML and sets it as the content of the container given
	 */
	async createCarouselComponent() {
		let fetchedCards = this.config.fetchCards(this.DEFAULT_CHUNK_SIZE);

		// if we receive a promise, we add a placeholder while waiting the promise to resolve
		if (fetchedCards instanceof Promise) {
			this.setHtml(new Array(this.DEFAULT_CHUNK_SIZE).fill(new CarouselCard({cardinality: 'placeholder'})));
			fetchedCards = await fetchedCards;
		}

		// the replace the cards with the resolved promise
		this.setHtml(fetchedCards.map(c => new CarouselCard(c)));
	}

	/**
	 * Replaces the innerHTML of the container with the cards given
	 * @param {CarouselCard[]} cards the cards to show
	 */
	setHtml(cards) {
		const el = document.querySelector(this.config.container);
		if (!el) return;

		el.innerHTML = `
			<div class='carousel-container'>
				<div class='carousel-title'>
					{ICON}
					<div>
						<h3>${this.config.title}</h3>
						<span>${this.config.subtitle}</span>
					</div>
				</div>
				<div class='carousel-card-container'>
					${cards.map(c => c.getHtml()).join('')}
				</div>
			</div>
		`;
	}
	
}
