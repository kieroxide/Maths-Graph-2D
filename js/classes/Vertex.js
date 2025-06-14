class Vertex {
    constructor(nextID, radius = 30, mass = 200){
        this.id = nextID;
        this.degrees = 0;
        this.x = 300;
        this.y = 300;
        this.position = new Point2D(this.x , this.y)
        this.neighboursID = new Set();
        this.radius = radius;
        this.mass = mass;
        this.maxSpeed = 3;

        //force
        this.fx = 0;
        this.fy = 0;
        //acceleration
        this.ax = 0;
        this.ay = 0;
        //velocity
        this.vx = 0;
        this.vy = 0;

    }
    updatePosition(){
        this.fx = Math.min(1, this.fx);
        this.fy = Math.min(1, this.fy);
        this.ax = this.fx * this.mass;
        this.ay = this.fy * this.mass;

        this.vx += this.ax;
        this.vy += this.ay;

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        
        if (speed > this.maxSpeed ) {
            const scale = this.maxSpeed / speed;
            this.vx *= scale;
            this.vy *= scale;
        }

        if(Math.abs(this.vx) > 1)  this.x += this.vx;
        if(Math.abs(this.vy) > 1)  this.y += this.vy;

        this.vx *= 0.1;
        this.vy *= 0.1;

        this.position.x = this.x;
        this.position.y = this.y;

        this.fx = 0; 
        this.fy = 0;
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