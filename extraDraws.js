

function drawX(idhere) {
    let canva = document.getElementById(idhere);
    let ctx = canva.getContext("2d");
    let wid = canva.width;
    let heid = canva.height;
    let shortest;
    if (wid < heid) {
        shortest = wid;
    }
    else {
        shortest = heid;
    }
    ctx.lineWidth = .03 * shortest;
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(.1 * wid, .1 * heid);
    ctx.lineTo(.9 * wid, .9 * heid);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(.9 * wid, .1 * heid);
    ctx.lineTo(.1 * wid, .9 * heid);
    ctx.stroke();
}

