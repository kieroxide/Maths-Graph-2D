/**
 * Represents a 2D graph with vertices and edges.
 */
class Graph{
    /**
     * @param {number} nodes Number of nodes to initialize.
     */
    constructor(nodes){
        this.nextID = 0;
        this.vertexRadius = 20;
        this.vertices = [];
        this.edges = [];
        this.groups = [];
        this.maxSpeed = 150;
        this.vertexPushConstant = 0;
        this.edgePullConstant = 0;
        this.stallRotationConstant = 0;
        this.groupPullConstant = 0;
        this.groupsPushConstant = 0;
        this.groupSpacingConstant = 0;
        this.edgesPushConstant = 0;
        this.edgeVertPushConstant = 0;
        this.hubPullConstant = 0;
    }
    /**
     * 
     */
    applyHubsPull(){
        const groups = this.groups;
        const n = groups.length;
        const forceConstant = this.hubPullConstant;

        for(let i = 0; i < n; i++){
            for(let j = i + 1; j < n; j++){
                const hubA = groups[i][0];
                const hubB = groups[j][0];
                const direction = Math2D.vectorFrom(hubA.position, hubB.position);
                const distance = Math2D.distanceBetween(hubA.position, hubB.position);
                if(distance < Scene.sweetspot) continue;
                const forceMag = Math2D.calculatePullForce(forceConstant, distance, Scene.sweetspot);
                const fx = forceMag * direction.x;
                const fy = forceMag * direction.y;
                hubA.fx += fx;
                hubA.fy += fy;
                hubB.fx -= fx;
                hubB.fy -= fy;
            }
        }
    }

    /**
     * Applies repulsion between edge midpoints and vertices.
     */
    applyEdgeVerticesRepulsion(){
        const forceConstant = this.edgeVertPushConstant;
        const edges = this.edges;
        const vertices = this.vertices;
        for(const edge of edges){
            const midA = Math2D.getMidpoint([edge.vertexFrom, edge.vertexTo]);
            for(const vertex of vertices){
                if(vertex === edge.vertexTo || vertex === edge.vertexFrom) continue;
                let distance = Math2D.distanceBetween(vertex.position, midA);
                if(distance > Scene.sweetspot) continue;
                if(distance === 0 ) distance = 0.001
                const direction = Math2D.vectorFrom(vertex.position, midA);
                const forceMagnitude = Math2D.calculatePushForce(forceConstant, distance, 1);
                
                const fx = forceMagnitude * direction.x;
                const fy = forceMagnitude * direction.y;

                vertex.fx -= fx;
                vertex.fy -= fy;

                edge.vertexFrom.fx += fx;
                edge.vertexFrom.fy += fy;

                edge.vertexTo.fx += fx;
                edge.vertexTo.fy += fy;
            }
        }
    }
    /**
     * Applies repulsion between edges.
     */
    applyEdgeRepulsion() {
        const forceConstant = this.edgesPushConstant;
        for (let i = 0; i < this.edges.length; i++) {
            for (let j = i + 1; j < this.edges.length; j++) {
                const edgeA = this.edges[i];
                const edgeB = this.edges[j];
                if (edgeA.vertexFrom === edgeB.vertexFrom || edgeA.vertexFrom === edgeB.vertexTo ||
                    edgeA.vertexTo === edgeB.vertexFrom || edgeA.vertexTo === edgeB.vertexTo) {
                    continue;
                }
                const midA = Math2D.getMidpoint([edgeA.vertexFrom, edgeA.vertexTo]);
                const midB = Math2D.getMidpoint([edgeB.vertexFrom, edgeB.vertexTo]);
                const vectorAB = Math2D.vectorFrom(midA, midB);

                let distance = Math2D.distanceBetween(midA, midB);
                if (distance === 0) distance = 0.01;
                if(distance > Scene.sweetspot) continue;
                const force = Math2D.calculatePushForce(forceConstant, distance, 1.3);
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
    /**
     * Applies spacing in groups. Kinda useless
     */
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
                if(distance < Scene.sweetspot) continue;
                const forceMagnitude = Math2D.calculatePushForce(forceConstant, distance, 2);
                vertex.fx += perpendicular.x * forceMagnitude;
                vertex.fy += perpendicular.y * forceMagnitude;
            }

        }
    }
    /**
     * Applies repulsion between groups.
     */
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
                const avgLength = (groupA.group.length + groupB.group.length) / 2
                if(distance < Scene.sweetspot) continue;
                if(distance === 0) distance = 0.01;
                const forceMagnitude = Math2D.calculatePushForce(forceConstant, distance/avgLength, 1.2);
                for(const vertexA of groupA.group){
                    for(const vertexB of groupB.group){
                        Math2D.applyForce(vertexA, vertexB, forceMagnitude, vectorAB, -1);
                    }
                }
            }
        }
    }
    /**
     * Handles group-pull physics.
     */
    groupingPhysics(){
        const forceConstant = this.groupPullConstant;
        const groups = this.groups;
        for(const group of groups){
            const n = group.length;
            const hub = group[0];
            for(let i = 1; i < n; i++){
                const vertexB = group[i];
                const pointA = hub.position;
                const pointB = vertexB.position;
                const distance = Math2D.distanceBetween(pointA, pointB);
                if(distance < Scene.sweetspot) continue;
                const vectorAB = Math2D.vectorFrom(pointA, pointB);
                let forceMagnitude = Math2D.calculatePullForce(forceConstant, distance, Scene.sweetspot);
                Math2D.applyForce(hub, vertexB, forceMagnitude, vectorAB, 1);
            }
        }
    }
    /**
     * Checks and applies rotational adjustments.
     */
    checkRotations(){
        const rotationStrength = this.stallRotationConstant;
        const vertices = this.vertices;
        for (const v of vertices) {
            let direction = 1;
            const rotFxA = -v.fy * rotationStrength * direction;
            const rotFyA = v.fx * rotationStrength * direction;
            const magA = Math.sqrt(rotFxA ** 2 + rotFyA ** 2);
            direction = -1;
            const rotFxB = -v.fy * rotationStrength * direction;
            const rotFyB = v.fx * rotationStrength * direction;
            const magB = Math.sqrt(rotFxB ** 2 + rotFyB ** 2);

            if(magA > magB ){
                v.fx += rotFxA;
                v.fy += rotFyA;
            } 
            else {
                v.fx += rotFxB;
                v.fy += rotFyB;
            }
        }
    }

    /**
     * Updates vertex positions.
     */
    updateVertexPosition(){
        for(const vertex of this.vertices){
            vertex.updatePosition();
            vertex.fx = 0;
            vertex.fy = 0;
        }
    }
    /**
     * Applies physics to vertices.
     */
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
                if(distance > Scene.sweetspot) continue;
                if(distance === 0) distance = 0.1; // division by zero avoidance

                //calculates repulsion force vector
                const forceMagnitude = Math2D.calculatePushForce(forceConstant, distance, 1.4);
                const vectorAB = Math2D.vectorFrom(pointA, pointB);
                Math2D.applyForce(vertexA, vertexB, forceMagnitude, vectorAB, -1);
            }
        }
    }
    /**
     * Applies physics to edges.
     */
    applyEdgePhysics(){
        const forceConstant = this.edgePullConstant;
        for(const edge of this.edges){
            const vertexA = edge.vertexTo;
            const vertexB = edge.vertexFrom;
            const pointA = vertexA.position;
            const pointB = vertexB.position;
            let distance = Math2D.distanceBetween(pointA, pointB);
            const vectorAB = Math2D.vectorFrom(pointA, pointB);
            if(distance === 0) distance = 0.1; // Avoid division by zero
            if(distance < Scene.sweetspot) continue;
            let forceMagnitude = Math2D.calculatePullForce(forceConstant, distance, Scene.sweetspot);
            Math2D.applyForce(vertexA, vertexB, forceMagnitude, vectorAB, 1);


        }
    }
    /**
     * Computes the average force in the system.
     */
    averageForce(){
        let averageForce = 0;
        for(const vertex of this.vertices){
            averageForce += Math.sqrt(vertex.fx * vertex.fx + vertex.fy * vertex.fy);
        }
        console.log("Average Force: " + averageForce / this.vertices.length);
    }
    /**
     * Draws the graph on the canvas.
     */
    draw(){
        this.applyVertexPhysics();
        this.applyEdgePhysics();
        this.checkRotations();
        //this.groupingPhysics();
        this.groupRepulsion();
        //this.groupSpacing();
        this.applyEdgeRepulsion();
        this.applyEdgeVerticesRepulsion();
        ////this.averageForce();
        this.applyHubsPull();
        this.updateVertexPosition();
        for(const edge of this.edges){
            edge.draw();
        }
        for(const vertex of this.vertices){
            vertex.draw();
        }
    }   
    /**
     * Assigns neighbours to vertices based on edges.
     */
    assignNeighbours(){
        const vertices = this.vertices
        const edges = this.edges;
        for(const vertex of vertices){
            vertex.neighboursID.clear();
        }
        for(const edge of edges){
            //adds to neighbour set
            edge.vertexTo.neighboursID.add(edge.vertexFrom.id);
            edge.vertexFrom.neighboursID.add(edge.vertexTo.id);
        }
    }
    /**
     * Adds an edge between two vertices.
     * @param {number} idTo - ID of the target vertex.
     * @param {number} idFrom - ID of the source vertex.
     */
    addEdge(idTo , idFrom){
        if(this.vertices.length < 1){
            console.log("0 vertices to create edge for");
        }
        const edge = new Edge(this.vertices[idTo], this.vertices[idFrom]);
        console.log(edge);
        this.edges.push(edge);
        Math2D.degreeCount(this); 
    }
    /**
     * Adds a vertex to the graph.
     */
    addVertex(){
        const vertex = new Vertex(this.getNextID(), this.maxSpeed, this.vertexRadius);
        this.vertices.push(vertex);
    }

    /**
     * Gets the next available ID.
     * @returns {number} The next ID.
     */
    getNextID(){
        let currentID = this.nextID;
        this.nextID++;
        return currentID;
    }


    /**
     * Checks if an edge exists between two vertices.
     * @param {Vertex} vertexTo - The target vertex.
     * @param {Vertex} vertexFrom - The source vertex.
     * @returns {boolean} True if the edge exists, false otherwise.
     */
    edgeExists(vertexTo, vertexFrom){
        for(const edge of this.edges){
            if((edge.vertexTo.id === vertexTo.id && edge.vertexFrom.id === vertexFrom.id) ||
               (edge.vertexTo.id === vertexFrom.id && edge.vertexFrom.id === vertexTo.id)){
                return true;
            }
        }
        return false;
    }

}