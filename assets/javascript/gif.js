let topics = [
	'clapping',
	'LOL',
	'The Incredibles',
	'cat',
	'Bob Ross',
	'summer',
	'minions',
	'Nike',
	'holiday',
	'mountains',
	'beaches',
	'hiking',
	'sking',
	'play',
	'sleep',
	'movies',
	'Yoda',
	'The Office',
	'Parks and Rec',
	'college football',
	'celebration',
	'Happy Dance',
	'Favorites',
]
let favoriteGIFs = []

topics = topics.map((topic) => topic.toLowerCase())

const GIPHY_ITEM_LIMIT = 10
const GIPHY_API_KEY = 'qE5VEI7m7vEyr5u78viHHZEPaPRIkgo8'

const topicSectionEl = document.getElementById('topic-section')
const topicListEl = document.getElementById('topic-list')
const addTopicEl = document.getElementById('add-topic')
const gifsEl = document.getElementById('gifs')

function isEmpty(val) {
	return val === undefined || val == null || val.length <= 0 ? true : false
}

// Capitalize the first letter of every word
function ProperCase(txt) {
	return txt.replace(
		/\w\S*/g,
		(c) => c.charAt(0).toUpperCase() + c.substr(1).toLowerCase()
	)
}

// load the topics from memory
function loadTopics() {
	topics.sort(function (a, b) {
		return a.toLowerCase().localeCompare(b.toLowerCase())
	})

	// add a button for each element in the array
	topics.forEach((element) => {
		addTopicButton(element)
	})
}

// add a topic button element
function addTopicButton(item) {
	const parentEl = document.getElementById('topic-list')

	const properCaseItem = ProperCase(item)

	const newBtn = document.createElement('button')
	newBtn.setAttribute('id', `topic-${item}`)
	newBtn.setAttribute('data-topic', `${item}`)
	newBtn.classList.add('search-button', 'btn', 'btn-primary', 'btn-md', 'm-2')
	newBtn.textContent = properCaseItem

	parentEl.append(newBtn)
}

// handle show/collapse of topics
topicSectionEl.addEventListener(
	'click',
	function (e) {
		const collapsibleChevron = document.getElementById('collapsed-chevron')
		collapsibleChevron.classList.toggle('fa-rotate-180')
	},
	false
)
// add a new topic and capture click event for it
addTopicEl.addEventListener(
	'click',
	function (e) {
		const inputEl = document.getElementById('topic-input')
		const inputData = inputEl.value.trim()
		const lowerCaseInputData = inputData.toLowerCase()

		const topicListEl = document.getElementById('topic-list')
		const messageEl = document.getElementById('message')

		// console.log('Input data: ', lowerCaseInputData)
		// console.log('Topic data: ', topics)

		// if a value is given
		if (!isEmpty(inputData)) {
			// if topic is not already in the list
			if (topics.indexOf(lowerCaseInputData) === -1) {
				topics.push(lowerCaseInputData)
				messageEl.textContent = ''

				// empty all the topics and reload
				// topicListEl.replaceChildren()
				// createTopicButtons()

				addTopicButton(lowerCaseInputData)
			} else {
				//show for 3 seconds
				messageEl.textContent = `${inputData} exists and was not added.`
				setTimeout(function () {
					messageEl.textContent = ''
				}, 3000)
			}

			inputEl.value = ''

			const searchTopicEl = document.getElementById(
				`topic-${lowerCaseInputData}`
			)
			// console.log('Search topic selected: ', searchTopicEl)
			searchTopicEl.click()
		}
		e.preventDefault()
	},
	false
)

topicListEl.addEventListener(
	'click',
	async function (e) {
		// prevent the page from reloading
		e.preventDefault()

		const messageEl = document.getElementById('message')
		const gifsEl = document.getElementById('gifs')

		// if (this.id === gifsEl.id) {
		// clear any messages that remain from adding duplicate topics
		// messageEl.textContent = ''

		// console.log('e: ', e.target)
		const topic = e.target.dataset.topic

		// set up query string
		const queryURL =
			'https://api.giphy.com/v1/gifs/search?' +
			'q=' +
			topic +
			'&api_key=' +
			GIPHY_API_KEY +
			'&limit=' +
			GIPHY_ITEM_LIMIT
		// console.log(queryURL)

		const uri = encodeURI(queryURL)
		// console.log(uri)

		await fetch(uri)
			.then((response) => response.json())
			.then((json) => {
				// data returned from Giphy
				const results = json.data
				console.log('Data:', results)

				// clear current results
				if (document.getElementById('clear-results').checked) {
					gifsEl.replaceChildren()
				}

				for (let i = 0; i < results.length; i++) {
					// construct the HTML that will be added
					const cardDiv = document.createElement('div')
					cardDiv.classList.add('card')

					const gifImageElem = document.createElement('img')
					gifImageElem.setAttribute(
						'src',
						results[i].images.fixed_height_still.url
					)

					if (!isEmpty(results[i].images.title)) {
						gifImageElem.setAttribute('alt', results[i].images.title.trim())
					} else {
						gifImageElem.setAttribute('alt', 'GIF image')
					}

					gifImageElem.setAttribute(
						'data-static',
						results[i].images.fixed_height_still.url
					)
					gifImageElem.setAttribute(
						'data-animated',
						results[i].images.fixed_height.url
					)
					gifImageElem.classList.add('card-img-top', 'animate')

					const cardBodyDiv = document.createElement('div')
					cardBodyDiv.classList.add('card-body')

					const titleElem = document.createElement('h5')

					if (!isEmpty(results[i].title)) {
						titleElem.textContent = ProperCase(results[i].title.trim())
					} else {
						titleElem.textContent = 'NONE'
					}

					const ratingElem = document.createElement('p')
					ratingElem.classList.add('mb-0')

					if (!isEmpty(results[i].rating)) {
						ratingElem.textContent =
							'Rated ' + results[i].rating.trim().toUpperCase()
					} else {
						ratingElem.textContent = 'Not Rated'
					}

					cardBodyDiv.append(titleElem)
					cardBodyDiv.append(ratingElem)
					cardDiv.append(gifImageElem)
					cardDiv.append(cardBodyDiv)

					// add the elements to the DOM
					gifsEl.prepend(cardDiv)

					console.log(gifsEl)
				}
			})

		// console.log('SET THE FOCUS')
		// addTopicEl.focus()
		// }
	},
	false
)

gifsEl.addEventListener(
	'click',
	function (e) {
		// prevent the page from reloading
		e.preventDefault()

		console.log('FIRED the event listener for: gifsEl click')
		console.log('this: ', this)
		console.log('e.target: ', e.target)

		const currentSrc = e.target.getAttribute('src')
		const staticGIF = e.target.getAttribute('data-static')
		const animatedGIF = e.target.getAttribute('data-animated')

		this.setAttribute(
			'src',
			// currentSrc === animatedGIF ? staticGIF : animatedGIF
			currentSrc === staticGIF ? animatedGIF : staticGIF
		)
	},
	false
)

loadTopics()
