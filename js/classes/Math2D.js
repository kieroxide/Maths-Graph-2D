/**
 * Utility class for 2D math operations.
 */
class Math2D {

    static calculatePullForce(constant, distance, sweetspot = 0){
        const maxForce = 100;
        const force = constant * (distance - sweetspot) * 0.05;
        return Math.min(maxForce, force);
    }
    static calculatePushForce(constant, distance, power){
        const maxForce = 100;
        const force =  constant/(distance ** power);
        return Math.min(maxForce, force);
    }
    /**
     * Returns the midpoint of a group of points.
     * @param {Array} group - Array of points.
     * @returns {Object}
     */
    static getMidpoint(group){
        let points = [];
        for(const v of group){
            points.push(v.position);
        }

        const n = points.length;
        let sumX = 0;
        let sumY = 0;
        for(const point of points){
            sumX += point.x;
            sumY += point.y;
        }
        return new Point2D(sumX/n, sumY/n);
    }
    /**
     * Applies a force between two vertices.
     * @param {Vertex} vertexA
     * @param {Vertex} vertexB
     * @param {number} forceMag
     * @param {Object} vectorAB
     * @param {number} [direction=1]
     */
    static applyForce(vertexA, vertexB, forceMag, vectorAB, direction=1){
        // Calculate force components in x and y directions
        const forceX = vectorAB.x * forceMag * direction;
        const forceY = vectorAB.y * forceMag * direction;

        // Apply force to vertex A
        vertexA.fx += forceX;
        vertexA.fy += forceY;
    
        // Apply equal and opposite force to vertex B
        vertexB.fx -= forceX;
        vertexB.fy -= forceY;
    }
    /**
     * Returns hub connections in the graph.
     * @param {Graph} graph
     * @returns {Array}
     */
    static hubConnections(graph){
        let vertices = graph.vertices;
        const n = vertices.length;
        const edges = graph.edges;
        const visited = new Set();
        vertices = [...vertices].sort((a,b) => b.degrees - a.degrees);
        console.log(vertices);
        const groupings = [];
        for(let i = 0; i < n; i++){
            const currentVertex = vertices[i];
            if(!(visited.has(currentVertex.id))){
                visited.add(currentVertex.id);
                const vertexGroup = [currentVertex];
                    for(const neighbourID of currentVertex.neighboursID){
                        if(!visited.has(neighbourID)){
                            const neighbour = graph.vertices[neighbourID];
                            vertexGroup.push(neighbour);
                            visited.add(neighbourID);
                        }
                    }
                groupings.push(vertexGroup);
            }
        }
        return groupings;
    }
    /**
     * Calculates degree counts for the graph and stores them in respective vertex object.
     * @param {Graph} graph
     * 
     */
    static degreeCount(graph){
        const edges = graph.edges;
        for(const edge of edges){
            const vertexA = edge.vertexTo;
            const vertexB = edge.vertexFrom;
            
            vertexA.degrees = 0;
            vertexB.degrees = 0;
        }
        for(const edge of edges){
            const vertexA = edge.vertexTo;
            const vertexB = edge.vertexFrom;
            
            vertexA.degrees++;
            vertexB.degrees++;
        }
    }
    /**
     * Calculates the distance between two points.
     * @param {Object} pointA
     * @param {Object} pointB
     * @returns {number}
     */
    static distanceBetween(pointA, pointB){
        const dx = Math.abs(pointA.x - pointB.x);
        const dy = Math.abs(pointA.y - pointB.y);
        return Math.sqrt( (dx ** 2) + (dy ** 2) );
    }
    /*  Gets Vector from pointA to pointB
     *  Normalises the Vector
     */
    static vectorFrom(pointA, pointB){
        const dx = pointB.x - pointA.x;
        const dy = pointB.y - pointA.y;
        let vector = new Point2D(dx , dy);
        vector = this.normalizeVector(vector);
        return vector;
    }

    static normalizeVector(vector){
        let vectorN = new Point2D(0, 0);
        const length = Math.sqrt(vector.x ** 2 + vector.y ** 2);
        if (length === 0) {
            const angle = Math.random() * 2 * Math.PI;
            return new Point2D(Math.cos(angle), Math.sin(angle));
        }
        vectorN.x = vector.x / length;
        vectorN.y = vector.y / length;
        return vectorN;
    }
}