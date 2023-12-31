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
        this.turn = 'w';
        this.currentID = 0;
    }

    loadGameFromFEN(FEN) {
        // Given a FEN it will be able to place the chess pieces throughout the board. Can produce starting chess layout or saved game layouts.
        let i = 0;
        let FENBoard = FEN.split(' ')[0];
        for (let char of FENBoard) {
            if (char === ' ') {
                break;
            }
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
        this.turn = FEN.split(' ')[1];
        let FENCastling = FEN.split(' ')[2];
        if (FENCastling.includes('Q')) {
            document.getElementById('60').castling = true;
            document.getElementById('56').castling = true;
        }
        if (FENCastling.includes('K')) {
            document.getElementById('60').castling = true;
            document.getElementById('63').castling = true;
        }
        if (FENCastling.includes('q')) {
            document.getElementById('4').castling = true;
            document.getElementById('0').castling = true;
        }
        if (FENCastling.includes('k')) {
            document.getElementById('4').castling = true;
            document.getElementById('7').castling = true;
        }
        let FENenpassant = FEN.split(' ')[3];
        if(FENenpassant != "-") {
            document.getElementById(`${FENenpassant}`).enpassant = true;
        }
        let squares = document.querySelectorAll('.square');
        for(let square of squares) {
            square.classList.remove("active");
        }
    }

    saveGameToFEN() {
        // Will save the chess pieces on the board into FEN format to save the progress of the game
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
            }
        }
        FEN += " " + this.turn + " ";
        let K = document.getElementById('60').castling;
        let KR = document.getElementById('63').castling;
        let QR = document.getElementById('56').castling;
        let k = document.getElementById('4').castling;
        let kr = document.getElementById('7').castling;
        let qr = document.getElementById('0').castling;
        if(K & KR) {
            FEN+='K';
        }
        if(K & QR) {
            FEN+='Q';
        }
        if(k & kr) {
            FEN+='k';
        }
        if(k & qr) {
            FEN+='q';
        }
        if((!(K & KR)) && (!(K & QR)) && (!(k & kr)) && (!(k & qr))) {
            FEN+='-';
        }
        FEN += " ";
        let FENenpassant = "-";
        let squares = document.querySelectorAll('.square');
        for(let i = 0;i<64;i++) {
            if(squares[i].enpassant) {
                FENenpassant = i;
                break;
            }
        }
        FEN += FENenpassant;
        return FEN;
    }

    drawGame() {
        // Draws the board's chess pieces on top of the board. As well as adding listeners to each chess piece if the user wants to move the tile.
        let squares = document.querySelectorAll('.square');
        let turnDisplay = document.querySelector('#turn');
        turnDisplay.replaceChildren(document.createTextNode(this.turn === 'w' ? "White to play" : "Black to play"));
        turnDisplay.appendChild(document.createTextNode(this.checkForChecks(this.turn) ? " - You are in check" : ""));
        if(this.countAvailableMoves() === 0 && this.checkForChecks(this.turn)) {
            turnDisplay.replaceChildren(document.createTextNode(this.turn === 'w' ? "Black wins by checkmate" : "White wins by checkmate"));
        }
        else if(this.countAvailableMoves() === 0) {
            turnDisplay.replaceChildren(document.createTextNode("Draw by stalemate"));
        }
        for (let i = 0; i < 64; i++) {
            squares[i].removeEventListener("click", this.getMovesCallback);
            squares[i].removeEventListener("click", this.movePieceCallback);
            if (this.pieces[this.board[i]]) {
                squares[i].piece = this.board[i];
                let par = document.createElement('p');
                par.innerHTML = this.pieces[this.board[i]];
                squares[i].replaceChildren(par);
                if((this.turn === 'w' && (this.board[i] >= 0 && this.board[i] <= 5)) || (this.turn === 'b' && (this.board[i] >= 6 && this.board[i] <= 11)))
                {
                    squares[i].addEventListener("click", this.getMovesCallback);
                }
            }
            else {
                squares[i].replaceChildren();
            }
        }
    }

    getMovesCallback(e) {
        game.getMoves(parseInt(e.currentTarget.id), true, true);
    }

    getMoves(pieceID, realMove, checks, board = this.board) {
        let id = pieceID;
        if(realMove) {
            this.currentID = id;
        }
        let piece = board[id];
        let moves = [];
        // Rook (1, 7) and Queen (4, 10) straight vertical and horizontal movement
        if (piece === 1 || piece === 7 || piece === 4 || piece === 10) {
            let curr = id + 8;
            while (curr < 64) {
                if ((piece === 1 || piece === 4) && (board[curr] >= 0 && board[curr] <= 5)) {
                    break;
                }
                if ((piece === 7 || piece === 10) && (board[curr] >= 6 && board[curr] <= 11)) {
                    break;
                }
                if ((piece === 1 || piece === 4) && (board[curr] >= 6 && board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 7 || piece === 10) && (board[curr] >= 0 && board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
                moves.push(curr)
                curr += 8;
            }
            curr = id - 8;
            while (curr >= 0) {
                if ((piece === 1 || piece === 4) && (board[curr] >= 0 && board[curr] <= 5)) {
                    break;
                }
                if ((piece === 7 || piece === 10) && (board[curr] >= 6 && board[curr] <= 11)) {
                    break;
                }
                if ((piece === 1 || piece === 4) && (board[curr] >= 6 && board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 7 || piece === 10) && (board[curr] >= 0 && board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
                moves.push(curr)
                curr -= 8;
            }
            curr = id;
            while ((curr + 1) % 8 != 0) {
                if ((piece === 1 || piece === 4) && (board[curr + 1] >= 0 && board[curr + 1] <= 5)) {
                    break;
                }
                if ((piece === 7 || piece === 10) && (board[curr + 1] >= 6 && board[curr + 1] <= 11)) {
                    break;
                }
                if ((piece === 1 || piece === 4) && (board[curr + 1] >= 6 && board[curr + 1] <= 11)) {
                    moves.push(curr + 1);
                    break;
                }
                if ((piece === 7 || piece === 10) && (board[curr + 1] >= 0 && board[curr + 1] <= 5)) {
                    moves.push(curr + 1);
                    break;
                }
                curr += 1;
                moves.push(curr);
            }
            curr = id;
            while ((curr) % 8 != 0) {
                if ((piece === 1 || piece === 4) && (board[curr - 1] >= 0 && board[curr - 1] <= 5)) {
                    break;
                }
                if ((piece === 7 || piece === 10) && (board[curr - 1] >= 6 && board[curr - 1] <= 11)) {
                    break;
                }
                if ((piece === 1 || piece === 4) && (board[curr - 1] >= 6 && board[curr - 1] <= 11)) {
                    moves.push(curr - 1);
                    break;
                }
                if ((piece === 7 || piece === 10) && (board[curr - 1] >= 0 && board[curr - 1] <= 5)) {
                    moves.push(curr - 1);
                    break;
                }
                curr -= 1;
                moves.push(curr);
            }
        }
        // Bishop (3, 9) and Queen (4, 10) Diagnoal Movement
        if (piece === 3 || piece === 9 || piece === 4 || piece === 10) {
            let curr = id + 7;
            while (curr < 64) {
                if ((piece === 3 || piece === 4) && (board[curr] >= 0 && board[curr] <= 5)) {
                    break;
                }
                if ((piece === 9 || piece === 10) && (board[curr] >= 6 && board[curr] <= 11)) {
                    break;
                }
                if ((curr + 1) % 8 === 0) {
                    break;
                }
                if ((piece === 3 || piece === 4) && (board[curr] >= 6 && board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 9 || piece === 10) && (board[curr] >= 0 && board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
                moves.push(curr);
                curr += 7;
            }
            curr = id - 7;
            while (curr >= 0) {
                if ((piece === 3 || piece === 4) && (board[curr] >= 0 && board[curr] <= 5)) {
                    break;
                }
                if ((piece === 9 || piece === 10) && (board[curr] >= 6 && board[curr] <= 11)) {
                    break;
                }
                if (curr % 8 === 0) {
                    break;
                }
                if ((piece === 3 || piece === 4) && (board[curr] >= 6 && board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 9 || piece === 10) && (board[curr] >= 0 && board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
                moves.push(curr);
                curr -= 7;
            }
            curr = id + 9;
            while (curr < 64) {
                if ((piece === 3 || piece === 4) && (board[curr] >= 0 && board[curr] <= 5)) {
                    break;
                }
                if ((piece === 9 || piece === 10) && (board[curr] >= 6 && board[curr] <= 11)) {
                    break;
                }
                if ((curr + 1) % 8 === 0) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 3 || piece === 4) && (board[curr] >= 6 && board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 9 || piece === 10) && (board[curr] >= 0 && board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
                moves.push(curr);
                curr += 9;
            }
            curr = id - 9;
            while (curr >= 0) {
                if ((piece === 3 || piece === 4) && (board[curr] >= 0 && board[curr] <= 5)) {
                    break;
                }
                if ((piece === 9 || piece === 10) && (board[curr] >= 6 && board[curr] <= 11)) {
                    break;
                }
                if (curr % 8 === 0) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 3 || piece === 4) && (board[curr] >= 6 && board[curr] <= 11)) {
                    moves.push(curr);
                    break;
                }
                if ((piece === 9 || piece === 10) && (board[curr] >= 0 && board[curr] <= 5)) {
                    moves.push(curr);
                    break;
                }
                moves.push(curr);
                curr -= 9;
            }
        }
        // Knight (2, 8) Movement
        if (piece === 2 || piece === 8) {
            let curr = id + 10;
            if (Math.floor(id / 8) + 1 === Math.floor(curr / 8) && curr < 64) {
                if (!((piece === 2 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 8 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 6;
            if (Math.floor(id / 8) + 1 === Math.floor(curr / 8) && curr < 64) {
                if (!((piece === 2 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 8 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 17;
            if (Math.floor(id / 8) + 2 === Math.floor(curr / 8) && curr < 64) {
                if (!((piece === 2 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 8 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 15;
            if (Math.floor(id / 8) + 2 === Math.floor(curr / 8) && curr < 64) {
                if (!((piece === 2 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 8 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 10;
            if (Math.floor(id / 8) - 1 === Math.floor(curr / 8) && curr > 0) {
                if (!((piece === 2 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 8 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 6;
            if (Math.floor(id / 8) - 1 === Math.floor(curr / 8) && curr > 0) {
                if (!((piece === 2 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 8 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 17;
            if (Math.floor(id / 8) - 2 === Math.floor(curr / 8) && curr > 0) {
                if (!((piece === 2 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 8 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 15;
            if (Math.floor(id / 8) - 2 === Math.floor(curr / 8) && curr > 0) {
                if (!((piece === 2 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 8 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
        }
        // Pawn (0, 6) Movement
        if (piece === 0 || piece === 6) {
            if (piece === 0 && id - 8 >= 0) {
                if (this.board[id - 8] === 12) {
                    moves.push(id - 8);
                }
                if (Math.floor(id / 8) === 6 && board[id - 8] === 12 && board[id - 16] === 12) {
                    moves.push(id - 16);
                }
                if ((this.board[id - 7] >= 6 && board[id - 7] <= 11) || document.getElementById(id-7).enpassant) {
                    moves.push(id - 7);
                }
                if ((this.board[id - 9] >= 6 && board[id - 9] <= 11) || document.getElementById(id-9).enpassant) {
                    moves.push(id - 9);
                }
            }
            if (piece === 6 && id + 8 < 64) {
                if (this.board[id + 8] === 12) {
                    moves.push(id + 8);
                }
                if (Math.floor(id / 8) === 1 && board[id + 8] === 12 && board[id + 16] === 12) {
                    moves.push(id + 16);
                }
                if ((this.board[id + 7] >= 0 && board[id + 7] <= 5) || document.getElementById(id+7).enpassant) {
                    moves.push(id + 7);
                }
                if ((this.board[id + 9] >= 0 && board[id + 9] <= 5) || document.getElementById(id+9).enpassant) {
                    moves.push(id + 9);
                }
            }
        }
        // King (5, 11) Movement
        if (piece === 5 || piece === 11) {
            let curr = id + 8;
            if (curr < 64) {
                if (!((piece === 5 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 11 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 8;
            if (curr >= 0) {
                if (!((piece === 5 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 11 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 1;
            if (Math.floor(id / 8) === Math.floor(curr / 8) && curr < 64) {
                if (!((piece === 5 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 11 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 1;
            if (Math.floor(id / 8) === Math.floor(curr / 8) && curr >= 0) {
                if (!((piece === 5 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 11 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 9;
            if (Math.floor(id / 8) + 1 === Math.floor(curr / 8) && curr < 64) {
                if (!((piece === 5 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 11 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id + 7;
            if (Math.floor(id / 8) + 1 === Math.floor(curr / 8) && curr < 64) {
                if (!((piece === 5 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 11 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 9;
            if (Math.floor(id / 8) - 1 === Math.floor(curr / 8) && curr >= 0) {
                if (!((piece === 5 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 11 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            curr = id - 7;
            if (Math.floor(id / 8) - 1 === Math.floor(curr / 8) && curr >= 0) {
                if (!((piece === 5 && (board[curr] >= 0 && board[curr] <= 5)) || (piece === 11 && (board[curr] >= 6 && board[curr] <= 11)))) {
                    moves.push(curr);
                }
            }
            if(piece === 5 && id === 60) {
                let K = document.getElementById('60').castling;
                let KR = document.getElementById('63').castling;
                let QR = document.getElementById('56').castling;
                let KEmpty = true;
                let QEmpty = true;
                for(let i = 61;i<63;i++){
                    if(this.board[i] != 12) {
                        KEmpty = false;
                        break;
                    }
                }
                for(let i = 57;i<60;i++){
                    if(this.board[i] != 12) {
                        QEmpty = false;
                        break;
                    }
                }
                if(K && KR && KEmpty) {
                    moves.push(id+2);
                }
                if(K && QR && QEmpty) {
                    moves.push(id-2);
                }
            }
            else if(piece === 11 && id === 4) {
                let k = document.getElementById('4').castling;
                let kr = document.getElementById('7').castling;
                let qr = document.getElementById('0').castling;
                let KEmpty = true;
                let QEmpty = true;
                for(let i = 1;i<4;i++){
                    if(this.board[i] != 12) {
                        KEmpty = false;
                        break;
                    }
                }
                for(let i = 5;i<7;i++){
                    if(this.board[i] != 12) {
                        QEmpty = false;
                        break;
                    }
                }
                if(k && kr && KEmpty) {
                    moves.push(id+2);
                }
                if(k && qr && QEmpty) {
                    moves.push(id-2);
                }
            }
        }
        // If you are in check, you can only make moves to put you out of check
        // If you are not in check, you can't make a move that puts you in check
        if(checks) {
            for(let i = 0;i<moves.length;i++) {
                let theoretical = board.slice();
                theoretical[id] = 12;
                theoretical[moves[i]] = piece;
                if(this.checkForChecks(this.turn, theoretical)) {
                    moves.splice(i, 1);
                    i--;
                }
            }
        }
        // Resets active squares
        if(realMove) {
            let squares = document.querySelectorAll('.square');
            for (let i = 0; i < 64; i++) {
                squares[i].classList.remove('active');
                squares[i].removeEventListener("click", this.movePieceCallback);
            }
            // Based on moves found for the selected piece will show active squares that the player move to
            for (let i = 0; i < 64; i++) {
                if (moves.includes(parseInt(squares[i].id))) {
                    squares[i].classList.add('active');
                    squares[i].addEventListener('click', this.movePieceCallback);
                }
            }
        }
        return moves;
    }

    movePieceCallback(e) {
        game.movePiece(e);
    }

    // Moves piece into possible active square. Also checks if location has an existing piece or is empty with respected response
    movePiece(e) {
        let squares = document.querySelectorAll('.square');
        let newID = e.currentTarget.id;
        let oldID = game.currentID;
        let piece = this.board[oldID];
        if (piece === 1 || piece === 5) {
            if(oldID === 63) {
                document.getElementById(oldID).castling = false;
            }
            else if(oldID === 56) {
                document.getElementById(oldID).castling = false;
            }
            else if(oldID === 60) {
                document.getElementById(oldID).castling = false;
            }
        }
        if (piece === 7 || piece === 11) {
            if(oldID === 0) {
                document.getElementById(oldID).castling = false;
            }
            else if(oldID === 7) {
                document.getElementById(oldID).castling = false;
            }
            else if(oldID === 4) {
                document.getElementById(oldID).castling = false;
            }
        }
        if (piece === 5 && newID - oldID === 2) {
            this.board[oldID] = 12;
            this.board[newID] = 5;
            this.board[newID - 1] = 1;
            this.board[63] = 12;
            for (let i = 0; i < 64; i++) {
                squares[i].classList.remove('active');
            }
            if(this.turn === 'w') {
                this.turn = 'b';
            }
            else {
                this.turn = 'w';
            }
            this.drawGame();
            return;
        }
        if (piece === 5 && oldID - newID === 2) {
            this.board[oldID] = 12;
            this.board[newID] = 5;
            this.board[newID + 1] = 1;
            this.board[56] = 12;
            for (let i = 0; i < 64; i++) {
                squares[i].classList.remove('active');
            }
            if(this.turn === 'w') {
                this.turn = 'b';
            }
            else {
                this.turn = 'w';
            }
            this.drawGame();
            return;
        }
        if (piece === 11 && newID - oldID === 2) {
            this.board[oldID] = 12;
            this.board[newID] = 11;
            this.board[newID - 1] = 7;
            this.board[7] = 12;
            for (let i = 0; i < 64; i++) {
                squares[i].classList.remove('active');
            }
            if(this.turn === 'w') {
                this.turn = 'b';
            }
            else {
                this.turn = 'w';
            }
            this.drawGame();
            return;
        }
        if (piece === 5 && newID - oldID === 2) {
            this.board[oldID] = 12;
            this.board[newID] = 11;
            this.board[newID + 1] = 7;
            this.board[0] = 12;
            for (let i = 0; i < 64; i++) {
                squares[i].classList.remove('active');
            }
            if(this.turn === 'w') {
                this.turn = 'b';
            }
            else {
                this.turn = 'w';
            }
            this.drawGame();
            return;
        }
        if (piece === 0 && Math.floor(newID / 8) === 0) {
            this.board[oldID] = 12;
            this.board[newID] = 4;
            for (let i = 0; i < 64; i++) {
                squares[i].classList.remove('active');
            }
            if(this.turn === 'w') {
                this.turn = 'b';
            }
            else {
                this.turn = 'w';
            }
            this.drawGame();
            return;
        }
        if (piece === 6 && Math.floor(newID / 8) === 7) {
            this.board[oldID] = 12;
            this.board[newID] = 10;
            for (let i = 0; i < 64; i++) {
                squares[i].classList.remove('active');
            }
            if(this.turn === 'w') {
                this.turn = 'b';
            }
            else {
                this.turn = 'w';
            }
            this.drawGame();
            return;
        }
        if(piece === 0 || piece === 6) {
            if(piece === 0 && document.getElementById(newID).enpassant) {
                this.board[newID] = 6;
                this.board[parseInt(newID)+8] = 12;
            }
            else if(piece === 6 && document.getElementById(newID).enpassant) {
                this.board[newID] = 0;
                this.board[parseInt(newID)-8] = 12;
            }
        }
        if (piece != 12) {
            if (this.board[newID] != 12) {
                this.drawCaptured(this.board[newID]);
                updateCapture(newID);
                this.board[oldID] = 12;
                this.board[newID] = piece;
                updateHistory(newID, piece, this.turn, 1, this.checkForChecks("w"), this.checkForChecks("b"));
            } else {
                this.board[oldID] = 12;
                this.board[newID] = piece;
                updateHistory(newID, piece, this.turn, 0, this.checkForChecks("w"), this.checkForChecks("b"));
            }
            for (let i = 0; i < 64; i++) {
                squares[i].classList.remove('active');
                squares[i].enpassant = false;
            }
            if(this.turn === 'w') {
                this.turn = 'b';
            }
            else {
                this.turn = 'w';
            }
            if(piece === 0 || piece === 6) {
                if(newID - oldID === 16) {
                    document.getElementById(oldID+8).enpassant = true;
                }
                else if(oldID - newID === 16) {
                    document.getElementById(oldID-8).enpassant = true;
                }
            }
            this.drawGame();
        }
    }

    // Checks if there is any check currently on the board
    checkForChecks(color, board = this.board) {
        let moves = [];
        if (color === 'w') {
            for(let i = 0; i<64; i++) {
                if(board[i] >= 6 && board[i] <= 11) {
                    moves = moves.concat(this.getMoves(i, false, false, board));
                }
            }
            if (moves.includes(board.indexOf(5))) {
                return true;
            }
        }
        else {
            for(let i = 0; i<64; i++) {
                if(board[i] >= 0 && board[i] <= 5) {
                    moves = moves.concat(this.getMoves(i, false, false, board));
                }
            }
            if (moves.includes(board.indexOf(11))) {
                return true;
            }
        }
        return false;
    }

    // Check for available moves to determine if the current player is in checkmate or stalemate
    countAvailableMoves() {
        let moves = [];
        if(this.turn == 'w') {
            for(let i = 0;i<64;i++) {
                if(this.board[i] >= 0 && this.board[i] <= 5) {
                    moves = moves.concat(this.getMoves(i, false, true));
                }
            }
        }
        else {
            for(let i = 0;i<64;i++) {
                if(this.board[i] >= 6 && this.board[i] <= 11) {
                    moves = moves.concat(this.getMoves(i, false, true));
                }
            }
        }
        return moves.length;
    }

    // Updates board on pieces that are captured
    drawCaptured(pieceCode) {
        const blackCap = document.querySelectorAll('.captured-area')[0];
        const whiteCap = document.querySelectorAll('.captured-area')[1];

        let par = document.createElement('p');
        par.innerHTML += this.pieces[pieceCode];

        if (pieceCode >= 0 && pieceCode <= 5) {
            blackCap.appendChild(par);
        }
        else if (pieceCode >= 6 && pieceCode <= 11) {
            whiteCap.appendChild(par);
        }
    }
}

let FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -"; // default chess layout
let row = ["8", "7", "6", "5", "4", "3", "2", "1"];
let col = ["a", "b", "c", "d", "e", "f", "g", "h"];
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
    console.log("No DATES - Using default value");
    dates = ["", "", "", ""];
}

let captured = [];
try {
    captured = localStorage.captured.split(",");
} catch (SyntaxError) {
    console.log("No captured - Using default value");
    captured = ["", "", "", ""];
}

let history = [[["", ""], ["", ""], ["", ""], ["", ""]],
[["", ""], ["", ""], ["", ""], ["", ""]],
[["", ""], ["", ""], ["", ""], ["", ""]],
[["", ""], ["", ""], ["", ""], ["", ""]]];
try {
    temp = localStorage.history.split(",");
    for (let i = 0; i < 16; i++) {
        let set = [temp[i * 2], temp[i * 2 + 1]];
        history[Math.floor(i / 4)][(i % 4)] = set;
    }
} catch (SyntaxError) {
    console.log("No history - Using default value");
}

// Initiate the main game where all saves/new games will be loaded onto
let game = new Game();
let selectedGame = 0; // default save slot
const saves = document.querySelectorAll(".save");
const moves = document.querySelectorAll(".move");
let tempCapture = "";
let tempHistory = [["", ""], ["", ""], ["", ""], ["", ""]];

function updateCapture(ID) {
    tempCapture += game.code[game.board[ID]];
}

function resetCapture(tempCapture) {
    let capArea = document.querySelectorAll(".captured-area");
    capArea.forEach((cap) => {
        cap.innerHTML = "";
    });
    if(!tempCapture == ""){
        for(char of tempCapture) {
            game.drawCaptured(game.code.indexOf(char));
        }
    }
}

// Make a move history of the last four moves from both players. (Chess Piece ex.(Q,K,R,*blank*(p))(x(if capture))(col)(row)(+(for checkmate)))
function updateHistory(newID, piece, turn, capture, whiteCheck, blackCheck) {
    let move = "";
    // If pawn, dont add piece at the front of the move history
    if (piece != 0 && piece != 6) {
        move += game.code[piece];
    }
    if (capture == 1) move += "x"; // Add x if capture
    let rowNew = row[Math.floor(newID / 8)];
    let colNew = col[newID % 8];
    move += colNew + rowNew;
    //Implement + when check make happens later
    // To save this moves in our tempHistory
    if (turn == "w") { // White turn
        if (blackCheck) move += "+";
        let full = 4;
        for (let i = 0; i < 4; i++) {
            if (tempHistory[i][0] == "") {
                tempHistory[i][0] = move;
                break;
            } else full--;
        }
        if (full == 0) {
            for (let i = 0; i < 3; i++) {
                tempHistory[i] = tempHistory[i + 1];
            }
            tempHistory[3] = [move, ""];
        }
    } else { // Black turn
        if (whiteCheck) move += "+";
        for (let i = 0; i < 4; i++) {
            if (tempHistory[i][1] == "") {
                tempHistory[i][1] = move;
                break;
            }
        }
    }

    changeHistoryDisplay();
}

function changeHistoryDisplay() {
    moves.forEach((move) => {
        let set = tempHistory[move.id.split("")[1]];
        move.innerHTML = set[0] + " - " + set[1];
    });
}
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
    selected.innerHTML = "Save " + (Number(selectedGame) + 1) + dates[selectedGame];
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
    save.innerHTML = "Save " + (Number(number) + 1) + dates[number];
});

function newGame() {
    // Creates a new game and starts a new game on the single board with default chess pieces placements
    delete game;
    game = new Game();
    game.loadGameFromFEN(FEN);
    game.drawGame();
    tempCapture = "";
    tempHistory = [["", ""], ["", ""], ["", ""], ["", ""]];
    resetCapture(tempCapture);
    changeHistoryDisplay();
}

function saveGame() {
    // Will save the game on the selected slot with time and chess piece locations saved in localStorage
    let date = new Date();
    let day = (date.getMonth() + 1) + "/" + (date.getDay() - 2);
    let time = ((date.getHours() - 1) % 12) + 1 + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + (date.getHours() > 12 ? "PM" : "AM");

    FENS[selectedGame] = game.saveGameToFEN();
    dates[selectedGame] = " - " + (day + " " + time);
    captured[selectedGame] = tempCapture;
    history[selectedGame] = tempHistory;

    localStorage.clear();
    localStorage.FENS = FENS; //FEN is saved in the list of FENS for future sessions
    localStorage.dates = dates; //date is saved in the list of dates for future sessions
    localStorage.captured = captured;
    localStorage.history = history;

    updateTime(); // Update the save slot display to show accurate time of save point
    changeActive(); // Make selected save the active save for the game

}

function loadGame() {
    // Will overwrite the current game with a new board that loads chess locations of selected save
    delete game;
    game = new Game();
    game.loadGameFromFEN(FENS[selectedGame]);
    tempCapture = captured[selectedGame];
    tempHistory = history[selectedGame];
    game.drawGame();
    changeActive(); // Make selected save the active save for the game
    resetCapture(tempCapture);
    changeHistoryDisplay();
}
