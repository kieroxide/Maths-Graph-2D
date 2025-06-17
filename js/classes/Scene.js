class Scene{
    constructor(){
        this.temperature = 1; // Global temperature variable
        this.frameCount = 0;

        this.canvas;
        this.ctx;

        this.nodes = 1000;
        this.graph = new Graph(this.nodes);

        this.isPanning = false;
        this.panStart = { x: 0, y: 0 };
        this.panOffset = { x: 0, y: 0 };

        this.scale = 1;
        this.scaleMin = 0.2;
        this.scaleMax = 5;
    }
    setup(){
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        canvasWidth = this.canvas.width;
        canvasHeight = this.canvas.height;
    }

    draw(){
        this.frameCount++;
        if(this.frameCount % 15 === 0) {
            this.temperature -= 0.1/Math.sqrt(this.nodes);
            if(this.temperature < 0) {
                this.temperature = 0;
            }
            console.log(`Temperature: ${this.temperature}`);
        }

        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        let backgroundColour = '#FFFFF0';
        this.ctx.fillStyle = backgroundColour;
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        this.ctx.save();
        this.ctx.translate(this.panOffset.x, this.panOffset.y);
        this.ctx.scale(this.scale, this.scale);   // Apply zoom scale here
        this.graph.draw();
        this.ctx.restore();
    }
}