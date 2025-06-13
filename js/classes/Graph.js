class Graph{
    constructor(){
        this.nextID = 0;
        this.edges = [];
        this.vertices = [];
        this.vertexRadius = 30;
        this.maxForce = 1;
    }
    updateVertexPosition(){
        for(const vertex of this.vertices){
            vertex.updatePosition();
            vertex.fx = 0;
            vertex.fy = 0;
        }
    }
    applyVertexPhysics(){
        //could optimise to only do it in pairs 
        for(const vertexA of this.vertices){
            for(const vertexB of this.vertices){
                if(vertexA !== vertexB){
                    const pointA = vertexA.position;
                    const pointB = vertexB.position;
                    let distanceBetween = Math2D.distanceBetween(pointA, pointB);

                    if(distanceBetween < sweetSpot){
                        const vectorAB = Math2D.vectorFrom(pointA, pointB);
                        if(distanceBetween === 0) distanceBetween = 1;
                        const forceMagnitude = Math.min(2 / distanceBetween, 2); 
                        const forceX = vectorAB.x * forceMagnitude;
                        const forceY = vectorAB.y * forceMagnitude;
                        console.log(forceMagnitude);
                        vertexA.fx -= forceX;
                        vertexA.fy -= forceY;

                        vertexB.fx += forceX;
                        vertexB.fy += forceY;
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
            const distanceBetween = Math2D.distanceBetween(pointA, pointB);
            if(distanceBetween > sweetSpot){
                const diff = -(sweetSpot - distanceBetween) * 0.01;
                const vectorAB = Math2D.vectorFrom(pointA, pointB);
                let forceMagnitude = Math.min(diff*distanceBetween * 0.001, 1);
                const forceX = vectorAB.x * forceMagnitude;
                const forceY = vectorAB.y * forceMagnitude;
                console.log(forceMagnitude);
                vertexA.fx += forceX;
                vertexA.fy += forceY;
                
                vertexB.fx -= forceX;
                vertexB.fy -= forceY;

            }
        }
    }
    applyBoundaryPhysics(){
        
    }
    draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.applyVertexPhysics();
        this.applyEdgePhysics();
        this.updateVertexPosition();
        for(const edge of this.edges){
            edge.draw();
        }
        for(const vertex of this.vertices){
            vertex.draw();
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