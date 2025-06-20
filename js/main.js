/* Force-Directed Graph Visualizer
 * Vanilla Javascript
 * Author: Kieran B
 */


"use strict";
let scene = new Scene();
let canvasWidth = 0;
let canvasHeight = 0;

function setup(){
    scene.setup();
    scene.graph = GraphMaker.generateTreeGraph(10);
    Handler.setupNewGraphButton();
    Handler.initialiseSliders();
    Handler.eventHandlers();
}

function draw(){
    scene.draw();
    requestAnimationFrame(draw);
}




setup();
draw();