class GraphMaker{
    static generateTreeGraph(numVertices) {
        let graph = new Graph(numVertices); // reset graph
        
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

    static generateRandomConnectedGraph(nodes, extraEdges = 0) {
        // Clear any existing graph
        let graph = new Graph(nodes);

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
}