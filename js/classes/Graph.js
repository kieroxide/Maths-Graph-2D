class Graph{
    constructor(){
        this.nextID = 0;
        this.vertexRadius = 20;
        this.vertices = [];
        this.edges = [];
        this.groups = [];

        this.vertexPushConstant = 0;
        this.edgePullConstant = 0;
        this.boundaryPushConstant = 0;
        this.stallRotationConstant = 0;
        this.groupPullConstant = 0;
        this.groupsPushConstant = 0;
        this.groupSpacingConstant = 0;
        this.edgesPushConstant = 0;
        this.edgeVertPushConstant = 0;
    }
    applyEdgeVerticesRepulsion(){
        const forceConstant = this.edgeVertPushConstant;
        const edges = this.edges;
        const vertices = this.vertices;
        for(const edge of edges){
            const midA = Math2D.getMidpoint([edge.vertexFrom, edge.vertexTo]);
            for(const vertex of vertices){
                if(vertex === edge.vertexTo || vertex === edge.vertexFrom) continue;
                let distance = Math2D.distanceBetween(vertex.position, midA);
                if(distance === 0 ) distance = 0.001
                const direction = Math2D.vectorFrom(vertex.position, midA);
                const d = distance - sweetSpot;
                const forceMagnitude = 0.0000001 * forceConstant/(d + 5) ** 2;
                
                const fx = forceMagnitude * direction.x;
                const fy = forceMagnitude * direction.y;

                vertex.fx -= fx;
                vertex.fy -= fy;
            }
        }
    }
    applyEdgeRepulsion() {
        const forceConstant = this.edgesPushConstant;
        for (let i = 0; i < this.edges.length; i++) {
            for (let j = i + 1; j < this.edges.length; j++) {
                const edgeA = this.edges[i];
                const edgeB = this.edges[j];
            
                // Skip if they share a vertex
                if (edgeA.vertexFrom === edgeB.vertexFrom || edgeA.vertexFrom === edgeB.vertexTo ||
                    edgeA.vertexTo === edgeB.vertexFrom || edgeA.vertexTo === edgeB.vertexTo) {
                    continue;
                }
            
                // Calculate midpoints
                const midA = Math2D.getMidpoint([edgeA.vertexFrom, edgeA.vertexTo]);
                const midB = Math2D.getMidpoint([edgeB.vertexFrom, edgeB.vertexTo]);
                
                const vectorAB = Math2D.vectorFrom(midA, midB);

                let distance = Math2D.distanceBetween(midA, midB);
                if (distance === 0) distance = 0.01;
            
                const force = forceConstant / (distance * distance);
                const fx = vectorAB.x * force;
                const fy = vectorAB.y * force;
            
                edgeA.vertexFrom.fx -= fx;
                edgeA.vertexFrom.fy -= fy;
                edgeA.vertexTo.fx -= fx;
                edgeA.vertexTo.fy -= fy;
            
                edgeB.vertexFrom.fx += fx;
                edgeB.vertexFrom.fy += fy;
                edgeB.vertexTo.fx += fx;
                edgeB.vertexTo.fy += fy;
            }
        }
    }
    groupSpacing(){
        const groups = this.groups;
        const forceConstant = this.groupSpacingConstant;
        for(const group of groups){
            const hub = group[0];
            const rest = group.slice(1);
            for(const vertex of rest){
                //get perpendicular direction
                const direction = Math2D.vectorFrom(hub, vertex);
                const perpendicular = new Point2D(direction.y, -direction.x);
                const distance = Math2D.distanceBetween(hub.position, vertex.position);
                const d = distance - sweetSpot;
                const forceMagnitude = forceConstant/(d * d + 10);
                vertex.fx += perpendicular.x * forceMagnitude;
                vertex.fy += perpendicular.y * forceMagnitude;
            }

        }
    }
    groupRepulsion(){
        const groups = this.groups;
        const forceConstant = this.groupsPushConstant;
        let groupMidpoints = [];
        for(const group of groups){
            groupMidpoints.push({group: group, midpoint : Math2D.getMidpoint(group)});
        }
        const n = groupMidpoints.length;
        for(let i = 0; i < n; i++){
            for(let j = i + 1; j < n; j++){
                const groupA = groupMidpoints[i];
                const groupB = groupMidpoints[j];
                const vectorAB = Math2D.vectorFrom(groupA.midpoint, groupB.midpoint);
                let distance = Math2D.distanceBetween(groupA.midpoint, groupB.midpoint)
                if(distance < 20) distance = 0.01;
                const d = distance - sweetSpot;
                const forceMagnitude = forceConstant/(d*d + 10);
                for(const vertexA of groupA.group){
                    for(const vertexB of groupB.group){
                        Math2D.applyForce(vertexA, vertexB, forceMagnitude, vectorAB, -1);
                    }
                }
            }
        }
    }
    groupingPhysics(){
        const forceConstant = this.groupPullConstant;
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
                    // Get vector from A to B
                    const vectorAB = Math2D.vectorFrom(pointA, pointB);
                    // Calculate force magnitude proportional to how far beyond sweet spot
                    let forceMagnitude = 0.0001 * forceConstant * (distanceBetween - sweetSpot);
                    //applies the force to the vertices
                    Math2D.applyForce(vertexA, vertexB, forceMagnitude, vectorAB, 1);
                    }
                }
            }
        }

    checkRotations(){
        const forceThreshold = 3; 
        const velocityThreshold = 2;
        const rotationStrength = this.stallRotationConstant;
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
        const forceConstant = this.vertexPushConstant;
        //nested dependant loop for performing repulsion on pairs once
        for(let i = 0; i < n; i++){
            const vertexA = vertices[i];
            for(let j = i + 1; j < n; j++){
                const vertexB = vertices[j];
                //Calculates distance between points
                const pointA = vertexA.position;
                const pointB = vertexB.position;
                let distance = Math2D.distanceBetween(pointA, pointB);
                
                if(distance === 0) distance = 0.1; // division by zero avoidance
                //if distance too close 
                //calculates repulsion force vector
                const d = distance - sweetSpot;
                const forceMagnitude = forceConstant / (d * d + 10);
                const vectorAB = Math2D.vectorFrom(pointA, pointB);
                Math2D.applyForce(vertexA, vertexB, forceMagnitude, vectorAB, -1);
            }
        }
    }
    applyEdgePhysics(){
        const forceConstant = this.edgePullConstant;
        for(const edge of this.edges){
            const vertexA = edge.vertexTo;
            const vertexB = edge.vertexFrom;
            const pointA = vertexA.position;
            const pointB = vertexB.position;
            let distanceBetween = Math2D.distanceBetween(pointA, pointB);
            // Get vector from A to B
            const vectorAB = Math2D.vectorFrom(pointA, pointB);
            if(distanceBetween === 0) distanceBetween = 0.1; // Avoid division by zero
            if(distanceBetween < sweetSpot) continue;
            // Calculate force magnitude proportional to how far beyond sweet spot
            const d = distanceBetween - sweetSpot;
            let forceMagnitude = 0.01 * forceConstant * d;
            Math2D.applyForce(vertexA, vertexB, forceMagnitude, vectorAB, 1);


        }
    }
    applyBoundaryPhysics(){
        const bound = 30;
        for(const vertex of this.vertices){
            if(vertex.x < bound + vertex.radius){
                vertex.fx += this.boundaryPushConstant;
            }
            if(vertex.y < bound + vertex.radius){
                vertex.fy += this.boundaryPushConstant;
            }
            if(vertex.x + vertex.radius > canvas.width - bound){
                vertex.fx -= this.boundaryPushConstant;
            }
            if(vertex.y + vertex.radius > canvas.height - bound){
                vertex.fy -= this.boundaryPushConstant;
            }
        }
    }
    averageForce(){
        let averageForce = 0;
        for(const vertex of this.vertices){
            averageForce += Math.sqrt(vertex.fx * vertex.fx + vertex.fy * vertex.fy);
        }
        console.log("Average Force: " + averageForce / this.vertices.length);
    }
    draw(){
        this.applyVertexPhysics();
        this.applyEdgePhysics();
        //this.applyBoundaryPhysics();
        this.checkRotations();
        this.groupingPhysics();
        this.groupRepulsion();
        this.groupSpacing();
        this.applyEdgeRepulsion();
        //this.applyEdgeVerticesRepulsion();
        //this.averageForce();
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