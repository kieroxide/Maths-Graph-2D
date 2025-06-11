let canvas;

let ctx;


let graph = new Graph();
graph.addVertex();
graph.addVertex();
//edges and vertices for testing

const vertices = [
  { x: 100, y: 100 },
  { x: 300, y: 100 },
  { x: 500, y: 100 },
  { x: 200, y: 250 },
  { x: 400, y: 250 },
  { x: 300, y: 400 }
];

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

function setup(){
    canvas = document.getElementById('graphCanvas');
    ctx = canvas.getContext('2d');
}

function draw(){
    graph.draw();
    requestAnimationFrame(draw);
}

setup();
draw();