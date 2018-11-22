
//SKIN 0 IS THE DEFAULT; DELETION OF 0 SHOULD DESTROY THE MACHINE
var skinList = [0];
var boxH;


function newPack() {
    $("#skinAdding").show();
    drawX("xonskinlay");
}

function createElement() {
    
}
//sorts through the entire string
function createPack() {
    var colorpack = palette.slice();
    var packCode = document.getElementById("theNewCode").value;
    let lengoco = packCode.length;
    var codes = packCode.split("|");

    for (var x = 0; x < codes.length; x++) {
        var scn = codes[x].split(":");
        scn[0] = scn[0].trim();
        scn[1] = scn[1].trim();
        let c = scn[0];
        if (c == "I") {
            colorpack[0] = scn[1];
        }
        if (c == "T") {
            colorpack[1] = scn[1];
        }
        if (c == "Z") {
            colorpack[2] = scn[1];
        }
        if (c == "L") {
            colorpack[3] = scn[1];
        }
        if (c == "F") {
            colorpack[4] = scn[1];
        }
        if (c == "S") {
            colorpack[5] = scn[1];
        }
        if (c == "O") {
            colorpack[6] = scn[1];
        }
    }
    

    formContainer(colorpack);

}

//create the div
function formContainer(cholera) {

    //create the entire div first
    var ndiv = document.createElement("div");
    var newId = skinList[skinList.length - 1]  + 1
    var skinContain = document.getElementById("thingThatHoldsThisTogether");
    ndiv.setAttribute("id", String( newId ));

    skinList.push(newId);
    var editIn = document.getElementById(newId);

    // create the largest grid in the div
    var ndiv1 = document.createElement("div");
    ndiv1.setAttribute("style", "display:grid;grid-template-columns:24% 58% 14%; grid-column-gap:2%;height:100%;");
    
    // form the left grid at 33 33 33, place p tag in that grid
    var ndiv2 = document.createElement("div");
    ndiv2.setAttribute("style", "display:grid; grid-template-rows:40% 10% 40%; grid-row-gap:5%;");
    var filler = document.createElement("div");
    ndiv2.appendChild(filler);
    var nTextNode = document.createTextNode(document.getElementById("theName").value);
    var prre = document.createElement("p");
    prre.setAttribute("style","margin:0px;padding:0px 0px 0px 5px;");
    prre.appendChild(nTextNode);
    ndiv2.appendChild(prre);

    // form center CANVAS; second 25 has 5 colors, 3rd has 2
    var ndiv3 = document.createElement("div");
    var ndiv3ca = document.createElement("canvas");
    ndiv3ca.setAttribute("height","100");
    ndiv3ca.setAttribute("width","200");
    ndiv3ca.setAttribute("style","margin-left:70px;");
    // ndiv3ca.setAttribute("padding","0");
    ndiv3.appendChild(ndiv3ca);
    // form right grid at 50 50; top is an x, bottom is an equip
    ndiv1.appendChild(ndiv2);
    ndiv1.appendChild(ndiv3);
    ndiv.appendChild(ndiv1);
    skinContain.appendChild(ndiv);
    console.log(boxH);
    changeTo(0.2);
}



