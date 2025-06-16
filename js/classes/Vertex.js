class Vertex {
    constructor(nextID, radius = 30, mass = 0.001){
        this.id = nextID;
        this.degrees = 0;
        // Randomize initial position
        this.x = canvas.width * Math.random();
        this.y = canvas.height * Math.random();
        this.position = new Point2D(this.x , this.y)
        this.neighboursID = new Set();
        this.radius = radius;
        this.mass = mass;
        this.maxSpeed = 20;

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

        this.ax = this.fx / this.mass;
        this.ay = this.fy / this.mass;

        this.vx += this.ax;
        this.vy += this.ay;

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        
        if (speed > this.maxSpeed ) {
            const scale = this.maxSpeed / speed;
            this.vx *= scale;
            this.vy *= scale;
        }
        let minSpeed = this.maxSpeed * 0.1;
        if(Math.abs(this.vx) > minSpeed)  this.x += this.vx;
        if(Math.abs(this.vy) > minSpeed)  this.y += this.vy;

        this.vx *= 0.99;
        this.vy *= 0.99;

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
    outofBounds(){
        let screenX = this.x * scale + panOffset.x;
        let screenY = this.y * scale + panOffset.y;

        if(screenX < 0 || screenX > canvas.width || screenY < 0 || screenY > canvas.height) {
            return true;
        }
        else {
            return false;
        }

    }
}