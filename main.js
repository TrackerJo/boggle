
let boardCells = [];
let eventStartType = 'mousedown';
let eventMouseOver = 'mouseover';
let isMobile = false;
//Check if touch screen
if ('ontouchstart' in window) {
  isMobile = true;
  eventStartType = 'touchmove';
  eventMouseOver = 'touchover';
  //Disable scrolling
  document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
  }, { passive: false });
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
        if(!isSelectingWord) {
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
const boggleDiv = document.getElementById('board-div');
const startBtn = document.getElementById('start-btn');
const wordListDiv = document.getElementById('word-list');
const scoreLabel = document.getElementById('score');
const timeLabel = document.getElementById('time');
const gameOverDiv = document.getElementById('game-over');
const playAgainBtn = document.getElementById('play-again-btn');
const shareBtn = document.getElementById('share-btn');
const cursor = document.getElementById('cursor');

const startTime = 100;
let selectedLetters = "";
let selectedCells = [];
let pastCells = [];
let score = 0;
let doneWords = [];
const scoring = {
  3: 100,
  4: 400,
  5: 800,
  6: 1400,
  7: 1800
}
let isSelectingWord = false;
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

  isSelectingWord = true;
  // if(isMobile) {
  //   cursor.style.display = 'block';
  //   cursor.style.left = e.pageX + 'px';
  //   cursor.style.top = e.pageY + 'px';
  //   console.log(e.pageX, e.pageY);
  //   //Check if cursor is over a cell
  //   for (let i = 0; i < boardCells.length; i++) {
  //     //The cursor is absolutely positioned, so we need to check if the cursor is within the cell, not the cell within the cursor
  //     const cell = boardCells[i];
  //     //Get the cell's position relative to the same parent as the cursor
  //     const cellRect = cell.getBoundingClientRect();
  //     //get the cursor's position relative to the same parent as the cell
  //     const cursorRect = cursor.getBoundingClientRect();
  //     alert(cellRect.left + ' ' + cellRect.right + ' ' + cellRect.top + ' ' + cellRect.bottom);
  //     alert(cursorRect.left + ' ' + cursorRect.right + ' ' + cursorRect.top + ' ' + cursorRect.bottom);
  //     if (cursorRect.left >= cellRect.left && cursorRect.right <= cellRect.right && cursorRect.top >= cellRect.top && cursorRect.bottom <= cellRect.bottom) {
  //       console.log('Cursor is over cell');
  //       mouseOverCell(e);
  //       break;
  //     }

      
  //   }
  // } else {
    // mouseOverCell(e);
    // for (let i = 0; i < boardCells.length; i++) {
    //   //Make sure cell is actually a cell
    //   console.log(boardCells[i].nodeName);
    
    //     boardCells[i].addEventListener(eventOverType, mouseOverCell);
      
      
    // }
 // }
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

function checkWord(word) {
  console.log("Checking word: " + word);
  console.log(selectedCells)
  pastCells = selectedCells;
  
  word = word.toLowerCase();
  //Check if word is in dictionary
  if (inWordList(word) && doneWords.indexOf(word) === -1 && word.length > 2) {
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
  finalScore.textContent = "Your final score is: " + score;

  

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
  
  navigator.clipboard.writeText(url).then(function() {
    console.log('Async: Copying to clipboard was successful!');
    alert("Copied to clipboard!");
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
  
})

//Check if word is in wordlist file
async function inWordList(word) {
  //Read wordlist file 

  
  //Split wordlist into array
  let wordlist = loadFile("./wordlist.txt").split("\n");
  //Check if word is in wordlist
  if (wordlist.includes(word)) {
    return true;
  } else {
    return false;
  }
}

function loadFile(filePath) {
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