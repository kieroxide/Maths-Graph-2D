class Edge{
    constructor(vertexTo, vertexFrom){
        this.vertexTo = vertexTo;
        this.vertexFrom = vertexFrom;
    }

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