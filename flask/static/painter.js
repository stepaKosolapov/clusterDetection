let svgNS = "http://www.w3.org/2000/svg";
let emptyColor = '#fff';
let fullColor = 'rgb(7, 148, 61)';
let brushColor = fullColor;

let isBrushDown = false;

window.onmousedown = ()=>{
    isBrushDown = true;
}

window.onmouseup = ()=>{
    isBrushDown = false;
}

function _drawGrid(_rows, _cols, _cellWidth=10, _cellHeight=10, _gap=1) {
    let gap = _gap;
    let rows = _rows;
    let cols = _cols;

    let cellWidth = _cellWidth;
    let cellHeight = _cellHeight;

    let areaWidth = cols*cellWidth + (cols-1)*gap;
    let areaHeight = rows*cellHeight + (rows-1)*gap;
    let drawingArea = document.querySelector('.drawing_area');
    drawingArea.setAttribute('width', areaWidth);
    drawingArea.setAttribute('height', areaHeight);
    drawingArea.setAttribute('viewBox', '0 0 '+ areaWidth + ' ' + areaHeight);

    for (let m = 0; m < rows; m++) {
        for (let n = 0; n < cols; n++) {
            let cell = document.createElementNS(svgNS, 'rect');
            cell.setAttributeNS(null, 'x', n * (cellWidth + gap));
            cell.setAttributeNS(null, 'y', m * (cellHeight + gap));
            cell.setAttributeNS(null, 'width', cellWidth);
            cell.setAttributeNS(null, 'height', cellHeight);
            cell.setAttributeNS(null, 'fill', emptyColor);
            drawingArea.appendChild(cell);
            cell.onmousemove = ()=>{
                if (isBrushDown){
                    cell.setAttributeNS(null, 'fill', brushColor);
                }
            };
            cell.onclick = ()=>{
                if (!isBrushDown){
                    cell.setAttributeNS(null, 'fill', brushColor);
                }
            }; 
        }
    }
}

function changeBrushColor(newColor){
    brushColor = newColor;
}

function reload() {
    document.querySelector('.drawing_area').innerHTML = '';
    let _rows = 10
    let _cols = _rows;
    let _cellWidth = parseInt(document.querySelector('#cell_size_indicator').textContent);
    let _cellHeight = _cellWidth;
    let _gap = 1;
    _drawGrid(_rows, _cols, _cellWidth, _cellHeight, _gap);
}

function clustering() {
    let cells = document.querySelectorAll('.drawing_area > rect');
    let vector = [];
    for (let cell of cells){
        vector.push(cell.getAttribute('fill') == fullColor ? 1 : 0);
    }
    let json = JSON.stringify({'vector': vector})
    let request = new XMLHttpRequest();
    request.open("POST", "/clustering");
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            let distances = JSON.parse(request.responseText)['distances'];
            let cluster = 0;
            let min_dist = Number.MAX_VALUE;
            for (let i = 0; i < distances.length; i++){
                if (distances[i] < min_dist) {
                    cluster = i;
                    min_dist = distances[i];
                }
            }
            document.querySelector('#output').innerHTML = cluster;
        }
    }
    request.send(json);
}

document.querySelector('#cell_size_indicator').textContent = document.querySelector('#cell_size').value;

reload();
