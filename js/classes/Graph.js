class Graph{
    constructor(){
        this.nextID = 0;
        this.edges = [];
        this.vertices = [];
        this.vertexRadius = 30;
    }
    draw(){
        ctx.clearCanvas();
        this.applyEdgeRepulsion();
        for(const vertex of this.vertices){
            vertex.draw();
        }
        for(const edge of this.edges){
            edge.draw();
        }
    }
    addEdge(idTo , idFrom){
        if(this.vertices.length < 1){
            console.log("0 vertices to create edge for");
        }
        const edge = new Edge(this.vertices[idTo], this.vertices[idFrom]);
        this.edges.push(edge); 
        this.simulateForceLayout();   
    }
    addVertex(){
        const vertex = new Vertex(this.getNextID(), this.radius);
        this.vertices.push(vertex);
        this.simulateForceLayout();
    }
    getNextID(){
        let currentID = this.nextID;
        this.nextID++;
        return currentID;
    }
}