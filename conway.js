const grid = document.getElementById('grid');
// const NUM_COLS = Math.floor(window.innerWidth / 26);
// const NUM_ROWS = Math.floor(window.innerHeight / 26);

// const gridContainer = grid.parentElement;
// const NUM_COLS = Math.floor(gridContainer.offsetWidth / 26);
// const NUM_ROWS = Math.floor(gridContainer.offsetHeight / 26);

let { width: gridWidth, height: gridHeight } = innerDimensions(grid);
const CELL_SIZE = 26;
const NUM_COLS = Math.floor(gridWidth / CELL_SIZE);
const NUM_ROWS = Math.floor(gridHeight / CELL_SIZE);
// const NUM_COLS = 45;
// const NUM_ROWS = 25;
const NUM_CELLS = NUM_ROWS * NUM_COLS;

function initGrid() {
    grid.innerHTML = '';
    // grid-template-columns: repeat(40, 25px);
    grid.style.setProperty("grid-template-columns",
        "repeat(" + NUM_COLS + ", " + CELL_SIZE + "px)");
    for (var idx = 0; idx < NUM_CELLS; idx++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        grid.appendChild(cell);
    }
}

function createRandomModel() {
    const model = [];
    for (var idx = 0; idx < NUM_CELLS; idx++) {
        const alive = Math.random() > 0.7;
        model.push(alive);
    }

    return model;
}

function renderModel(model) {
    const grid = document.getElementById('grid');
    for (var idx = 0; idx < NUM_CELLS; idx++) {
        if (model[idx]) {
            grid.children[idx].classList.add("alive");            
        } else {
            grid.children[idx].classList.remove("alive");
        }
    }
}

function iterateModel(model) {
    const nextModel = [];
    for (var idx = 0; idx < NUM_CELLS; idx++) {
        const numNeighbors = liveNeighbors(model, idx);
        const currAlive = model[idx];
        var nextAlive;
        if (currAlive) {
            nextAlive = numNeighbors === 2 || numNeighbors === 3;
        } else {
            nextAlive = numNeighbors === 3;
        }
        nextModel.push(nextAlive);
    }
    return nextModel;
}

function liveNeighbors(model, idx) {
    var neighborIdcs = [];
    // left
    if (idx % NUM_COLS != 0) {
        neighborIdcs.push(idx - 1);
        neighborIdcs.push(idx - NUM_COLS - 1);
        neighborIdcs.push(idx + NUM_COLS - 1);
    }
    // right
    if (idx % NUM_COLS != NUM_COLS - 1) {
        neighborIdcs.push(idx + 1);
        neighborIdcs.push(idx - NUM_COLS + 1);
        neighborIdcs.push(idx + NUM_COLS + 1);
    }
    // up
    neighborIdcs.push(idx - NUM_COLS);
    // down
    neighborIdcs.push(idx + NUM_COLS);
    neighborIdcs = neighborIdcs.filter(function(value) {
        return value >= 0 && value < NUM_CELLS;
    });
    return neighborIdcs.reduce(function(count, curr) {
        if (model[curr]) {
            return count + 1;
        } else {
            return count;
        }
    }, 0);
}

function innerDimensions(node) {
    var computedStyle = getComputedStyle(node)
  
    let width = node.clientWidth // width with padding
    let height = node.clientHeight // height with padding
  
    height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
    width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
    return { height, width }
}

(function() {
    var timer = null;
    
    let b = document.getElementById("startStopButton");
    let sp = document.getElementById("speedSlider");
    let sd = document.getElementById("speedDisplay");
    let speed = sp.value;

    b.addEventListener("click", function(event) {
        if (timer == null) {
            let speed = sp.value;
            timer = window.setInterval(doGeneration, speed);
            b.innerText = "Stop";
        } else {
            window.clearInterval(timer);
            timer = null;
            b.innerText = "Start";
        }
    });

    sd.value = sp.value + " ms";
    sp.addEventListener("input", function(event) {
        let speed = sp.value;
        sd.value = speed + " ms";
        if (timer) {
            window.clearInterval(timer);
            timer = window.setInterval(doGeneration, speed);
        }
    });

    initGrid();
    var model = createRandomModel();
    renderModel(model);

    let cells = document.getElementsByClassName("cell");
    for (let i=0, cell; cell = cells[i]; i++) {
        cell.addEventListener('click', function(event) {
            model[i] = !model[i];
            renderModel(model);
        });
    }

    function doGeneration() {
        model = iterateModel(model);
        renderModel(model);
    }
    
    timer = window.setInterval(doGeneration, speed);
})();