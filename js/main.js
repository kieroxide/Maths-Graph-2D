"use strict";

let canvas;
let ctx;
let graph = new Graph();
let sweetSpot = graph.vertexRadius * 1;

let isPanning = false;
let panStart = { x: 0, y: 0 };
let panOffset = { x: 0, y: 0 };

let scale = 1;
const scaleMin = 0.2;
const scaleMax = 5;

//graph.addVertex();
//graph.addVertex();
//edges and vertices for testing


const edges = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 2, to: 6 },
  { from: 3, to: 7 },
  { from: 4, to: 8 },
  { from: 5, to: 9 },
  { from: 6, to: 10 },
  { from: 6, to: 11 }
];

//getVerticesAndEdges()
//graph.assignNeighbours();
//Math2D.degreeCount(graph);
//graph.groups = Math2D.hubConnections(graph);

    function setup(){
        canvas = document.getElementById('graphCanvas');
        ctx = canvas.getContext('2d');
        graph = generateTreeGraph(1000); // Generate a tree graph with 12 vertices

        canvas.addEventListener('mousedown', (e) => {
            isPanning = true;
            const rect = canvas.getBoundingClientRect();
            panStart.x = e.clientX - rect.left - panOffset.x;
            panStart.y = e.clientY - rect.top - panOffset.y;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isPanning) return;
            const rect = canvas.getBoundingClientRect();
            panOffset.x = e.clientX - rect.left - panStart.x;
            panOffset.y = e.clientY - rect.top - panStart.y;
        });

        canvas.addEventListener('mouseup', () => {
            isPanning = false;
        });
        canvas.addEventListener('mouseleave', () => {
            isPanning = false;
        });

        canvas.addEventListener('wheel', (e) => {
      e.preventDefault(); // prevent page scroll

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const wheel = e.deltaY < 0 ? 1.1 : 0.9;

      // Compute new scale, clamped
      const newScale = Math.min(scaleMax, Math.max(scaleMin, scale * wheel));

      // To zoom on mouse position, adjust panOffset to keep mouse in place
      panOffset.x -= (mouseX - panOffset.x) * (newScale / scale - 1);
      panOffset.y -= (mouseY - panOffset.y) * (newScale / scale - 1);

      scale = newScale;
    });
    // Vertex Push
    const vertexPushSlider = document.getElementById('vertexPushSlider');
    const vertexPushValue = document.getElementById('vertexPushValue');
    vertexPushSlider.value = 20; // Set default
    vertexPushSlider.oninput = function() {
        graph.vertexPushConstant = parseFloat(this.value);
        vertexPushValue.textContent = this.value;
    };

    // Edge Pull
    const edgePullSlider = document.getElementById('edgePullSlider');
    const edgePullValue = document.getElementById('edgePullValue');
    edgePullSlider.value = 0.05; // Set default
    edgePullSlider.oninput = function() {
        graph.edgePullConstant = parseFloat(this.value);
        edgePullValue.textContent = this.value;
    };

    // Boundary Push
    const boundaryPushSlider = document.getElementById('boundaryPushSlider');
    const boundaryPushValue = document.getElementById('boundaryPushValue');
    boundaryPushSlider.value = 10; // Set default
    boundaryPushSlider.oninput = function() {
        graph.boundaryPushConstant = parseFloat(this.value);
        boundaryPushValue.textContent = this.value;
    };

    // Stall Rotation
    const stallRotationSlider = document.getElementById('stallRotationSlider');
    const stallRotationValue = document.getElementById('stallRotationValue');
    stallRotationSlider.value = 0.1; // Set default
    stallRotationSlider.oninput = function() {
        graph.stallRotationConstant = parseFloat(this.value);
        stallRotationValue.textContent = this.value;
    };

    // Group Pull
    const groupPullSlider = document.getElementById('groupPullSlider');
    const groupPullValue = document.getElementById('groupPullValue');
    groupPullSlider.value = 0.05; // Set default
    groupPullSlider.oninput = function() {
        graph.groupPullConstant = parseFloat(this.value);
        groupPullValue.textContent = this.value;
    };

    // Groups Push
    const groupsPushSlider = document.getElementById('groupsPushSlider');
    const groupsPushValue = document.getElementById('groupsPushValue');
    groupsPushSlider.value = 25; // Set default
    groupsPushSlider.oninput = function() {
        graph.groupsPushConstant = parseFloat(this.value);
        groupsPushValue.textContent = this.value;
    };

    // Group Spacing
    const groupSpacingSlider = document.getElementById('groupSpacingSlider');
    const groupSpacingValue = document.getElementById('groupSpacingValue');
    groupSpacingSlider.value = 5; // Set default
    groupSpacingSlider.oninput = function() {
        graph.groupSpacingConstant = parseFloat(this.value);
        groupSpacingValue.textContent = this.value;
    };

    // Edges Push
    const edgesPushSlider = document.getElementById('edgesPushSlider');
    const edgesPushValue = document.getElementById('edgesPushValue');
    edgesPushSlider.value = 0.1; // Set default
    edgesPushSlider.oninput = function() {
        graph.edgesPushConstant = parseFloat(this.value);
        edgesPushValue.textContent = this.value;
    };

    // Edge-Vertex Push
    const edgeVertPushSlider = document.getElementById('edgeVertPushSlider');
    const edgeVertPushValue = document.getElementById('edgeVertPushValue');
    edgeVertPushSlider.value = 100; // Set default
    edgeVertPushSlider.oninput = function() {
        graph.edgeVertPushConstant = parseFloat(this.value);
        edgeVertPushValue.textContent = this.value;
    };

    // Set graph constants to default values
    graph.vertexPushConstant = parseFloat(vertexPushSlider.value);
    graph.edgePullConstant = parseFloat(edgePullSlider.value);
    graph.boundaryPushConstant = parseFloat(boundaryPushSlider.value);
    graph.stallRotationConstant = parseFloat(stallRotationSlider.value);
    graph.groupPullConstant = parseFloat(groupPullSlider.value);
    graph.groupsPushConstant = parseFloat(groupsPushSlider.value);
    graph.groupSpacingConstant = parseFloat(groupSpacingSlider.value);
    graph.edgesPushConstant = parseFloat(edgesPushSlider.value);
    graph.edgeVertPushConstant = parseFloat(edgeVertPushSlider.value);

    // Update displayed values
    vertexPushValue.textContent = vertexPushSlider.value;
    edgePullValue.textContent = edgePullSlider.value;
    boundaryPushValue.textContent = boundaryPushSlider.value;
    stallRotationValue.textContent = stallRotationSlider.value;
    groupPullValue.textContent = groupPullSlider.value;
    groupsPushValue.textContent = groupsPushSlider.value;
    groupSpacingValue.textContent = groupSpacingSlider.value;
    edgesPushValue.textContent = edgesPushSlider.value;
    edgeVertPushValue.textContent = edgeVertPushSlider.value;
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let backgroundColour = '#FFFFF0';
    ctx.fillStyle = backgroundColour;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(panOffset.x, panOffset.y);
    ctx.scale(scale, scale);   // Apply zoom scale here
    graph.draw();
    ctx.restore();
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

function generateTreeGraph(numVertices) {
    graph = new Graph(); // reset graph
    
    if (numVertices < 1) return;
    
    // Add all vertices first
    for (let i = 0; i < numVertices; i++) {
        graph.addVertex();
    }
    
    // Connect vertices in a tree:
    // For each vertex from 1 to N-1, connect it to a random previous vertex (parent)
    for (let i = 1; i < numVertices; i++) {
        // Pick a parent randomly from vertices already added (0 to i-1)
        let parent = Math.floor(Math.random() * i);
        graph.addEdge(parent, i);
    }
    
    graph.assignNeighbours();
    graph.groups = Math2D.hubConnections(graph); // Or your own grouping logic
    
    // Reset any other properties or forces as needed
    
    return graph;
}

setup();
draw();