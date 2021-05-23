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
		
		/** The amount of cards to use as placeholder when the fetchCards function is loading */
		this.PLACEHOLDER_CARDS_NUMBER = 3;
		/** The amount of cards to request */
		this.DEFAULT_CHUNK_SIZE = 6;
		/** The amount of space to scroll when the scroll buttons are clicked */
		this.SCROLL_BUTTON_AMOUNT = 500;

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
				<div class='carousel-content'>
					<button data-direction="l">&lt;</button>
					<button data-direction="r">&gt;</button>
					<div class='carousel-card-container'>
						${cards.map(c => c.getHtml()).join('')}
					</div>
				</div>
			</div>
		`;

		this.addScrollActions();
	}

	/**
	 * This function updates the properties that refernce the HTML elements controlled by this class
	 * @returns {boolean} wheter all the objects were succesfully found
	 */
	retrieveEventTargets() {
		this.cardContainer = document.querySelector(this.config.container + ' .carousel-card-container');
		this.leftScrollButton = document.querySelector(this.config.container + ' .carousel-content > button:first-child')
		this.rightScrollButton = document.querySelector(this.config.container + ' .carousel-content > button:nth-child(2)')

		return Boolean(this.cardContainer && this.leftScrollButton && this.rightScrollButton);
	}

	/**
	 * Adds the actions to control the scrolling of the container through buttons
	 */
	addScrollActions() {
		if (!this.retrieveEventTargets())
			return;
		
		this.leftScrollButton.addEventListener('click', this.onScrollButtonClick);
		this.rightScrollButton.addEventListener('click', this.onScrollButtonClick);
		this.cardContainer.addEventListener('scroll', this.onCardContainerScroll);

		// update on startup the buttons
		this.updateButtonVisibility(this.cardContainer);
	}

	/**
	 * Callback called when the user presses right or left scroll button
	 * @param {Event} e
	 */
	onScrollButtonClick = (e) => {
		const direction = e.currentTarget.dataset.direction;

		this.cardContainer.scroll({
			behavior: 'smooth', 
			left: this.cardContainer.scrollLeft + (direction === 'r' 
				? this.SCROLL_BUTTON_AMOUNT 
				: -this.SCROLL_BUTTON_AMOUNT)
		});
	}

	/**
	 * Callback called when the card container is scrolled
	 * @param {Event} e
	 */
	onCardContainerScroll = (e) => {
		this.updateButtonVisibility(e.currentTarget);
	}

	/**
	 * Changes the scroll button visibility based on the scroll status of the container
	 * @param {HTMLElement} cardContainer The element that contains the cards and is scrollable
	 */
	updateButtonVisibility(cardContainer) {
		const isRightScrolled = cardContainer.offsetWidth + cardContainer.scrollLeft >= cardContainer.scrollWidth;
		const isLeftScrolled = cardContainer.scrollLeft === 0;

		Utils.toggleClass(this.rightScrollButton, 'hidden', isRightScrolled);
		Utils.toggleClass(this.leftScrollButton, 'hidden', isLeftScrolled);
	}

}
