class Graph{
    constructor(){
        this.nextID = 0;
        this.edges = [];
        this.vertices = [];
        this.vertexRadius = 30;

        this.distanceThreshold = this.vertexRadius * 2;
        this.maxForce = 1;
    }
    applyVertexPhysics(){
        //could optimise to only do it in pairs 
        for(const vertexA of this.vertices){
            for(const vertexB of this.vertices){
                if(vertexA !== vertexB){
                    const pointA = vertexA.position;
                    const pointB = vertexB.position;
                    let distanceBetween = Math2D.distanceBetween(pointA, pointB);

                    if(distanceBetween < this.distanceThreshold){
                        const vectorAB = Math2D.vectorFrom(pointA, pointB);
                        if(distanceBetween === 0) distanceBetween = 5;
                        const forceMagnitude = Math.min(500 / (distanceBetween ** 2), this.maxForce);
                        const forceX = vectorAB.x * forceMagnitude;
                        const forceY = vectorAB.y * forceMagnitude;

                        vertexA.fx -= forceX;
                        vertexA.fy -= forceY;

                        vertexB.fx += forceX;
                        vertexB.fy += forceY;

                        vertexA.updatePosition();
                        vertexB.updatePosition();

                    }
                }
            }
        }
    }
    applyEdgePhysics(){
        for(const edge of this.edges){
            const vertexA = edge.vertexTo;
            const vertexB = edge.vertexFrom;
            const pointA = vertexA.position;
            const pointB = vertexB.position;
            const vectorAB = Math2D.vectorFrom(pointA, pointB);
            const distanceBetween = Math2D.distanceBetween(pointA, pointB);

            const forceMagnitude = 500000 * (distanceBetween - 50);
            const forceX = vectorAB.x * forceMagnitude;
            const forceY = vectorAB.y * forceMagnitude;
            vertexA.fx += forceX;
            vertexA.fy += forceY;
            vertexB.fx -= forceX;
            vertexB.fy -= forceY;
            vertexA.updatePosition();
            vertexB.updatePosition();
        }
    }
    draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.applyVertexPhysics();
        this.applyEdgePhysics();
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
    }
    addVertex(){
        const vertex = new Vertex(this.getNextID(), this.radius);
        this.vertices.push(vertex);
    }
    getNextID(){
        let currentID = this.nextID;
        this.nextID++;
        return currentID;
    }
}