/* Force-Directed Graph Visualizer
 * Vanilla Javascript
 * Author: Kieran B
 */


"use strict";
let temperature = 1; // Global temperature variable
let frameCount = 0;
let canvas;
let ctx;
let nodes = 1000;
let graph = new Graph(nodes);
let sweetSpot = graph.vertexRadius * 1;

let isPanning = false;
let panStart = { x: 0, y: 0 };
let panOffset = { x: 0, y: 0 };

let scale = 1;
const scaleMin = 0.2;
const scaleMax = 5;

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

function setup(){
    canvas = document.getElementById('graphCanvas');
    ctx = canvas.getContext('2d');
    graph = generateTreeGraph(nodes);
    //graph = generateRandomConnectedGraph(graph, nodes, 10);
    
    initialiseSliders();
    eventHandlers();
}

function draw(){
    frameCount++;
    if(frameCount % 15 === 0) {
        temperature -= 0.1/Math.sqrt(nodes);
        if(temperature < 0) {
            temperature = 0;
        }
        console.log(`Temperature: ${temperature}`);
    }

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
    graph = new Graph(numVertices); // reset graph
    
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

function generateRandomConnectedGraph(graph, nodes, extraEdges = 0) {
    // Clear any existing graph
    graph.vertices = [];
    graph.edges = [];
    graph.nextID = 0;

    // Add vertices
    for (let i = 0; i < nodes; i++) {
        graph.addVertex();
    }

    // Ensure the graph is connected by creating a random spanning tree
    let connected = [0];
    let unconnected = [...Array(nodes).keys()].slice(1);

    while (unconnected.length > 0) {
        let from = connected[Math.floor(Math.random() * connected.length)];
        let toIndex = Math.floor(Math.random() * unconnected.length);
        let to = unconnected.splice(toIndex, 1)[0];

        graph.addEdge(from, to);
        connected.push(to);
    }

    // Add extra edges to create cycles
    for (let i = 0; i < extraEdges; i++) {
        let a = Math.floor(Math.random() * nodes);
        let b = Math.floor(Math.random() * nodes);
        if (a !== b && !graph.edgeExists(graph.vertices[a], graph.vertices[b])) {
            graph.addEdge(a, b);
        }
    }

    graph.assignNeighbours();
    Math2D.degreeCount(graph);
    graph.groups = Math2D.hubConnections(graph);
    return graph;
}

function eventHandlers() {
    // Canvas mouse events for panning
    canvas.addEventListener('mousedown', function(e) {
        isPanning = true;
        panStart.x = e.clientX - panOffset.x;
        panStart.y = e.clientY - panOffset.y;
    });
    
    canvas.addEventListener('mousemove', function(e) {
        if (isPanning) {
            panOffset.x = e.clientX - panStart.x;
            panOffset.y = e.clientY - panStart.y;
        }
    });
    
    canvas.addEventListener('mouseup', function(e) {
        isPanning = false;
    });
    
    canvas.addEventListener('mouseleave', function(e) {
        isPanning = false;
    });
    
    // Mouse wheel for zooming
    canvas.addEventListener('wheel', function(e) {
        e.preventDefault();
        const zoomIntensity = 0.1;
        let mouseX = e.offsetX;
        let mouseY = e.offsetY;
        let wheel = e.deltaY < 0 ? 1 : -1;
        let zoom = Math.exp(wheel * zoomIntensity);
    
        // Adjust panOffset so zoom is centered on mouse
        panOffset.x = mouseX - (mouseX - panOffset.x) * zoom;
        panOffset.y = mouseY - (mouseY - panOffset.y) * zoom;
    
        scale *= zoom;
        scale = Math.max(scaleMin, Math.min(scaleMax, scale));
    });
    
}
function initialiseSliders(){
    // Vertex Push
    const vertexPushSlider = document.getElementById('vertexPushSlider');
    const vertexPushValue = document.getElementById('vertexPushValue');
    vertexPushSlider.value = 100;
    vertexPushSlider.min = 10;
    vertexPushSlider.max = 500;
    vertexPushSlider.step = 1;
    vertexPushValue.textContent = vertexPushSlider.value;
    vertexPushSlider.oninput = function() {
        graph.vertexPushConstant = parseFloat(this.value);
        vertexPushValue.textContent = this.value;
    };

    // Edge Pull
    const edgePullSlider = document.getElementById('edgePullSlider');
    const edgePullValue = document.getElementById('edgePullValue');
    edgePullSlider.value = 0.05;
    edgePullSlider.min = 0.01;
    edgePullSlider.max = 0.5;
    edgePullSlider.step = 0.01;
    edgePullValue.textContent = edgePullSlider.value;
    edgePullSlider.oninput = function() {
        graph.edgePullConstant = parseFloat(this.value);
        edgePullValue.textContent = this.value;
    };

    // Stall Rotation
    const stallRotationSlider = document.getElementById('stallRotationSlider');
    const stallRotationValue = document.getElementById('stallRotationValue');
    stallRotationSlider.value = 0.5;
    stallRotationSlider.min = 0;
    stallRotationSlider.max = 0.5;
    stallRotationSlider.step = 0.01;
    stallRotationValue.textContent = stallRotationSlider.value;
    stallRotationSlider.oninput = function() {
        graph.stallRotationConstant = parseFloat(this.value);
        stallRotationValue.textContent = this.value;
    };

    // Group Pull
    const groupPullSlider = document.getElementById('groupPullSlider');
    const groupPullValue = document.getElementById('groupPullValue');
    groupPullSlider.value = 0.01;
    groupPullSlider.min = 0.001;
    groupPullSlider.max = 0.05;
    groupPullSlider.step = 0.001;
    groupPullValue.textContent = groupPullSlider.value;
    groupPullSlider.oninput = function() {
        graph.groupPullConstant = parseFloat(this.value);
        groupPullValue.textContent = this.value;
    };

    // Groups Push
    const groupsPushSlider = document.getElementById('groupsPushSlider');
    const groupsPushValue = document.getElementById('groupsPushValue');
    groupsPushSlider.value = 30;
    groupsPushSlider.min = 1;
    groupsPushSlider.max = 100;
    groupsPushSlider.step = 1;
    groupsPushValue.textContent = groupsPushSlider.value;
    groupsPushSlider.oninput = function() {
        graph.groupsPushConstant = parseFloat(this.value);
        groupsPushValue.textContent = this.value;
    };

    // Group Spacing
    const groupSpacingSlider = document.getElementById('groupSpacingSlider');
    const groupSpacingValue = document.getElementById('groupSpacingValue');
    groupSpacingSlider.value = 0.2;
    groupSpacingSlider.min = 0.01;
    groupSpacingSlider.max = 1;
    groupSpacingSlider.step = 0.01;
    groupSpacingValue.textContent = groupSpacingSlider.value;
    groupSpacingSlider.oninput = function() {
        graph.groupSpacingConstant = parseFloat(this.value);
        groupSpacingValue.textContent = this.value;
    };

    // Edges Push
    const edgesPushSlider = document.getElementById('edgesPushSlider');
    const edgesPushValue = document.getElementById('edgesPushValue');
    edgesPushSlider.value = 0.1;
    edgesPushSlider.min = 0.01;
    edgesPushSlider.max = 1;
    edgesPushSlider.step = 0.01;
    edgesPushValue.textContent = edgesPushSlider.value;
    edgesPushSlider.oninput = function() {
        graph.edgesPushConstant = parseFloat(this.value);
        edgesPushValue.textContent = this.value;
    };

    // Edge-Vertex Push
    const edgeVertPushSlider = document.getElementById('edgeVertPushSlider');
    const edgeVertPushValue = document.getElementById('edgeVertPushValue');
    edgeVertPushSlider.value = 0.1;
    edgeVertPushSlider.min = 0.01;
    edgeVertPushSlider.max = 1;
    edgeVertPushSlider.step = 0.01;
    edgeVertPushValue.textContent = edgeVertPushSlider.value;
    edgeVertPushSlider.oninput = function() {
        graph.edgeVertPushConstant = parseFloat(this.value);
        edgeVertPushValue.textContent = this.value;
    };

    // Set graph constants to default values
    graph.vertexPushConstant = parseFloat(vertexPushSlider.value);
    graph.edgePullConstant = parseFloat(edgePullSlider.value);
    graph.stallRotationConstant = parseFloat(stallRotationSlider.value);
    graph.groupPullConstant = parseFloat(groupPullSlider.value);
    graph.groupsPushConstant = parseFloat(groupsPushSlider.value);
    graph.groupSpacingConstant = parseFloat(groupSpacingSlider.value);
    graph.edgesPushConstant = parseFloat(edgesPushSlider.value);
    graph.edgeVertPushConstant = parseFloat(edgeVertPushSlider.value);

    // Update displayed values
    vertexPushValue.textContent = vertexPushSlider.value;
    edgePullValue.textContent = edgePullSlider.value;
    stallRotationValue.textContent = stallRotationSlider.value;
    groupPullValue.textContent = groupPullSlider.value;
    groupsPushValue.textContent = groupsPushSlider.value;
    groupSpacingValue.textContent = groupSpacingSlider.value;
    edgesPushValue.textContent = edgesPushSlider.value;
    edgeVertPushValue.textContent = edgeVertPushSlider.value;
}


setup();
draw();