/**
 * Represents a vertex (node) in a 2D graph.
 */
class Vertex {
    /**
     * @param {number} nextID Unique identifier for the vertex.
     * @param {number} maxSpeed Maximum speed for movement.
     * @param {number} [radius=30] Radius for drawing the vertex.
     * @param {number} [mass=0.001] Mass of the vertex.
     */
    constructor(nextID, maxSpeed, radius = 30, mass = 0.001){
        this.id = nextID;
        this.degrees = 0;

        // Randomize initial position
        this.x = canvasWidth * Math.random();
        this.y = canvasHeight * Math.random();

        this.position = new Point2D(this.x , this.y)

        this.neighboursID = new Set();

        this.radius = radius;
        this.mass = mass;
        this.maxSpeed = maxSpeed;

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
    
    /**
     * Calculates next draw position using velocity and force calculations.
     */
    updatePosition(){
        let maxSpeed = this.maxSpeed * scene.temperature;
        this.ax = this.fx / this.mass;
        this.ay = this.fy / this.mass;

        this.vx += this.ax;
        this.vy += this.ay;

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        
        if (speed > maxSpeed ) {
            const scale = maxSpeed / speed;
            this.vx *= scale;
            this.vy *= scale;
        }
        let minSpeed = this.maxSpeed * 0.1;
        if(Math.abs(this.vx) > minSpeed)  this.x += this.vx;
        if(Math.abs(this.vy) > minSpeed)  this.y += this.vy;

        this.vx *= 0.2;
        this.vy *= 0.2;

        this.position.x = this.x;
        this.position.y = this.y;

        this.fx = 0; 
        this.fy = 0;
    }

    /**
     * Draws the vertex on the canvas.
     */
    draw(){
        let ctx = scene.ctx;
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

    /**
     * Checks if the vertex is out of canvas bounds.
     * @returns {boolean}
     */
    outofBounds(){
        let scale = scene.scale;
        let panOffset = scene.panOffset;
        let screenX = this.x * scale + panOffset.x;
        let screenY = this.y * scale + panOffset.y;

        if(screenX < 0 || screenX > canvasWidth || screenY < 0 || screenY > canvasHeight) {
            return true;
        }
        else {
            return false;
        }

    }
}

