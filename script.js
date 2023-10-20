const board = document.querySelector(".chess-board");

//Create chess board pattern
for(let i = 0;i<8;i++) {
    for(let j=0;j<8;j++) {
        if((i+j)%2!=0){
            board.innerHTML += `<div class="square black" id="${i}-${j}"></div>`
        }
        else {
            board.innerHTML += `<div class="square white" id="${i}-${j}"></div>`
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
}

const something = new Pawn("black", "1-3");
console.log(something.availableSquares())