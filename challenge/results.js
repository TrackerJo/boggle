const playerOne = document.querySelector('#playerOne');
const playerTwo = document.querySelector('#playerTwo');
const winner = document.querySelector('#winner');
//Get url params
const urlParams = new URLSearchParams(window.location.search);
const playerOneScore = parseInt(urlParams.get('score1'));
const playerTwoScore = parseInt(urlParams.get('score2'));

//Set player scores
playerOne.innerHTML += playerOneScore;
playerTwo.innerHTML += playerTwoScore;

//Set winner
if (playerOneScore > playerTwoScore) {
    winner.innerHTML += 'Player One';
}
else if (playerOneScore < playerTwoScore) {
    winner.innerHTML += 'Player Two';
}
else {
    winner.innerHTML += 'Draw';
}


