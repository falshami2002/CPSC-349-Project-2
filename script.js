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

//Add pieces at starting positions
const squares = board.querySelectorAll(".square");
for(let square of squares) {
    if(/0-[07]/g.test(square.id)) {
        square.innerHTML = `<p>&#9820;</p>`
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

//Pawn class
class Pawn {
    constructor(color, id) {
        this.color = color;
        this.id = id;
        this.hasMoved = false;
    }
    availableSquares() {
        if (this.hasMoved) {
            if(this.color === "black") {
                return [(parseInt(this.id.split('-')[0])+1).toString() + '-' + this.id.split('-')[1]];
            }
            else if(this.color === "white") {
                return [(parseInt(this.id.split('-')[0])-1).toString() + '-' + this.id.split('-')[1]];
            }
        }
        if (!this.hasMoved) {
            if(this.color === "black") {
                return [(parseInt(this.id.split('-')[0])+1).toString() + '-' + this.id.split('-')[1], (parseInt(this.id.split('-')[0])+2).toString() + '-' + this.id.split('-')[1]];
            }
            else if(this.color === "white") {
                return [(parseInt(this.id.split('-')[0])-1).toString() + '-' + this.id.split('-')[1], (parseInt(this.id.split('-')[0])-2).toString() + '-' + this.id.split('-')[1]];
            }
        }
    }
    move(newId) {
        if(!this.availableSquares().includes(newId)) {
            return;
        }
        document.getElementById(this.id).innerHTML = "";
        this.id = newId;
        if(this.color === "black") {
            document.getElementById(this.id).innerHTML = "<p>&#9823;</p>";
        }
        else {
            document.getElementById(this.id).innerHTML = "<p>&#9817;</p>";
        }
    }
}

class Game {
    constructor() {
        this.board = [];
        this.pieces = ["&#9817", "&#9814", "&#9816", "&#9815", "&#9813", "&#9812", "&#9823", "&#9820", "&#9822", "&#9821", "&#9819", "&#9818"];
        this.code = ['P', 'R', 'N', 'B', 'Q', 'K', 'p', 'r', 'n', 'b', 'q', 'k'];
    }

    loadGameFromFEN(FEN) {
        let i = 0;
        for(let char of FEN) {
            if(char === '/') {
                continue;
            }
            if(/\d/.test(char)) {
                for(let j = 0;j<parseInt(char);j++) {
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
        for(let square of this.board) {
            if(files === 8) {
                if(empty>0) {
                    FEN+=empty;
                    empty = 0;
                }
                FEN+='/';
                files = 0;
            }
            if(square === 12) { 
                empty++;
                files++;
            }
            else {
                if(empty>0) {
                    FEN+=empty;
                    empty = 0;
                }
                FEN+=this.code[square];
                files++;
                console.log(files);
            }
        }
        return FEN;
    }

    drawGame() {
        let squares = document.querySelectorAll('.square');
        for(let i = 0;i<64;i++) {
            if(this.pieces[this.board[i]]) {
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
        if(piece === 1 || piece === 7 || piece === 4 || piece === 10) {
            let curr = id + 8;
            while(curr<64) {
                moves.push(curr)
                curr+=8;
            }
            curr = id - 8;
            while(curr>=0) {
                moves.push(curr)
                curr-=8;
            }
            curr = id;
            while((curr+1)%8!=0) {
                curr+=1;
                moves.push(curr)
            }
            curr = id;
            while((curr)%8!=0) {
                curr-=1;
                moves.push(curr);
            }
        }
        if(piece === 3 || piece === 9 || piece === 4 || piece === 10) {
            console.log('bishop')
            let curr = id + 7;
            while(curr<64) {
                if((curr+1)%8===0) {
                    break;
                }
                moves.push(curr);
                curr+=7;
            }
            curr = id - 7;
            while(curr>=0) {
                if(curr%8===0) {
                    break;
                }
                moves.push(curr);
                curr-=7;
            }
            curr = id + 9;
            while(curr<64) {
                if((curr+1)%8===0) {
                    moves.push(curr);
                    break;
                }
                moves.push(curr);
                curr+=9;
            }
            curr = id - 9;
            while(curr>=0) {
                if(curr%8===0) {
                    moves.push(curr);
                    break;
                }
                moves.push(curr);
                curr-=9;
            }
        }
        if(piece === 2 || piece === 8) {
            let curr = id + 10;
            if(Math.floor(id/8) + 1 === Math.floor(curr/8) && curr<64) {
                moves.push(curr);
            }
            curr = id + 6;
            if(Math.floor(id/8) + 1 === Math.floor(curr/8) && curr<64) {
                moves.push(curr);
            }
            curr = id + 17;
            if(Math.floor(id/8) + 2 === Math.floor(curr/8) && curr<64) {
                moves.push(curr);
            }
            curr = id + 15;
            if(Math.floor(id/8) + 2 === Math.floor(curr/8)&& curr<64) {
                moves.push(curr);
            }
            curr = id - 10;
            if(Math.floor(id/8) -1 === Math.floor(curr/8) && curr>0) {
                moves.push(curr);
            }
            curr = id - 6;
            if(Math.floor(id/8) - 1 === Math.floor(curr/8) && curr>0) {
                moves.push(curr);
            }
            curr = id - 17;
            if(Math.floor(id/8) - 2 === Math.floor(curr/8) && curr>0) {
                moves.push(curr);
            }
            curr = id - 15;
            if(Math.floor(id/8) - 2 === Math.floor(curr/8) && curr>0) {
                moves.push(curr);
            }
        }
        if(piece === 0 || piece === 6) {
            if(piece === 0 && id-8>=0) {
                moves.push(id-8);
                if(Math.floor(id/8) === 6) {
                    moves.push(id-16);
                }
            }
            if(piece === 6 && id+8<64) {
                moves.push(id+8);
                if(Math.floor(id/8) === 1) {
                    moves.push(id+16);
                }
            }
        }
        if(piece === 5 || piece === 11) {
            let curr = id + 8;
            if(curr<64) {
                moves.push(curr);
            }
            curr = id - 8;
            if(curr>=0) {
                moves.push(curr);
            }
            curr = id + 1;
            if(Math.floor(id/8) === Math.floor(curr/8)) {
                moves.push(curr);
            }
            curr = id - 1;
            if(Math.floor(id/8) === Math.floor(curr/8)) {
                moves.push(curr);
            }
            curr = id + 9;
            if(Math.floor(id/8) + 1 === Math.floor(curr/8)) {
                moves.push(curr);
            }
            curr = id + 7;
            if(Math.floor(id/8) + 1 === Math.floor(curr/8)) {
                moves.push(curr);
            }
            curr = id - 9;
            if(Math.floor(id/8) - 1 === Math.floor(curr/8)) {
                moves.push(curr);
            }
            curr = id - 7;
            if(Math.floor(id/8) - 1 === Math.floor(curr/8)) {
                moves.push(curr);
            }
        }
        let squares = document.querySelectorAll('.square');
        for(let i = 0;i<64;i++) {
            squares[i].classList.remove('active');
        }
        for(let i = 0;i<64;i++) {
            if(moves.includes(parseInt(squares[i].id))) {
                squares[i].classList.add('active');
                squares[i].addEventListener('click', (e) => this.movePiece(e, id));
            }
        }
    }

    movePiece(e, id) {
        let newID = e.target.id;
        let oldID = id;
        let piece = this.board[oldID];
        if(piece != 12) {
            console.log(piece);
            this.board[oldID] = 12;
            this.board[newID] = piece;
            for(let i = 0;i<64;i++) {
                squares[i].classList.remove('active');
            }
            this.drawGame();
        }
    }
}

let FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
let sample = new Game();
sample.loadGameFromFEN(FEN);
sample.drawGame();
console.log(sample.saveGameToFEN());

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
        for (let i = x;i>=0;i--) {
            available.push(i+'-'+y);
        }
        for (let i = x;i<=7;i++) {
            available.push(i+'-'+y);
        }
        for (let i = y;i>=0;i++) {
            available.push(x+'-'+i);
        }
        for (let i = y;i<=7;i++) {
            available.push(x+'-'+i);
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
        available.push((x+2)+'-'+(y+1));
        available.push((x+2)+'-'+(y-1));
        available.push((x-2)+'-'+(y+1));
        available.push((x-2)+'-'+(y-1));
        available.push((x+1)+'-'+(y+2));
        available.push((x-1)+'-'+(y+2));
        available.push((x+1)+'-'+(y-2));
        available.push((x-1)+'-'+(y-2));
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
        while(i>=0 && j>=0) {
            available.push(i+'-'+j);
            i--;
            j--;
        }
        while(i>=0 && j<=7) {
            available.push(i+'-'+j);
            i--;
            j++;
        }
        while(i<=7 && j>=0) {
            available.push(i+'-'+j);
            i++;
            j--;
        }
        while(i<=7 && j<=7) {
            available.push(i+'-'+j);
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
        for (let i = x;i>=0;i--) {
            available.push(i+'-'+y);
        }
        for (let i = x;i<=7;i++) {
            available.push(i+'-'+y);
        }
        for (let i = y;i>=0;i++) {
            available.push(x+'-'+i);
        }
        for (let i = y;i<=7;i++) {
            available.push(x+'-'+i);
        }
        let i = x;
        let j = y;
        while(i>=0 && j>=0) {
            available.push(i+'-'+j);
            i--;
            j--;
        }
        while(i>=0 && j<=7) {
            available.push(i+'-'+j);
            i--;
            j++;
        }
        while(i<=7 && j>=0) {
            available.push(i+'-'+j);
            i++;
            j--;
        }
        while(i<=7 && j<=7) {
            available.push(i+'-'+j);
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
        available.push((x+1)+'-'+y);
        available.push((x-1)+'-'+y);
        available.push(x+'-'+(y+1));
        available.push(x+'-'+(y-1));
        available.push((x+1)+'-'+(y+1));
        available.push((x+1)+'-'+(y-1));
        available.push((x-1)+'-'+(y+1));
        available.push((x-1)+'-'+(y-1));
        return available;
    }
}
