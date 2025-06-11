class Vertex {
    constructor(nextID, radius = 30){
        this.id = nextID;
        this.x = 400;
        this.y = 400;
        this.radius = radius;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
        ctx.fillStyle = '#2ecc71';
        ctx.strokeStyle = 'black'; 
        ctx.fill();
        ctx.stroke();
        ctx.font = "30px Arial"; 
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";         
        ctx.fillText(`${this.id}`, this.x, this.y);
    }
}