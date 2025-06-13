let canvas;
let ctx;
let graph = new Graph();
let sweetSpot = 250;


graph.addVertex();
graph.addVertex();
//edges and vertices for testing


const edges = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 0, to: 3 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 4 },
    { from: 3, to: 5 },
    { from: 4, to: 5 }
];
getVerticesAndEdges()

function setup(){
    canvas = document.getElementById('graphCanvas');
    ctx = canvas.getContext('2d');
}

function draw(){
    graph.draw();
    console.log(graph);
    requestAnimationFrame(draw);
}

function getVerticesAndEdges(){
    let VERTICES = 10;
    for(let i = 0; i < VERTICES; i++){
        graph.addVertex();
    }
    for(const edge of edges){
        graph.addEdge(edge.from, edge.to);
    }
}
setup();
draw();