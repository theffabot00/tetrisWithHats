/*
* for any viewers that arent me: i use jquery in conjunction with this file
* second project with js, first with jquery, honestly havent read a tutorial, just know bits and pieces
* probably not making things as efficient as possible whoops
*
*/


var board;
var gameState = 0;
var updatePhase;
var redrawBoard;
var updateSpeed = 500;
var brickSize = 100;
var lastPressedButton = "nil";
var lastClickedButton = "nil";
var boardsizeX = 10;
var boardsizeY = 20;
var totalClears = 0;
var palette = ["#FF0000","#3aff20","#FFFF00","#ff38cd","#820dcf","rgb(255,178,0)","#00a9f7"];

var canvas;
var cntx;


class brick {
    constructor(col,xco,yco) {
        this.x = parseInt(xco);
        this.y = parseInt(yco);
        this.c = col;
    }
}

/* Map making!
*construct all the shapes and give them the ability to rotate
*this gets rather messy
*shapes all start in their flattest form (this means one rotate at the top will kill them if possible)
* pn is short for paint (color)
*/
class shape {
    constructor(typ,xco,yco) {
        this.pn;
        this.x = xco;
        this.y = yco;
        this.fall = true;
        if (typ == "I") {
            this.pn = palette[0];
            this.map = [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,0,0],
                [new brick(this.pn,xco,yco),new brick(this.pn,xco,yco),new brick(this.pn,xco,yco),new brick(this.pn,xco ,yco)]
            ];
        }
        if (typ == "T") {
            this.pn = palette[1];
            this.map = [
                [0,0,0,0],
                [0,0,0,0],
                [0,new brick(this.pn,xco, yco ), 0, 0],
                [new brick(this.pn,xco,yco), new brick(this.pn,xco,yco), new brick(this.pn,xco ,yco), 0 ]
            ];
        }
        if (typ == "Z") {
            this.pn = palette[2];
            this.map = [
                [0,0,0,0],
                [0,0,0,0],
                [new brick(this.pn, xco, yco) , new brick(this.pn, xco, yco),0,0],
                [0,new brick(this.pn, xco , yco), new brick(this.pn, xco , yco), 0]
            ];
        }
        if (typ == "L") {
            this.pn = palette[3];
            this.map = [
                [0,0,0,0],
                [0,0,0,0],
                [0,0,new brick(this.pn, xco, yco),0],
                [new brick(this.pn,xco,yco),new brick(this.pn,xco,yco),new brick(this.pn,xco,yco), 0]
            ];
        }
        if (typ == "F") {
            this.pn = palette[4];
            this.map = [
                [0,0,0,0],
                [0,0,0,0],
                [new brick(this.pn,xco,yco),0,0,0],
                [new brick(this.pn,xco,yco),new brick(this.pn,xco,yco),new brick(this.pn,xco,yco),0]
            ];
        }
        if (typ == "S") {
            this.pn = palette[5];
            this.map = [
                [0,0,0,0],
                [0,0,0,0],
                [0,new brick(this.pn,xco,yco),new brick(this.pn,xco,yco),0],
                [new brick(this.pn,xco,yco),new brick(this.pn,xco,yco),0,0]
            ];
        }
        if (typ == "O") {
            this.pn = palette[6];
            this.map = [
                [0,0,0,0],
                [0,0,0,0],
                [new brick(this.pn,xco,yco),new brick(this.pn,xco,yco),0,0],
                [new brick(this.pn,xco,yco),new brick(this.pn,xco,yco),0,0]
            ];
        }
        this.fixbody();

    }
    fixbody() {
        for(var xn = 0; xn != 4; xn++) {
            var newx = Math.abs(xn - 3);
            for(var yn = 0; yn != 4; yn++) {
                if (this.map[yn][xn] != 0) {
                    this.map[yn][xn].x = this.x + xn * brickSize;
                    this.map[yn][xn].y = this.y + (yn - 4)  * brickSize;
                

                }
            }

        }
    }
    rotateClockwise() {
        var newMap = [
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ];
        for(var xn = 0; xn != 4; xn++) {
            for(var yn = 3; yn != -1; yn--) {
                newMap[xn][Math.abs(yn - 3)] = this.map[yn][xn]; 
            }
        }
        this.map = pushldown(newMap).slice();
        this.fixbody();
    }
    rotateCClockwise() {
        for (var i = 0; i < 3; i++) {
            this.rotateClockwise();
        }
    }
    drawShape() {
        for(var xn = 0; xn != 4; xn++) {
            for(var yn = 0; yn != 4; yn++) {
                if (this.map[xn][yn] != 0) {
                    // cntx.fillStyle = "#F0FFFF";
                    // cntx.fillRect(this.map[xn][yn].x ,this.map[xn][yn].y ,brickSize ,brickSize );
                    cntx.fillStyle = this.pn;
                    cntx.fillRect(this.map[xn][yn].x + 2,this.map[xn][yn].y + 2,brickSize - 4,brickSize - 4);

                }
            }
        }
    }
    cfFall() {
        if (this.fall == true) {
            if (this.y == 2000) {
                this.fall = false;
            }
            var blanks = [];
            for(var exo = 0; exo != 4; exo++) {
                if (this.map[3][exo] != 0) {
                    blanks[exo] = 0;
                }
                else {
                    if (this.map[2][exo] != 0) {
                        blanks[exo] = (-1) ;    //really wonky code; it shoudl tell you how many spaces forward or backward the empty tile is from the last solid tile
                    }
                    if (this.map[1][exo] != 0) {
                        blanks[exo] = -2;
                    }
                }           
            }
            let shax = this.x/(brickSize);
            let shay = this.y/(brickSize);
            let num = 0;
            try {
                while (blanks[num] != undefined && board.map[blanks[num] + shay][shax + num ] != undefined) {

                    if (board.map[blanks[num] + shay][shax + num ] != 0) {
                        this.fall = false;
                    }
                    


                    num++;
                }
            }
            catch {
                //do nothing
            }
        }
    }
}

class Board {
    constructor(anx,ay) {
        this.map = new Array(ay);
        var box = []
        for (var ele = 0; ele < anx; ele++) {
            box.push(0);
        }
        for (var arra = 0; arra < ay; arra++) {
            this.map[arra] = box.slice();
        }
        
    }
    clearRow() {
        for (var yn = 0; yn < boardsizeY; yn++) {
            var clearable = true;
            for (var xn = 0; xn < boardsizeX; xn++) {
                if (typeof this.map[yn][xn] == "number") {
                    clearable = false;
                }
            }
            if (clearable) {
                var temp = yn;
                while (this.map[yn-1] != undefined) {
                    this.map[yn] = this.map[yn - 1];
                    yn--;
                }
                yn = temp;
                totalClears++;
                document.getElementById("cleared").innerHTML = "Rows Cleared: " + totalClears;
            }
            for (var hhh = 0; hhh < boardsizeX; hhh++) {
                this.map[0].push(0);
            }
        }
    }
}



function pushldown(ary2) { //push the entire shape to the bottom left NOTE: XCO AND YCO VALUES ARE UNCHANGED
    var crate = ary2
    while(crate[3][0] == 0 &&crate[3][1] == 0 &&crate[3][2] == 0 &&crate[3][3] == 0 ) {
        crate[3] = crate[2];
        crate[2] = crate[1];
        crate[1] = crate[0];
        crate[0] = [0,0,0,0];
    }
    while(crate[0][0] == 0 && crate[1][0] == 0 && crate[2][0] == 0 && crate[3][0] == 0) {
        for(var yn = 0; yn != 4; yn++) {
            for(var xn = 1; xn != 4; xn++) {
                crate[yn][xn-1] = crate[yn][xn];
            }
            crate[yn][3] = 0;
        }
    }
    return(crate);
}

var nextPiece = new shape("Z",500,200);
var droppingPiece = new shape("F", 200,200);


$(document).ready(function() {
    canvas = document.getElementById("game");
    cntx = canvas.getContext("2d");
    hideAll();
    $("#homeMenu").show();
    boxH = $("#defaultTPack").height();
});

function createNewColor() {

}

$(document).on("keydown", function(e) {
    if (gameState == 1) {
        var pressed = e.which;
        if (pressed == 68 || pressed == 39) {
            lastPressedButton = "R";
        }
        if (pressed == 65 || pressed == 37) {
            lastPressedButton = "L";
        }
        if (pressed == 83 || pressed == 40) {
            lastPressedButton = "D";
        }
    }
});

$(document).on("mousedown", function(e) {
    if (gameState == 1) {

        switch (e.which) {
            case 1 : 
                lastClickedButton = "C";
                break;
            case 3 :
                lastClickedButton = "CC";
                break;
            default:
                lastClickedButton = "nil";
                break;
        }
    }
});

function changeTo(scrn) {
    hideAll();
    if (scrn == 1) {
        $("#gameBoard").show();
        fixGamePosition();
        $(window).resize(function() {
            fixGamePosition();
        });
    }
    if (scrn == 0.2) {
        $("#skins").show();
    }
}

function fixGamePosition() {
    let h = window.innerHeight;
    let headerheight = (document.getElementById("titllle").style.clientHeight) + 20;
    let futuregmh = h - headerheight;
    h = 0.7 * h;
    let w = h/2;
    h = String(h) + "px";
    document.getElementById("game").style.height = h;

    let gridwid = document.getElementById("gmHold").clientWidth
    let lmargin = String(gridwid/2 - w/2) + "px";
    document.getElementById("game").style.marginLeft = lmargin;
}


function hideAll() {
    $("#homeMenu").hide();
    $("#gameBoard").hide();
    $("#death").hide();
    $("#skins").hide();
    $("#skinAdding").hide();
}

function beginGame() {
    $("#begin").hide();
    updatePhase = setInterval(pieceDrop, updateSpeed);
    redrawBoard = setInterval(draw,10);
    board = new Board(10,20);
    gameState = 1;
}

function pieceDrop() {
    if (gameState == 1) {
        if (droppingPiece.fall) {
            console.log("mhmh");
            canDrop();
        }
        if (!droppingPiece.fall) {
            if (droppingPiece.y < 300) {
                console.log("DIE, INSECT");
                gameState = 2;
                deathScreen();
            }
            var shax = droppingPiece.x/brickSize;
            var shay = droppingPiece.y/brickSize;
            for (var yn = 0; yn != 4; yn++) {
                for (var xn = 0; xn != 4; xn++) {
                    if (droppingPiece.map[yn][xn] != 0) {

                        board.map[shay + yn-4][shax + xn] = droppingPiece.map[yn][xn];
                    }
                }
            }
            setNextPiece();
            board.clearRow();
        }
        if (updateSpeed > 250) {
            updateSpeed -= 1;
            clearInterval(updatePhase)
            updatePhase = setInterval(pieceDrop,updateSpeed);
        }
    }
}

function canMoveLeft() {
    var obscox = droppingPiece.x/brickSize;
    var obscoy = (droppingPiece.y/brickSize) - 1;
    var heit = heidOPie(droppingPiece);
    var xs = []
    for (var yn = 3; yn != 3 - heit; yn-- ) {
        for (var xn = 0; xn != 4; xn++) {
            if (droppingPiece.map[yn][xn] != 0) {
                xs.push(xn - 1);
                break;
            }
        }
    }
    for (var coun = 0; coun != xs.length; coun++) {
        if (board.map[obscoy - coun][obscox + xs[coun]] != 0) {
            return(false);
        }
    }
    return(true);
}

function canMoveRight() {
    var indxx = droppingPiece.x/brickSize;
    var indxy = (droppingPiece.y/brickSize) - 1;
    var shiftBy = [];
    var wid = wIdOPie(droppingPiece.map);
    var heid = heidOPie(droppingPiece);
    // loop through the shape, look for how far indentations from the left column are
    for (var yn = 3; yn != 3 - heid; yn--) {
        for (var xn = 3; xn != -1; xn--) {
            if (droppingPiece.map[yn][xn] != 0) {
                shiftBy.push(xn + 1);
                break;
            }
        }
    }
    for (var coun = 0; coun != shiftBy.length; coun++) {
        if (board.map[indxy - coun][indxx + shiftBy[coun]] != 0) {
            return(false);
        }
    }
    console.log(shiftBy);
    return(true);
}

function canDrop() {
    var bascordx = droppingPiece.x/brickSize;
    var bascordy = (droppingPiece.y/brickSize) - 1;
    var holes = []
    for (var xn = 0; xn != 4; xn++) {
        for (var yn = 3; yn != -1; yn--) {
            if (droppingPiece.map[yn][xn] != 0) {
                holes.push((yn-3) + 1);
                break;
            }
        }
    }
    for (var coun = 0; coun != holes.length; coun++) {
        if (board.map[bascordy + holes[coun] ][bascordx + coun] != 0) {
            droppingPiece.fall = false;
            return(false);
        }
    }
    droppingPiece.y += brickSize;
    droppingPiece.fixbody();
    return(true);
}
function pboard() {
    for (var yn = 0; yn < boardsizeY; yn++) {
        console.log(board.map[yn]);
    }
    console.log("-----------");
}

function draw() {
    //REFRESH CANVAS

    cntx.fillStyle = "#F0FFFF";
    cntx.fillRect(0,0,1000,2000);
    //UPDATE ORENTATION
    if (lastPressedButton == "L" && droppingPiece.x > 0 ) {
        if (canMoveLeft()) {
            droppingPiece.x -= brickSize;
            droppingPiece.fixbody();
        }
        lastPressedButton = "nil";
    }
    if (droppingPiece.fall) {
        var width = wIdOPie(droppingPiece.map);
        cIfOut(width);
    }
    
    if (lastPressedButton == "R" && droppingPiece.x + brickSize * width < 1000 ) {
        if (canMoveRight()) {
            droppingPiece.x += brickSize;
            droppingPiece.fixbody();
        }
        lastPressedButton = "nil";
    }
    try {
        if (lastPressedButton == "D") {
            canDrop();
            lastPressedButton = "nil";
        }
    }
    catch(TypeError) {
        droppingPiece.fall = false;
    }
    if (lastClickedButton == "C" && droppingPiece.fall) {
        droppingPiece.rotateClockwise();
        lastClickedButton = "nil";
        
    }
    if (lastClickedButton == "CC"&& droppingPiece.fall) {
        droppingPiece.rotateCClockwise();
        lastClickedButton = "nil";
    }
    if (droppingPiece.fall) {
        droppingPiece.drawShape();
        droppingPiece.cfFall();
    }
    for (var yn = 0; yn < boardsizeY; yn++) {
        for(var xn = 0; xn < boardsizeX; xn++) {
            if (board.map[yn][xn] != 0) {
                var abr = board.map[yn][xn];
                cntx.fillStyle = "#F0FFFF";
                cntx.fillRect(xn * brickSize , yn * brickSize ,brickSize ,brickSize );
                cntx.fillStyle = abr.c;
                cntx.fillRect(xn * brickSize + 2, yn * brickSize + 2, brickSize - 4, brickSize - 4 );
            }
        }
    }
    droppingPiece.drawShape();
}

function wIdOPie(tbric) {
    var horizontallop = 0;
    if (tbric[3][2] != 0 || tbric[2][2] != 0) {
        horizontallop = 3;
    }
    if (tbric[3][2] == 0 &&tbric[2][2] == 0) {
        horizontallop = 2;
    }
    if (tbric[3][3] != 0) {
        horizontallop = 4;
    }
    if (tbric[3][1] == 0 &&tbric[2][1] == 0&&tbric[1][1] == 0) {
        horizontallop = 1;
    }
    return(horizontallop);
}

function heidOPie(tbric) {
    var heid = 4;
    for (var yn = 0;yn != 4; yn++) {
        if (tbric.map[yn][0] == 0 &&tbric.map[yn][1] == 0 &&tbric.map[yn][2] == 0 &&tbric.map[yn][3] == 0 ) {
            heid = 4 - yn;
        }
    }
    return(heid);
}

function cIfOut(oldval) {
    if (droppingPiece.x + (wIdOPie(droppingPiece.map) * 100) > (boardsizeX * brickSize)) {
        var oldx = droppingPiece.x
        droppingPiece.x -= (wIdOPie(droppingPiece.map) - oldval + 1) * 100;
        droppingPiece.fixbody();
    }
}

function setNextPiece() {
    var npiece =Math.floor(Math.random() * 7)
    var possibles = ["I","T","Z","L","F","S","O"];
    droppingPiece = Object.assign(nextPiece)
    nextPiece = new shape(possibles[npiece],0,-200);
    var canva = document.getElementById("nextPiece");
    var cntaxed = canva.getContext("2d");
    cntaxed.fillStyle = "#F0FFFF";
    cntaxed.fillRect(0,0,150,75);
    for(var y = 1; y !=4; y++) {
        for(var x = 0; x != 4; x++) {
            if (nextPiece.map[y][x] != 0) {
                cntx.fillStyle = "#F0FFFF";
                cntx.fillRect((x * 25) + 50 ,(y * 25)-50 ,25 ,25 );
                cntaxed.fillStyle= nextPiece.pn;
                cntaxed.fillRect((x * 25 - 1) + 50, (y * 25 - 1)-50, 23, 23);
            }
        }
    }
    nextPiece = new shape(possibles[npiece],400,200);
}

//death screen stuff
function deathScreen() {
    clearInterval(updatePhase);
    clearInterval(redrawBoard);
    console.log("shoudl erase upphase n boarddraws");
    $("#death").show();
    drawX("xbut");
}





//args string and either warn or debug
function outputLog(sin,typ) {
    var date = new Date();
    var hr = date.getHours();
    var min = date.getMinutes();
    var s = date.getSeconds();
    var ms = date.getMilliseconds();
    var time = "[" + hr + ":" + min + ":" + s + ":" + ms + "]";
    var col;
    if (typ = "warn") {
        col = "[WRN]";
    }
    if (typ = "debug") {
        col = "[DBG]";
    }
    let strin = time + " " + col + " " + sin
    console.log(strin);
}


