const board = document.querySelector(".chess-board");

//Create chess board pattern
for(let i = 0;i<8;i++) {
    for(let j=0;j<8;j++) {
        if((i+j)%2!=0){
            board.innerHTML += `<div class="square black" id="${j+(i*8)}"></div>`
        }
        else {
            board.innerHTML += `<div class="square white" id="${j+(i*8)}"></div>`
        }
    }
}

/* ?? Uneccesary Code ?? (OLD METHOD)
//Add pieces at starting positions
for(let square of squares) {
    if(/0-[07]/g.test(square.id)) {
        square.innerHTML = `<p>3</p>`
    }
    else if(/0-[16]/g.test(square.id)) {
        square.innerHTML = `<p>&#9822;</p>`
    }
    else if(/0-[25]/g.test(square.id)) {
        square.innerHTML = `<p>&#9821;</p>`
    }
    else if(/0-3/g.test(square.id)) {
        square.innerHTML = `<p>&#9819;</p>`
    }
    else if(/0-4/g.test(square.id)) {
        square.innerHTML = `<p>&#9818;</p>`
    }
    else if(/1-\d/g.test(square.id)) {
        square.innerHTML = `<p>&#9823;</p>`
    }
    else if(/7-[07]/g.test(square.id)) {
        square.innerHTML = `<p>&#9814;</p>`
    }
    else if(/7-[16]/g.test(square.id)) {
        square.innerHTML = `<p>&#9816;</p>`
    }
    else if(/7-[25]/g.test(square.id)) {
        square.innerHTML = `<p>&#9815;</p>`
    }
    else if(/7-3/g.test(square.id)) {
        square.innerHTML = `<p>&#9813;</p>`
    }
    else if(/7-4/g.test(square.id)) {
        square.innerHTML = `<p>&#9812;</p>`
    }
    else if(/6-\d/g.test(square.id)) {
        square.innerHTML = `<p>&#9817;</p>`
    }
}
*/


class Game {
    constructor() {
        this.board = [];
        this.pieces = ["&#9817", "&#9814", "&#9816", "&#9815", "&#9813", "&#9812", "&#9823", "&#9820", "&#9822", "&#9821", "&#9819", "&#9818"];
        this.code = ['P', 'R', 'N', 'B', 'Q', 'K', 'p', 'r', 'n', 'b', 'q', 'k'];
        this.captured = [[], []];
    }

    loadGameFromFEN(FEN) {
        let i = 0;
        for (let char of FEN) {
            if (char === '/') {
                continue;
            }
            if (/\d/.test(char)) {
                for (let j = 0; j < parseInt(char); j++) {
                    this.board[i++] = 12;
                }
                continue;
            }
            this.board[i++] = this.code.indexOf(char);
        }
    }

    saveGameToFEN() {
        let FEN = "";
        let files = 0;
        let empty = 0;
        for (let square of this.board) {
            if (files === 8) {
                if (empty > 0) {
                    FEN += empty;
                    empty = 0;
                }
                FEN += '/';
                files = 0;
            }
            if (square === 12) {
                empty++;
                files++;
            }
            else {
                if (empty > 0) {
                    FEN += empty;
                    empty = 0;
                }
                FEN += this.code[square];
                files++;
                console.log(files);
            }
        }
        return FEN;
    }

    drawGame() {
        let squares = document.querySelectorAll('.square');
        for (let i = 0; i < 64; i++) {
            if (this.pieces[this.board[i]]) {
                squares[i].piece = this.board[i];
                let par = document.createElement('p');
                par.innerHTML = this.pieces[this.board[i]];
                squares[i].replaceChildren(par);
                squares[i].addEventListener("click", e => this.getMoves(e));
            }
            else {
                squares[i].replaceChildren();
            }
        }
    }

    getMoves(e) {
        let id = parseInt(e.currentTarget.id);
        let piece = this.board[id];
        let moves = [];
        if (piece === 1 || piece === 7 || piece === 4 || piece === 10) {
            let curr = id + 8;
            while (curr < 64) {
                if ((piece === 1 || piece === 4) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    break;
                }
                if ((piece === 7 || piece === 10) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    break;
                }
                moves.push(curr)
                curr += 8;
                if ((piece === 1 || piece === 4) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 7 || piece === 10) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
            }
            curr = id - 8;
            while (curr >= 0) {
                if ((piece === 1 || piece === 4) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    break;
                }
                if ((piece === 7 || piece === 10) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    break;
                }
                moves.push(curr)
                curr -= 8;
                if ((piece === 1 || piece === 4) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 7 || piece === 10) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
            }
            curr = id;
            while ((curr + 1) % 8 != 0) {
                if ((piece === 1 || piece === 4) && (this.board[curr + 1] >= 0 && this.board[curr + 1] <= 5)) {
                    break;
                }
                if ((piece === 7 || piece === 10) && (this.board[curr + 1] >= 5 && this.board[curr + 1] <= 11)) {
                    break;
                }
                curr += 1;
                moves.push(curr)
                if ((piece === 1 || piece === 4) && (this.board[curr + 1] >= 5 && this.board[curr + 1] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 7 || piece === 10) && (this.board[curr + 1] >= 0 && this.board[curr + 1] <= 5)) {
                    moves.push(curr);
                    break;
                }
            }
            curr = id;
            while ((curr) % 8 != 0) {
                if ((piece === 1 || piece === 4) && (this.board[curr - 1] >= 0 && this.board[curr - 1] <= 5)) {
                    break;
                }
                if ((piece === 7 || piece === 10) && (this.board[curr - 1] >= 5 && this.board[curr - 1] <= 11)) {
                    break;
                }
                curr -= 1;
                moves.push(curr);
                if ((piece === 1 || piece === 4) && (this.board[curr - 1] >= 5 && this.board[curr - 1] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 7 || piece === 10) && (this.board[curr - 1] >= 0 && this.board[curr - 1] <= 5)) {
                    moves.push(curr);
                    break;
                }
            }
        }
        if (piece === 3 || piece === 9 || piece === 4 || piece === 10) {
            let curr = id + 7;
            while (curr < 64) {
                if ((piece === 3 || piece === 4) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    break;
                }
                if ((piece === 9 || piece === 10) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    break;
                }
                if ((curr + 1) % 8 === 0) {
                    break;
                }
                moves.push(curr);
                curr += 7;
                if ((piece === 3 || piece === 4) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 9 || piece === 10) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
            }
            curr = id - 7;
            while (curr >= 0) {
                if ((piece === 3 || piece === 4) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    break;
                }
                if ((piece === 9 || piece === 10) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    break;
                }
                if (curr % 8 === 0) {
                    break;
                }
                moves.push(curr);
                curr -= 7;
                if ((piece === 3 || piece === 4) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 9 || piece === 10) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
            }
            curr = id + 9;
            while (curr < 64) {
                if ((piece === 3 || piece === 4) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    break;
                }
                if ((piece === 9 || piece === 10) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    break;
                }
                if ((curr + 1) % 8 === 0) {
                    moves.push(curr);
                    break;
                }
                moves.push(curr);
                curr += 9;
                if ((piece === 3 || piece === 4) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 9 || piece === 10) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
            }
            curr = id - 9;
            while (curr >= 0) {
                if ((piece === 3 || piece === 4) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    break;
                }
                if ((piece === 9 || piece === 10) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    break;
                }
                if (curr % 8 === 0) {
                    moves.push(curr);
                    break;
                }
                moves.push(curr);
                curr -= 9;
                if ((piece === 3 || piece === 4) && (this.board[curr] >= 5 && this.board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 9 || piece === 10) && (this.board[curr] >= 0 && this.board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
            }
        }
        if (piece === 2 || piece === 8) {
            let curr = id + 10;
            if (Math.floor(id / 8) + 1 === Math.floor(curr / 8) && curr < 64) {
                if (!((piece === 2 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 8 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 6;
            if (Math.floor(id / 8) + 1 === Math.floor(curr / 8) && curr < 64) {
                if (!((piece === 2 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 8 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 17;
            if (Math.floor(id / 8) + 2 === Math.floor(curr / 8) && curr < 64) {
                if (!((piece === 2 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 8 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 15;
            if (Math.floor(id / 8) + 2 === Math.floor(curr / 8) && curr < 64) {
                if (!((piece === 2 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 8 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 10;
            if (Math.floor(id / 8) - 1 === Math.floor(curr / 8) && curr > 0) {
                if (!((piece === 2 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 8 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 6;
            if (Math.floor(id / 8) - 1 === Math.floor(curr / 8) && curr > 0) {
                if (!((piece === 2 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 8 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 17;
            if (Math.floor(id / 8) - 2 === Math.floor(curr / 8) && curr > 0) {
                if (!((piece === 2 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 8 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 15;
            if (Math.floor(id / 8) - 2 === Math.floor(curr / 8) && curr > 0) {
                if (!((piece === 2 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 8 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
        }
        if (piece === 0 || piece === 6) {
            if (piece === 0 && id - 8 >= 0) {
                if (this.board[id - 8] === 12) {
                    moves.push(id - 8);
                }
                if (Math.floor(id / 8) === 6 && this.board[id - 16] === 12) {
                    moves.push(id - 16);
                }
            }
            if (piece === 6 && id + 8 < 64) {
                if (this.board[id + 8] === 12) {
                    moves.push(id + 8);
                }
                if (Math.floor(id / 8) === 1 && this.board[id + 16] === 12) {
                    moves.push(id + 16);
                }
            }
        }
        if (piece === 5 || piece === 11) {
            let curr = id + 8;
            if (curr < 64) {
                if (!((piece === 5 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 11 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 8;
            if (curr >= 0) {
                if (!((piece === 5 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 11 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 1;
            if (Math.floor(id / 8) === Math.floor(curr / 8)) {
                if (!((piece === 5 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 11 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 1;
            if (Math.floor(id / 8) === Math.floor(curr / 8)) {
                if (!((piece === 5 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 11 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 9;
            if (Math.floor(id / 8) + 1 === Math.floor(curr / 8)) {
                if (!((piece === 5 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 11 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 7;
            if (Math.floor(id / 8) + 1 === Math.floor(curr / 8)) {
                if (!((piece === 5 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 11 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 9;
            if (Math.floor(id / 8) - 1 === Math.floor(curr / 8)) {
                if (!((piece === 5 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 11 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 7;
            if (Math.floor(id / 8) - 1 === Math.floor(curr / 8)) {
                if (!((piece === 5 && (this.board[curr] >= 0 && this.board[curr] <= 5)) || (piece === 11 && (this.board[curr] >= 5 && this.board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
        }
        let squares = document.querySelectorAll('.square');
        for (let i = 0; i < 64; i++) {
            squares[i].classList.remove('active');
        }
        for (let i = 0; i < 64; i++) {
            if (moves.includes(parseInt(squares[i].id))) {
                squares[i].classList.add('active');
                squares[i].addEventListener('click', (e) => this.movePiece(e, id));
            }
        }
    }

    movePiece(e, id) {
        let squares = document.querySelectorAll('.square');l
        let newID = e.currentTarget.id;
        let oldID = id;
        let piece = this.board[oldID];
        if (piece != 12) {
            if (this.board[newID] != 12) {
                this.drawCaptured(newID);
            }
            this.board[oldID] = 12;
            this.board[newID] = piece;
            for (let i = 0; i < 64; i++) {
                squares[i].classList.remove('active');
            }
            this.drawGame();
        }
    }
}

let FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"; // default chess layout

/* Section for Save Functionality
    Games are loaded and saved into four slots while the current game exist as one single game board.
    Every time a game is created or loaded in it overwrites the the game board with a new game or saved game that was loaded.
    Information for time of saving and
*/
// FENS hold the four game slots and data for where chess pieces are located on the board.
let FENS = [];
try {
    FENS = localStorage.FENS.split(",");
} catch (SyntaxError) {
    console.log("No FENS - Using default value")
    FENS = ["", "", "", ""];
}

// dates hold the four save times when games were saved
let dates = [];
try {
    dates = localStorage.dates.split(",");
} catch (SyntaxError) {
    console.log("No DATES - Using default value")
    dates = ["", "", "", ""];
}

// Initiate the main game where all saves/new games will be loaded onto
let game = new Game();
let selectedGame = 0; // default save slot
const saves = document.querySelectorAll(".save");


function changeActive() {
    // Actively change the actively used save slot when we either load or save a game.
    saves.forEach((save) => {
        save.classList.remove("activeSave");
    });
    let selected = document.getElementById("s" + selectedGame);
    selected.classList.add("activeSave");
}
changeActive(); // Call it once to establish save 1 as default save.

function updateTime() {
    // Update time for selected save slot based on list(dates)
    let selected = document.getElementById("s" + selectedGame);
    selected.innerHTML = "Save " + (Number(selectedGame) + 1) + " - " + dates[selectedGame];
}

// Add eventlistener when a save slot is selected updating target save
saves.forEach((save) => {
    save.addEventListener("click", (event) => {
        selectedGame = event.currentTarget.id.split("")[1];

        // Remove style from other saves
        saves.forEach((save) => {
            save.classList.remove("selectSave");
        });

        save.classList.add("selectSave");

    })
    // Important when website reloads to provide info of previous sessions.
    let number = save.id.split("")[1];
    save.innerHTML = "Save " + (Number(number) + 1) + " - " + dates[number];
});

function newGame() {
    // Creates a new game and starts a new game on the single board with default chess pieces placements
    delete game;
    game = new Game();
    game.loadGameFromFEN(FEN);
    game.drawGame();
}

function saveGame() {
    // Will save the game on the selected slot with time and chess piece locations saved in localStorage
    let date = new Date();
    let day = (date.getMonth() + 1) + "/" + (date.getDay() - 2);
    let time = ((date.getHours() - 1) % 12) + 1 + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + (date.getHours() > 12 ? "PM" : "AM");
    FENS[selectedGame] = game.saveGameToFEN();
    dates[selectedGame] = (day + " " + time);
    localStorage.clear();
    localStorage.FENS = FENS; //FEN is saved in the list of FENS for future sessions
    localStorage.dates = dates; //date is saved in the list of dates for future sessions
    updateTime(); // Update the save slot display to show accurate time of save point
    changeActive(); // Make selected save the active save for the game
}

function loadGame() {
    // Will overwrite the current game with a new board that loads chess locations of selected save
    delete game;
    game = new Game();
    game.loadGameFromFEN(FENS[selectedGame]);
    game.drawGame();
    changeActive(); // Make selected save the active save for the game
}
// Chess Piece Classes //
//Pawn class
class Pawn {
    constructor(color, id) {
        this.color = color;
        this.id = id;
        this.hasMoved = false;
    }
    availableSquares() {
        if (this.hasMoved) {
            if (this.color === "black") {
                return [(parseInt(this.id.split('-')[0]) + 1).toString() + '-' + this.id.split('-')[1]];
            }
            else if (this.color === "white") {
                return [(parseInt(this.id.split('-')[0]) - 1).toString() + '-' + this.id.split('-')[1]];
            }
        }
        if (!this.hasMoved) {
            if (this.color === "black") {
                return [(parseInt(this.id.split('-')[0]) + 1).toString() + '-' + this.id.split('-')[1], (parseInt(this.id.split('-')[0]) + 2).toString() + '-' + this.id.split('-')[1]];
            }
            else if (this.color === "white") {
                return [(parseInt(this.id.split('-')[0]) - 1).toString() + '-' + this.id.split('-')[1], (parseInt(this.id.split('-')[0]) - 2).toString() + '-' + this.id.split('-')[1]];
            }
        }
    }
    move(newId) {
        if (!this.availableSquares().includes(newId)) {
            return;
        }
        document.getElementById(this.id).innerHTML = "";
        this.id = newId;
        if (this.color === "black") {
            document.getElementById(this.id).innerHTML = "<p>&#9823;</p>";
        }
        else {
            document.getElementById(this.id).innerHTML = "<p>&#9817;</p>";
        }
    }
}

//Rook class
class Rook {
    constructor(color, id) {
        this.color = color;
        this.id = id;
    }
    availableSquares() {
        let x = parseInt(this.id.split('-')[0]);
        let y = parseInt(this.id.split('-')[1]);
        let available = [];
        for (let i = x; i >= 0; i--) {
            available.push(i + '-' + y);
        }
        for (let i = x; i <= 7; i++) {
            available.push(i + '-' + y);
        }
        for (let i = y; i >= 0; i++) {
            available.push(x + '-' + i);
        }
        for (let i = y; i <= 7; i++) {
            available.push(x + '-' + i);
        }
        return available;
    }
}

//Knight class
class Knight {
    constructor(color, id) {
        this.color = color;
        this.id = id;
    }
    availableSquares() {
        let x = parseInt(this.id.split('-')[0]);
        let y = parseInt(this.id.split('-')[1]);
        let available = [];
        available.push((x + 2) + '-' + (y + 1));
        available.push((x + 2) + '-' + (y - 1));
        available.push((x - 2) + '-' + (y + 1));
        available.push((x - 2) + '-' + (y - 1));
        available.push((x + 1) + '-' + (y + 2));
        available.push((x - 1) + '-' + (y + 2));
        available.push((x + 1) + '-' + (y - 2));
        available.push((x - 1) + '-' + (y - 2));
        return available;
    }
}

//Bishop class
class Bishop {
    constructor(color, id) {
        this.color = color;
        this.id = id;
        this.hasMoved = false;
    }
    availableSquares() {
        let x = parseInt(this.id.split('-')[0]);
        let y = parseInt(this.id.split('-')[1]);
        let available = [];
        let i = x;
        let j = y;
        while (i >= 0 && j >= 0) {
            available.push(i + '-' + j);
            i--;
            j--;
        }
        while (i >= 0 && j <= 7) {
            available.push(i + '-' + j);
            i--;
            j++;
        }
        while (i <= 7 && j >= 0) {
            available.push(i + '-' + j);
            i++;
            j--;
        }
        while (i <= 7 && j <= 7) {
            available.push(i + '-' + j);
            i++;
            j++;
        }
        return available;
    }
}

//Queen class
class Queen {
    constructor(color, id) {
        this.color = color;
        this.id = id;
        this.hasMoved = false;
    }
    availableSquares() {
        let x = parseInt(this.id.split('-')[0]);
        let y = parseInt(this.id.split('-')[1]);
        let available = [];
        for (let i = x; i >= 0; i--) {
            available.push(i + '-' + y);
        }
        for (let i = x; i <= 7; i++) {
            available.push(i + '-' + y);
        }
        for (let i = y; i >= 0; i++) {
            available.push(x + '-' + i);
        }
        for (let i = y; i <= 7; i++) {
            available.push(x + '-' + i);
        }
        let i = x;
        let j = y;
        while (i >= 0 && j >= 0) {
            available.push(i + '-' + j);
            i--;
            j--;
        }
        while (i >= 0 && j <= 7) {
            available.push(i + '-' + j);
            i--;
            j++;
        }
        while (i <= 7 && j >= 0) {
            available.push(i + '-' + j);
            i++;
            j--;
        }
        while (i <= 7 && j <= 7) {
            available.push(i + '-' + j);
            i++;
            j++;
        }
        return available;
    }
}

//King class
class King {
    constructor(color, id) {
        this.color = color;
        this.id = id;
    }
    availableSquares() {
        let x = parseInt(this.id.split('-')[0]);
        let y = parseInt(this.id.split('-')[1]);
        let available = [];
        available.push((x + 1) + '-' + y);
        available.push((x - 1) + '-' + y);
        available.push(x + '-' + (y + 1));
        available.push(x + '-' + (y - 1));
        available.push((x + 1) + '-' + (y + 1));
        available.push((x + 1) + '-' + (y - 1));
        available.push((x - 1) + '-' + (y + 1));
        available.push((x - 1) + '-' + (y - 1));
        return available;
    }
}
