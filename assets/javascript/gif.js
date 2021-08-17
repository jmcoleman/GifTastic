////////////////
// Load topics
////////////////
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
topics = topics.map((topic) => topic.toLowerCase())

/////////////////////////
// load variables
/////////////////////////
const GIPHY_ITEM_LIMIT = 10
const GIPHY_API_KEY = 'qE5VEI7m7vEyr5u78viHHZEPaPRIkgo8'

const topicSectionEl = document.getElementById('topic-section')
const topicListEl = document.getElementById('topic-list')
const topicInputEl = document.getElementById('topic-input')
const gifsEl = document.getElementById('gifs')

/////////////////
// functions
/////////////////
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

	// create the topic element
	const newBtn = document.createElement('button')
	newBtn.setAttribute('id', `topic-${item}`)
	newBtn.setAttribute('data-topic', `${item}`)
	newBtn.classList.add('search-button', 'btn', 'btn-primary', 'btn-md', 'm-2')
	newBtn.textContent = properCaseItem

	// attach the new element to the DOM
	parentEl.append(newBtn)
}

// construct the gif card
function constructCard(resultItem) {
	// create the card element
	const cardDiv = document.createElement('div')
	cardDiv.classList.add('card')

	// create the image element
	const gifImageElem = document.createElement('img')
	gifImageElem.setAttribute('src', resultItem.images.fixed_height_still.url)
	if (!isEmpty(resultItem.images.title)) {
		gifImageElem.setAttribute('alt', resultItem.images.title.trim())
	} else {
		gifImageElem.setAttribute('alt', 'GIF image')
	}
	gifImageElem.setAttribute(
		'data-static',
		resultItem.images.fixed_height_still.url
	)
	gifImageElem.setAttribute('data-animated', resultItem.images.fixed_height.url)
	gifImageElem.classList.add('card-img-top', 'animate')

	// create the card body
	const cardBodyDiv = document.createElement('div')
	cardBodyDiv.classList.add('card-body')

	// create the title
	const titleElem = document.createElement('h5')
	if (!isEmpty(resultItem.title)) {
		titleElem.textContent = ProperCase(resultItem.title.trim())
	} else {
		titleElem.textContent = 'NONE'
	}

	// create the rating
	const ratingElem = document.createElement('p')
	ratingElem.classList.add('mb-0')
	if (!isEmpty(resultItem.rating)) {
		ratingElem.textContent = 'Rated ' + resultItem.rating.trim().toUpperCase()
	} else {
		ratingElem.textContent = 'Not Rated'
	}

	// assemble the card
	cardBodyDiv.append(titleElem)
	cardBodyDiv.append(ratingElem)
	cardDiv.append(gifImageElem)
	cardDiv.append(cardBodyDiv)

	return cardDiv
}

/////////////////////////////
// Event Handler functions
////////////////////////////
function addTopicHandler(e) {
	const inputEl = document.getElementById('topic-input')
	const inputData = inputEl.value.trim()
	const lowerCaseInputData = inputData.toLowerCase()
	const messageEl = document.getElementById('message')

	// if a value is given
	if (!isEmpty(inputData)) {
		// if topic is not already in the list, add it
		if (topics.indexOf(lowerCaseInputData) === -1) {
			topics.push(lowerCaseInputData)
			messageEl.textContent = ''
			addTopicButton(lowerCaseInputData)
		} else {
			//show message for 3 seconds
			messageEl.textContent = `${inputData} exists and was not added.`
			setTimeout(function () {
				messageEl.textContent = ''
			}, 3000)
		}

		inputEl.value = ''
		inputEl.focus()

		const searchTopicEl = document.getElementById(`topic-${lowerCaseInputData}`)
		searchTopicEl.click()
	}
	e.preventDefault()
}

function topicShowCollapseHandler(e) {
	const collapsibleChevron = document.getElementById('collapsed-chevron')
	collapsibleChevron.classList.toggle('fa-rotate-180')
}

async function searchGifsHandler(e) {
	// prevent the page from reloading
	e.preventDefault()

	const gifsEl = document.getElementById('gifs')
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
	const uri = encodeURI(queryURL)

	// fetch giphy data
	await fetch(uri)
		.then((response) => response.json())
		.then((json) => {
			const results = json.data
			// console.log('Data:', results)

			if (document.getElementById('clear-results').checked) {
				// clear current results
				gifsEl.replaceChildren()
			}

			// add the elements to the DOM
			for (let i = 0; i < results.length; i++) {
				let cardDiv = constructCard(results[i])
				gifsEl.prepend(cardDiv)
			}
			topicInputEl.focus()
		})
}

function animateGifHandler(e) {
	e.preventDefault()

	console.log('FIRED the event listener for: gifsEl click')
	console.log('this: ', this)
	console.log('e.target: ', e.target)

	const currentSrc = e.target.getAttribute('src')
	const staticGIF = e.target.getAttribute('data-static')
	const animatedGIF = e.target.getAttribute('data-animated')

	e.target.setAttribute(
		'src',
		currentSrc === staticGIF ? animatedGIF : staticGIF
	)
}

///////////////////////////
// Add Event Listeners
///////////////////////////
function addGlobalEventListener(type, selector, callback) {
	document.addEventListener(
		type,
		(e) => {
			if (e.target.matches(selector)) callback(e)
		},
		false
	)
}

addGlobalEventListener('click', '#topic-section', topicShowCollapseHandler)
addGlobalEventListener('click', '#add-topic', addTopicHandler)
addGlobalEventListener('click', '.search-button.btn', searchGifsHandler)
addGlobalEventListener('click', '.animate', animateGifHandler)

// Start app up
loadTopics()
