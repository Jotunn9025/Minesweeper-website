let cond=true;
document.addEventListener("DOMContentLoaded", (event) => {
    let newGame = document.getElementById("newgame");
    newGame.onclick = () => {
        location.reload();
    };
    genrandomboard();
    document.querySelector('.board').addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });
    let flagimg=document.getElementById("flagicons");
    let toggleButton=document.getElementById("toggle-flag")
    toggleButton.addEventListener("click",()=>{
        if (cond==true)
            flagimg.style.display="block";
        else
            flagimg.style.display="none";
        cond=!cond;
    })
    for(tilesa=1;tilesa<=256;tilesa++){
        let tileclick=document.getElementById("tile"+tilesa);
        tileclick.addEventListener("click",(event)=>{
            if(cond==true&&!tileclick.classList.contains("flagged"))
            reveal(tileclick);
            else if(cond==false && tileclick.classList.contains("hide"))
                flag(tileclick);
        })
    }
});

let numRows = 16;
let numCols = 16;
let numMines = 30;

function genrandomboard() {
    for (let clear = 1; clear <= 256; clear++) {
        let clearTile = document.getElementById("tile" + clear);
        clearTile.textContent = '';
        clearTile.classList.remove("one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "mine");
        clearTile.classList.add("tileText", "hide");
    }

    let mineList = [];

    while (mineList.length < numMines) {
        let mine = Math.floor(Math.random() * (numRows * numCols)) + 1;
        if (mineList.indexOf(mine) === -1) {
            mineList.push(mine);
        }
    }
    
    for (let i = 1; i <= numRows; i++) {
        for (let j = 1; j <= numCols; j++) {
            let tileNum = (i - 1) * numCols + j;
            let tile = document.getElementById("tile" + tileNum);
            if (mineList.includes(tileNum)) {
                tile.classList.add("mine");
            } else {
                let minesNearby = countMinesNearby(i, j, mineList);
                if (minesNearby > 0) {
                    tile.textContent = minesNearby;
                    assignColor(tile, minesNearby);
                }
            }
        }
    }
}

function countMinesNearby(row, col, mineList) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i === 0 && j === 0)) {
                let neighborRow = row + i;
                let neighborCol = col + j;
                if (neighborRow < 1 || neighborRow > numRows || neighborCol < 1 || neighborCol > numCols) {
                    continue;
                }
                if (col % numCols === 1 && j === -1) {
                    continue;
                }
                if (col % numCols === 0 && j === 1) {
                    continue;
                }
                let tileNum = (neighborRow - 1) * numCols + neighborCol;
                if (mineList.includes(tileNum)) {
                    count++;
                }
            }
        }
    }
    return count;
}

function assignColor(tile, minesNearby) {
    switch (minesNearby) {
        case 1:
            tile.classList.add("one");
            break;
        case 2:
            tile.classList.add("two");
            break;
        case 3:
            tile.classList.add("three");
            break;
        case 4:
            tile.classList.add("four");
            break;
        case 5:
            tile.classList.add("five");
            break;
        case 6:
            tile.classList.add("six");
            break;
        case 7:
            tile.classList.add("seven");
            break;
        case 8:
            tile.classList.add("eight");
            break;
        default:
            break;
    }
}

function reveal(tile) {
    if (tile.classList.contains('flagged')) {
        return;
    }
    if (!tile.classList.contains("hide")) {
        return;
    }

    let tileNum = parseInt(tile.id.substring(4));
    let row = Math.ceil(tileNum / numCols);
    let col = tileNum % numCols || numCols;

    if ( tile.textContent !== '') {
        tile.classList.remove("hide");
        return;
    }
    else if(tile.classList.contains("mine"))
        {
        let message = document.createElement('div');
        message.textContent = "Oops! You've hit a mine. Game over!";
        message.classList.add("message");
        let button = document.createElement('button');
        button.textContent = "OK";
        button.onclick = () => {
            location.reload();
        };
        message.appendChild(button);
        document.body.appendChild(message);
        return;
    
        }

    tile.classList.remove("hide");
    tile.style.backgroundColor="lightgray";
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let neighborRow = row + i;
            let neighborCol = col + j;
            if (neighborRow < 1 || neighborRow > numRows || neighborCol < 1 || neighborCol > numCols) {
                continue;
            }

            let neighborTileNum = (neighborRow - 1) * numCols + neighborCol;
            let neighborTile = document.getElementById("tile" + neighborTileNum);
            reveal(neighborTile);
        }
    }
}

let correctFlags = 0;

function flag(tile){
    if(tile.classList.contains("flagged")) {
        tile.classList.remove("flagged");
        if (tile.classList.contains("mine")) {
            correctFlags--;
        }
    } else {
        tile.classList.add("flagged");
        if (tile.classList.contains("mine")) {
            correctFlags++;
        }
    }
    checkWin();
}

function checkWin() {
    if (correctFlags === numMines) {
        let message = document.createElement('div');
        message.textContent = "Congratulations! You've won!";
        message.classList.add("message");
        let button = document.createElement('button');
        button.textContent = "OK";
        button.onclick = () => {
            location.reload();
        };
        message.appendChild(button);
        document.body.appendChild(message);
    }
}
