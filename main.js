
import wordlistURL from './wordlist.txt';


const submitBtn = document.getElementById('submit-word');
const boggleDiv = document.getElementById('board-div');
const startBtn = document.getElementById('start-btn');
const customGameBtn = document.getElementById('custom-game-btn');
const customGamePrompt = document.getElementById('custom-game-prompt');
const customGameSeedInput = document.getElementById('custom-board');
const customGameTimeInput = document.getElementById('custom-time');
const customGameMinLengthInput = document.getElementById('custom-min-length');
const customGameStartBtn = document.getElementById('custom-game-start-btn');
const wordListDiv = document.getElementById('word-list');
const scoreLabel = document.getElementById('score');
const timeLabel = document.getElementById('time');
const gameOverDiv = document.getElementById('game-over');
const playAgainBtn = document.getElementById('play-again-btn');
const shareBtn = document.getElementById('share-btn');


let startTime = 100;
let minLength = 3;
let selectedLetters = "";
let selectedCells = [];
let pastCells = [];
let score = 0;
let doneWords = [];
let boardCells = [];
let customGamePromptOpen = false;
let isCustomGame = false;

const scoring = {
  2: 50,
  3: 100,
  4: 400,
  5: 800,
  6: 1400,
  7: 1800,
  8: 2200
}
let isSelectingWord = false;
let eventStartType = 'mousedown';
let eventMouseOver = 'mouseover';
let isMobile = false;

//Check if touch screen
if ('ontouchstart' in window) {
  isMobile = true;
  eventStartType = 'touchmove';
  eventMouseOver = 'click';
  submitBtn.classList.remove('hidden');
  
}

function generateRandomBoggleBoard() {
  const board = [];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 4; i++) {
    const row = [];
    for (let j = 0; j < 4; j++) {
      row.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    board.push(row);
  }
  return board;
 
}

function printBoard(board) {
  for (let i = 0; i < board.length; i++) {
    console.log(board[i].join(' | '));
  }
}

function fillTableWithBoard(board) {
  const table = document.getElementById('boggle-board');
  for (let i = 0; i < board.length; i++) {
    const row = table.insertRow();
    //row.classList.add('cell');
    for (let j = 0; j < board[i].length; j++) {
      const cell = row.insertCell();
      cell.innerHTML = board[i][j];
      cell.setAttribute('data-row', i);
      cell.setAttribute('data-col', j);
      cell.classList.add('cell');
      boardCells.push(cell);
      //Add click event listener to each cell
      cell.addEventListener(eventMouseOver, function(e) {
        if(!isSelectingWord && !isMobile) {
          console.log('Not selecting word');
          return;
        }
        //Check if the cell is already highlighted
        mouseOverCell(e);
      });
      
    }
  }
}

let board = null;
//Check if using custom board
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('boardSeed')) {
  const boardSeed = urlParams.get('boardSeed');
   board = loadBoard(boardSeed);
}
else {
  board = generateRandomBoggleBoard();
}

if(urlParams.has('time')) {
  startTime = parseInt(urlParams.get('time'));
}

if(urlParams.has('minLength')) {
  minLength = parseInt(urlParams.get('minLength'));
}


console.log('Boggle Board:', board);
printBoard(board);
fillTableWithBoard(board);
console.log(boardCells)

//On mouse drag, highlight all cells that are being dragged over
window.addEventListener(eventStartType, function(e) {
  const table = document.getElementById('boggle-board');
  const cells = table.getElementsByTagName('td');
  //Check if mouse is over a cell
  if(!e.target.classList.contains('cell')) {
    return;
  }
  mouseOverCell(e);

  isSelectingWord = true;
  
})

function mouseOverCell(e) {
  console.log(e.target.nodeName)
  if(!e.target.classList.contains('cell')) {
    return;
  }
  //Check if the cell is already highlighted
  if (e.target.style.backgroundColor === 'yellow') {
    clearSelectedLetters(false);
    return;
  }
  //Check if the cell is adjacent to the last cell
  if (selectedLetters.length > 0) {
    const lastCell = selectedCells[selectedLetters.length - 1];
    const lastCellRow = parseInt(lastCell.getAttribute('data-row'));
    const lastCellCol = parseInt(lastCell.getAttribute('data-col'));
    const currentCellRow = parseInt(e.target.getAttribute('data-row'));
    const currentCellCol = parseInt(e.target.getAttribute('data-col'));
    if (Math.abs(lastCellRow - currentCellRow) > 1 || Math.abs(lastCellCol - currentCellCol) > 1) {
      clearSelectedLetters(false);
      return;
    }
  }

  e.target.style.backgroundColor = 'yellow';
  selectedLetters += e.target.innerHTML;
  selectedCells.push(e.target);
  console.log(selectedLetters);
  console.log(selectedCells);
}

function clearSelectedLetters(completedWord) {
  selectedLetters = "";
  selectedCells = [];
  isSelectingWord = false;
  const table = document.getElementById('boggle-board');
  const cells = table.getElementsByTagName('td');
  for (let i = 0; i < cells.length; i++) {
    if(!completedWord)
    {
      cells[i].style.backgroundColor = 'white';
    }
  }
  //Remove event listeners from cells
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('mouseover', mouseOverCell);
  }
}


//On mouse release, unhighlight all cells
window.addEventListener('mouseup', function(e) {
  if(!isSelectingWord) {
    return;
  }
  console.log(selectedLetters);
  checkWord(selectedLetters);
 clearSelectedLetters(true);
  
})

if(isMobile) {
  submitBtn.addEventListener('click', function(e) {
    checkWord(selectedLetters);
    clearSelectedLetters(true);
  })
}

//Check if word is in wordlist file
async function inWordList(word) {
  //Read wordlist file 

  
  //Split wordlist into array
  let wordlist = await loadFile(wordlistURL)
  wordlist = wordlist.split("\n");
  console.log("Checking word: " + word);
  //Check if word is in wordlist
  if (wordlist.includes(word)) {
    console.log(word + " was there!");
    return true;
  } else {
    console.log(word + " was not there!");
    return false;
  }
}

async function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status==200) {
    result = xmlhttp.responseText;
    console.log(typeof result)
  }
  return result;
}

async function checkWord(word) {
  console.log("Checking word: " + word);
  console.log(selectedCells)
  pastCells = selectedCells;
  
  word = word.toLowerCase();
  //Check if word is in dictionary
  let wordExists = await inWordList(word);
  console.log("Done checking word", wordExists);
  if (wordExists && doneWords.indexOf(word) === -1 && word.length >= minLength) {
    console.log(word + " was there!");
    score += scoring[word.length];
    scoreLabel.textContent = "Score: " + score;
    console.log("Your Score is: " + score);
    doneWords.push(word);
   
    const wordLi = document.createElement('li');
    wordLi.textContent = word + " - " + scoring[word.length];
    wordListDiv.appendChild(wordLi);

    //Highlight cells green
    for (let i = 0; i < pastCells.length; i++) {
      console.log(pastCells[i]);
      pastCells[i].style.backgroundColor = 'green';
      //Then go back to white after 1 second
     
    }

    setTimeout(function() {
      for (let i = 0; i < pastCells.length; i++) {
        console.log(pastCells[i]);
        pastCells[i].style.backgroundColor = 'white';
        //Then go back to white after 1 second
       
      }
      pastCells = [];
    }, 500);
  } else {
    console.log(word + " was NOT there...");
    //Highlight cells red
    for (let i = 0; i < pastCells.length; i++) {
      console.log(pastCells[i]);
      pastCells[i].style.backgroundColor = 'red';
      //Then go back to white after 1 second
     
    }

    setTimeout(function() {
      for (let i = 0; i < pastCells.length; i++) {
        console.log(pastCells[i]);
        pastCells[i].style.backgroundColor = 'white';
        //Then go back to white after 1 second
       
      }
      pastCells = [];
  
     
    }
    , 500);

  }
}
function startTimer(){
  timeLabel.textContent = "Time: " + startTime;
  var start = Date.now();
  let timer = setInterval(function() {
      var delta = Date.now() - start; // milliseconds elapsed since start
      let timeLeft = startTime - Math.floor(delta / 1000);
      timeLabel.textContent = "Time: " + timeLeft;
      if(timeLeft <= 0) {
       
        alert("Time's up! Your score is: " + score);
        clearInterval(timer); 
        gameOver();
      }
     
      // alternatively just show wall clock time:
      //output(new Date().toUTCString());
  }, 1000); // update about every second
 
}


function gameOver(){
  boggleDiv.classList.add('hidden');
  
  gameOverDiv.classList.remove('hidden');
  const finalScore = document.getElementById('final-score');
  finalScore.textContent = "Your final score is: " + score + "!";
  //get url params
  const urlParams = new URLSearchParams(window.location.search);
  const pastScore = urlParams.get('score');
  if(pastScore !== null) {
    if(score > pastScore) {
      finalScore.textContent += " You beat the other persons score of " + pastScore + "!";
    }
    else if(score < pastScore) {
      finalScore.textContent += " You lost to the other persons score of " + pastScore + "!";
    }
    else {
      finalScore.textContent += " You tied with the other persons score of " + pastScore + "!";
    }
  }


  

}


startBtn.addEventListener('click', function() {
  boggleDiv.classList.remove('hidden');
  startBtn.parentElement.classList.add('hidden');
  startTimer();
})

playAgainBtn.addEventListener('click', function() {
  location.reload();
})

function createBoardSeed(board){
  let boardSeed = "";
  for(let i = 0; i < board.length; i++){
    for(let j = 0; j < board[i].length; j++){
      let letter = board[i][j];
      //convert letter to number
      let letterNum = letter.charCodeAt(0);
      boardSeed += letterNum + ".";
    }
  }
  return boardSeed;
}

function loadBoard(boardSeed){
  let board = [];
  let row = [];
  let letterNum = "";
  for(let i = 0; i < boardSeed.length; i++){
    if(boardSeed[i] === "."){
      let letter = String.fromCharCode(letterNum);
      row.push(letter);
      letterNum = "";
    } else {
      letterNum += boardSeed[i];
    }
    if(row.length === 4){
      board.push(row);
      row = [];
    }
  }
  return board;
}


console.log(createBoardSeed(board));

shareBtn.addEventListener('click', function() {
  let boardSeed = createBoardSeed(board);
  //Get current url
  let url = window.location.href;
  //Remove everything after the ? in the url
  url = url.split('?')[0];
  //Add the boardSeed to the url
  url += "?boardSeed=" + boardSeed;
  //Add the score to the url
  url += "&score=" + score;
  if(isCustomGame){
    url += "&time=" + startTime;
    url += "&minLength=" + minLength;
  }
  
  navigator.clipboard.writeText(url).then(function() {
    console.log('Async: Copying to clipboard was successful!');
    alert("Copied to clipboard!");
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
  
})

customGameBtn.addEventListener('click', function() {
  if(customGamePrompt.classList.contains('inactive')) {
    customGamePrompt.classList.remove('inactive');
  }
  else{
    customGamePrompt.classList.remove('hidden');
  }
  customGamePrompt.classList.add('active');
  customGamePromptOpen = true;

  
  
})

//Check when escape is pressed
document.addEventListener('keydown', function(event) {
  if(event.key === "Escape" && customGamePromptOpen) {
    customGamePrompt.classList.remove('active');
    customGamePrompt.classList.add('inactive');
    customGamePromptOpen = false;
  }
})

function loadCustomBoard(boardSeed){
  let board = [];
  let decodedBoardSeed = boardSeed.split('.');
  for(let i = 0; i < decodedBoardSeed.length; i++){
    const row = [];
    for (let index = 0; index < 4; index++) {
      const letter = decodedBoardSeed[i].charAt(index);
      row.push(letter);
    }
    board.push(row);
  }
  return board;
}

function clearBoardDiv(){
 //Clear the board table
 let table = document.getElementById('boggle-board');
  table.innerHTML = "";
}

customGameStartBtn.addEventListener('click', function() {
  let boardSeed = customGameSeedInput.value;
  let customTime = customGameTimeInput.value;
  let minWordLength = customGameMinLengthInput.value;
  if(boardSeed.length === 19) {
    board = loadCustomBoard(boardSeed);
    clearBoardDiv();
    fillTableWithBoard(board);
  }
  else if(boardSeed.length !== 0){
    
    alert("Invalid board seed!");
    return
  }
  if(minWordLength.length !== 0) {
    minWordLength = parseInt(minWordLength);
    minLength = minWordLength;
  }
  isCustomGame = true;
  customGamePrompt.classList.remove('active');
  customGamePrompt.classList.add('inactive');
  customGamePromptOpen = false;
  startTime = customTime;
  boggleDiv.classList.remove('hidden');
  startBtn.parentElement.classList.add('hidden');
  startTimer();

  
})