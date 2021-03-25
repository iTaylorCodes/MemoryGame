const gameContainer = document.getElementById('game');
const startButton = document.getElementById('start');
const scoreBoard = document.getElementById('score');
const lowScore = document.getElementById('lowscore');
const rainbows = document.querySelectorAll('.colors');
let currentFlipped = 0;
let score = 0;

// Sets the Best Score element if previous score in localStorage
lowscore.innerText = localStorage.lowscore;

// Sets which colors to use for each game
function colorCreator() {
	let colorArray = [];
	for (let i = 16 / 2; i > 0; i--) {
		colorArray.push(randomRGB());
	}
	return colorArray.concat(colorArray);
}

// Selects any color
function randomRGB() {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);
	return `rgb(${r},${g},${b})`;
}

// Makes the word COLOR change colors
setInterval(function () {
	for (let rain of rainbows) {
		rain.style.color = randomRGB();
	}
}, 1000);

// Shuffles Gameboard
function shuffle() {
	let array = colorCreator();
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

// Creates Gameboard
function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement('div');

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener('click', handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

// Let's you pick cards
function handleCardClick(event) {
	let card = event.target;
	if (card.classList.contains('flipped') || card.classList.contains('done')) {
		return;
	} else if (currentFlipped < 2) {
		card.classList.add('flipped');
		card.style.backgroundColor = card.classList[0];
		score += 1;
		scoreBoard.innerText = score;
		currentFlipped += 1;
		matchCheck();
	}

	if (document.getElementsByClassName('done').length == 16) {
		if (localStorage.lowscore) {
			localStorage.lowscore = score < localStorage.lowscore ? score : localStorage.lowscore;
		} else {
			localStorage.lowscore = score;
		}
		lowscore.innerText = localStorage.lowscore;
	}
}

// Checks if your cards are a match
function matchCheck() {
	if (currentFlipped == 2) {
		let flipped = document.getElementsByClassName('flipped');
		if (flipped[0].classList[0] == flipped[1].classList[0]) {
			while (flipped.length > 0) {
				flipped[0].classList.toggle('done');
				flipped[0].classList.toggle('flipped');
			}
			currentFlipped = 0;
		} else {
			setTimeout(() => {
				while (flipped.length > 0) {
					flipped[0].style.backgroundColor = '#acaaaa';
					flipped[0].classList.toggle('flipped');
				}
				currentFlipped = 0;
			}, 1000);
		}
	}
}

// when the DOM loads
startButton.addEventListener('click', (e) => {
	gameContainer.innerHTML = '';
	let shuffledColors = shuffle();
	createDivsForColors(shuffledColors);
	score = 0;
	currentFlipped = 0;
	scoreBoard.innerText = score;
});
