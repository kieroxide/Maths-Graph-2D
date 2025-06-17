/**
 * Represents an edge connecting two vertices in the graph.
 */
class Edge{
    /**
     * @param {Vertex} vertexTo - One endpoint of the edge.
     * @param {Vertex} vertexFrom - The other endpoint of the edge.
     */
    constructor(vertexTo, vertexFrom){
        this.vertexTo = vertexTo;
        this.vertexFrom = vertexFrom;
    }

    /**
     * Draws the edge on the canvas.
     */
    draw(){
        const vertexToX = this.vertexTo.x;
        const vertexToY = this.vertexTo.y;

        const vertexFromX = this.vertexFrom.x;
        const vertexFromY = this.vertexFrom.y;

        ctx.beginPath();
        ctx.moveTo(vertexToX, vertexToY);
        ctx.lineTo(vertexFromX, vertexFromY);
        ctx.strokeStyle = 'black'; 
        ctx.stroke();
        
    }
}