class Math2D {
    static hubConnections(graph){
        const vertices = graph.vertices;
        const n = vertices.length;
        const edges = graph.edges;
        const visited = new Set();
        vertices.sort((a,b) => b.degrees - a.degrees);
        console.log(vertices);
        const groupings = [];
        for(let i = 0; i < n; i++){
            const currentVertex = vertices[i];
            if(!(visited.has(currentVertex.id))){
                visited.add(currentVertex.id);
                const vertexGroup = [currentVertex];
                for(let j = 0; j < depth; j++){
                    for(const neighbourID of currentVertex.neighboursID){
                        if(!visited.has(neighbourID)){
                            const neighbour = vertices[neighbourID];
                            vertexGroup.push(neighbour);
                            visited.add(neighbourID);
                        }
                    }
                }
                groupings.push(vertexGroup);
            }
        }
        return groupings;
    }
    static degreeCount(graph){
        const edges = graph.edges;
        for(const edge of edges){
            const vertexA = edge.vertexTo;
            const vertexB = edge.vertexFrom;
            
            vertexA.degrees++;
            vertexB.degrees++;
        }
    }
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