class Graph{
    constructor(){
        this.nextID = 0;
        this.edges = [];
        this.vertices = [];
        this.vertexRadius = 30;
        this.maxForce = 1;
        this.vertexPushCoefficent = 10;
        this.edgePullCoefficent = 0.00001;
        this.forceConstant = 20;
        this.groups = [];
        this.boundaryForce = 1000;
    }
    
    groupRepulsion(){
        const groups = this.groups;
        const forceConstant = 0.001;
        let groupMidpoints = [];
        for(const group of groups){
            groupMidpoints.push({group: group, midpoint : Math2D.getMidpoint(group)});
        }
        const n = groupMidpoints.length;
        for(let i = 0; i < n; i++){
            for(let j = i + 1; j < n; j++){
                const groupA = groupMidpoints[0];
                const groupB = groupMidpoints[1];
                const vectorAB = Math2D.vectorFrom(groupA.midpoint, groupB.midpoint);
                let distance = Math2D.distanceBetween(groupA.midpoint, groupB.midpoint)
                if(distance === 0) distance = 0.01;
                const forceMagnitude = forceConstant * this.vertexPushCoefficent/distance;
                for(const vertexA of groupA.group){
                    for(const vertexB of groupB.group){
                        Math2D.applyForce(vertexA, vertexB, forceMagnitude, vectorAB, -1);
                    }
                }
            }
        }
    }
    groupingPhysics(){
        const forceConstant = 20;
        const groups = this.groups;
        for(const group of groups){
            const n = group.length;
            for(let i = 0; i < n; i++){
                for(let j = i + 1; j < n; j++){
                    const vertexA = group[i];
                    const vertexB = group[j];

                    const pointA = vertexA.position;
                    const pointB = vertexB.position;

                    const distanceBetween = Math2D.distanceBetween(pointA, pointB);
    
                    // Apply force only if vertices are farther apart than the sweet spot
                    if(distanceBetween > sweetSpot - 20){
                        // Get vector from A to B
                        const vectorAB = Math2D.vectorFrom(pointA, pointB);
                        // Calculate force magnitude proportional to how far beyond sweet spot
                        let forceMagnitude = forceConstant * this.edgePullCoefficent * (distanceBetween - 20);
                        //applies the force to the vertices
                        Math2D.applyForce(vertexA, vertexB, forceMagnitude, vectorAB, 1);
                    }
                }
            }
        }
    }
    checkRotations(){
        const forceThreshold = 1; // tweak to your scale
        const velocityThreshold = 1;
        const rotationStrength = 0.05;
        const vertices = this.vertices;
        for (const v of vertices) {
            const forceMag = Math.sqrt(v.fx * v.fx + v.fy * v.fy);
            const velMag = Math.sqrt(v.vx * v.vx + v.vy * v.vy);
        
            if (forceMag > forceThreshold && velMag < velocityThreshold) {
                // Rotate force vector by 90 or 270 degrees randomly
                const direction = 1;
                const rotFx = -v.fy * rotationStrength * direction;
                const rotFy = v.fx * rotationStrength * direction;
                // Add rotational force
                v.fx += rotFx;
                v.fy += rotFy;
            }
        }

    }
    updateVertexPosition(){
        for(const vertex of this.vertices){
            vertex.updatePosition();
            vertex.fx = 0;
            vertex.fy = 0;
        }
    }
    applyVertexPhysics(){
        const vertices = this.vertices;
        const n = vertices.length;
        //nested dependant loop for performing repulsion on pairs once
        for(let i = 0; i < n; i++){
            const vertexA = vertices[i];
            for(let j = i + 1; j < n; j++){
                const vertexB = vertices[j];
                //Calculates distance between points
                const pointA = vertexA.position;
                const pointB = vertexB.position;
                let distance = Math2D.distanceBetween(pointA, pointB);
                
                if(distance === 0) distance = 0.01; // division by zero avoidance
                //if distance too close 
                if(distance < sweetSpot){
                    //calculates repulsion force vector
                    const forceMagnitude = this.forceConstant * this.vertexPushCoefficent / distance**2;
                    const vectorAB = Math2D.vectorFrom(pointA, pointB);
                    Math2D.applyForce(vertexA, vertexB, forceMagnitude, vectorAB, -1);
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

            // Apply force only if vertices are farther apart than the sweet spot
            if(distanceBetween > sweetSpot){
                // Get vector from A to B
                const vectorAB = Math2D.vectorFrom(pointA, pointB);

                // Calculate force magnitude proportional to how far beyond sweet spot
                let forceMagnitude = this.forceConstant * this.edgePullCoefficent * (distanceBetween - sweetSpot) * 2;

                Math2D.applyForce(vertexA, vertexB, forceMagnitude, vectorAB, 1);
            }
        }
    }
    applyBoundaryPhysics(){
        const bound = 20;
        for(const vertex of this.vertices){
            if(vertex.x < bound + vertex.radius){
                vertex.fx += this.boundaryForce;
            }
            if(vertex.y < bound + vertex.radius){
                vertex.fy += this.boundaryForce;
            }
            if(vertex.x + vertex.radius > canvas.width - bound){
                vertex.fx -= this.boundaryForce;
            }
            if(vertex.y + vertex.radius > canvas.height - bound){
                vertex.fy -= this.boundaryForce;
            }
        }
    }
    draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.applyVertexPhysics();
        this.applyEdgePhysics();
        this.applyBoundaryPhysics();
        this.checkRotations();
        this.groupingPhysics();
        this.groupRepulsion();
        this.updateVertexPosition();
        for(const edge of this.edges){
            edge.draw();
        }
        for(const vertex of this.vertices){
            vertex.draw();
        }
    }   
    assignNeighbours(){
        const vertices = this.vertices;
        const edges = this.edges;
        for(const edge of edges){
            //adds to neighbour set
            edge.vertexTo.neighboursID.add(edge.vertexFrom.id);
            edge.vertexFrom.neighboursID.add(edge.vertexTo.id);
        }
    }
    addEdge(idTo , idFrom){
        if(this.vertices.length < 1){
            console.log("0 vertices to create edge for");
        }
        const edge = new Edge(this.vertices[idTo], this.vertices[idFrom]);
        console.log(edge);
        this.edges.push(edge); 
    }
    addVertex(){
        const vertex = new Vertex(this.getNextID(), this.vertexRadius);
        this.vertices.push(vertex);
    }
    getNextID(){
        let currentID = this.nextID;
        this.nextID++;
        return currentID;
    }
}