let canvas;
let ctx;
let graph = new Graph();
let sweetSpot = graph.vertexRadius * 5;


graph.addVertex();
graph.addVertex();
//edges and vertices for testing


const edges = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 6 },
    { from: 4, to: 7 },
    { from: 5, to: 8 },
    { from: 6, to: 9 },
    { from: 7, to: 10 },
    { from: 8, to: 11 },
    { from: 9, to: 11 },
    { from: 10, to: 0 },
    { from: 2, to: 6 },
    { from: 3, to: 8 }
];

getVerticesAndEdges()
graph.assignNeighbours();
graph.groups = Math2D.bfs(graph, 1);

function setup(){
    canvas = document.getElementById('graphCanvas');
    ctx = canvas.getContext('2d');
}

function draw(){
    graph.draw();
    requestAnimationFrame(draw);
}

function getVerticesAndEdges(){
    let VERTICES = 11;
    for(let i = 0; i < VERTICES; i++){
        graph.addVertex();
    }
    for(const edge of edges){
        graph.addEdge(edge.from, edge.to);
    }
}

function addEdgeFromInputs() {
    const id1 = parseInt(document.getElementById('id1').value);
    const id2 = parseInt(document.getElementById('id2').value);
    if (!isNaN(id1) && !isNaN(id2)) {
        graph.addEdge(id1, id2);
        graph.groups = Math2D.bfs(graph, 1);
    }
}

setup();
draw();