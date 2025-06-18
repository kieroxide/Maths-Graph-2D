class Handler {
    static addEdgeFromInputs() {
        const id1 = parseInt(document.getElementById('id1').value);
        const id2 = parseInt(document.getElementById('id2').value);
        if (!isNaN(id1) && !isNaN(id2)) {
            graph.addEdge(id1, id2);
            graph.groups = Math2D.hubConnections(graph);
        }
    }

    static eventHandlers() {
        let canvas = scene.canvas;
        
        // Canvas mouse events for panning
        canvas.addEventListener('mousedown', function(e) {
            scene.isPanning = true;
            scene.panStart.x = e.clientX - scene.panOffset.x;
            scene.panStart.y = e.clientY - scene.panOffset.y;
        });

        canvas.addEventListener('mousemove', function(e) {
            if (scene.isPanning) {
                scene.panOffset.x = e.clientX - scene.panStart.x;
                scene.panOffset.y = e.clientY - scene.panStart.y;
            }
        });

        canvas.addEventListener('mouseup', function(e) {
            scene.isPanning = false;
        });

        canvas.addEventListener('mouseleave', function(e) {
            scene.isPanning = false;
        });

        // Mouse wheel for zooming
        canvas.addEventListener('wheel', function(e) {
            e.preventDefault();
            const zoomIntensity = 0.1;
            let mouseX = e.offsetX;
            let mouseY = e.offsetY;
            let wheel = e.deltaY < 0 ? 1 : -1;
            let zoom = Math.exp(wheel * zoomIntensity);

            // Adjust panOffset so zoom is centered on mouse
            scene.panOffset.x = mouseX - (mouseX - scene.panOffset.x) * zoom;
            scene.panOffset.y = mouseY - (mouseY - scene.panOffset.y) * zoom;

            scene.scale *= zoom;
            scene.scale = Math.max(scene.scaleMin, Math.min(scene.scaleMax, scene.scale));
        });

    }

    static initialiseSliders(){
        let graph = scene.graph;
        // Vertex Push
        const vertexPushSlider = document.getElementById('vertexPushSlider');
        const vertexPushValue = document.getElementById('vertexPushValue');
        vertexPushSlider.value = 10; 
        vertexPushSlider.min = 0;
        vertexPushSlider.max = 10;
        vertexPushSlider.step = 0.1;
        vertexPushValue.textContent = vertexPushSlider.value;
        vertexPushSlider.oninput = function() {
            graph.vertexPushConstant = parseFloat(this.value);
            vertexPushValue.textContent = this.value;
        };
        graph.vertexPushConstant = parseFloat(vertexPushSlider.value);

        // Edge Pull
        const edgePullSlider = document.getElementById('edgePullSlider');
        const edgePullValue = document.getElementById('edgePullValue');
        edgePullSlider.value = 0.15; 
        edgePullSlider.min = 0;
        edgePullSlider.max = 1;
        edgePullSlider.step = 0.01;
        edgePullValue.textContent = edgePullSlider.value;
        edgePullSlider.oninput = function() {
            graph.edgePullConstant = parseFloat(this.value);
            edgePullValue.textContent = this.value;
        };
        graph.edgePullConstant = parseFloat(edgePullSlider.value);

        // Stall Rotation
        const stallRotationSlider = document.getElementById('stallRotationSlider');
        const stallRotationValue = document.getElementById('stallRotationValue');
        stallRotationSlider.value = 0.05;
        stallRotationSlider.min = 0;
        stallRotationSlider.max = 1;
        stallRotationSlider.step = 0.01;
        stallRotationValue.textContent = stallRotationSlider.value;
        stallRotationSlider.oninput = function() {
            graph.stallRotationConstant = parseFloat(this.value);
            stallRotationValue.textContent = this.value;
        };
        graph.stallRotationConstant = parseFloat(stallRotationSlider.value);

        // Group Pull
        const groupPullSlider = document.getElementById('groupPullSlider');
        const groupPullValue = document.getElementById('groupPullValue');
        groupPullSlider.value = 0.01;
        groupPullSlider.min = 0;
        groupPullSlider.max = 1000;
        groupPullSlider.step = 0.001;
        groupPullValue.textContent = groupPullSlider.value;
        groupPullSlider.oninput = function() {
            graph.groupPullConstant = parseFloat(this.value);
            groupPullValue.textContent = this.value;
        };
        graph.groupPullConstant = parseFloat(groupPullSlider.value);

        // Groups Push
        const groupsPushSlider = document.getElementById('groupsPushSlider');
        const groupsPushValue = document.getElementById('groupsPushValue');
        groupsPushSlider.value = 30; 
        groupsPushSlider.min = 0;
        groupsPushSlider.max = 1000;
        groupsPushSlider.step = 1;
        groupsPushValue.textContent = groupsPushSlider.value;
        groupsPushSlider.oninput = function() {
            graph.groupsPushConstant = parseFloat(this.value);
            groupsPushValue.textContent = this.value;
        };
        graph.groupsPushConstant = parseFloat(groupsPushSlider.value);

        // Group Spacing
        const groupSpacingSlider = document.getElementById('groupSpacingSlider');
        const groupSpacingValue = document.getElementById('groupSpacingValue');
        groupSpacingSlider.value = 0.2; 
        groupSpacingSlider.min = 0;
        groupSpacingSlider.max = 1000;
        groupSpacingSlider.step = 0.01;
        groupSpacingValue.textContent = groupSpacingSlider.value;
        groupSpacingSlider.oninput = function() {
            graph.groupSpacingConstant = parseFloat(this.value);
            groupSpacingValue.textContent = this.value;
        };
        graph.groupSpacingConstant = parseFloat(groupSpacingSlider.value);

        // Edges Push
        const edgesPushSlider = document.getElementById('edgesPushSlider');
        const edgesPushValue = document.getElementById('edgesPushValue');
        edgesPushSlider.value = 0.05; 
        edgesPushSlider.min = 0;
        edgesPushSlider.max = 1000;
        edgesPushSlider.step = 0.01;
        edgesPushValue.textContent = edgesPushSlider.value;
        edgesPushSlider.oninput = function() {
            graph.edgesPushConstant = parseFloat(this.value);
            edgesPushValue.textContent = this.value;
        };
        graph.edgesPushConstant = parseFloat(edgesPushSlider.value);

        // Edge-Vertex Push
        const edgeVertPushSlider = document.getElementById('edgeVertPushSlider');
        const edgeVertPushValue = document.getElementById('edgeVertPushValue');
        edgeVertPushSlider.value = 0.05;
        edgeVertPushSlider.min = 0;
        edgeVertPushSlider.max = 1000;
        edgeVertPushSlider.step = 0.01;
        edgeVertPushValue.textContent = edgeVertPushSlider.value;
        edgeVertPushSlider.oninput = function() {
            graph.edgeVertPushConstant = parseFloat(this.value);
            edgeVertPushValue.textContent = this.value;
        };
        graph.edgeVertPushConstant = parseFloat(edgeVertPushSlider.value);

        // Hub Pull
        const hubPullSlider = document.getElementById('hubPullSlider');
        const hubPullValue = document.getElementById('hubPullValue');
        hubPullSlider.value = 0.03; 
        hubPullSlider.min = 0;
        hubPullSlider.max = 1000;
        hubPullSlider.step = 0.01;
        hubPullValue.textContent = hubPullSlider.value;
        hubPullSlider.oninput = function() {
            graph.hubPullConstant = parseFloat(this.value);
            hubPullValue.textContent = this.value;
        };
        graph.hubPullConstant = parseFloat(hubPullSlider.value);

        // Update displayed values
        vertexPushValue.textContent = vertexPushSlider.value;
        edgePullValue.textContent = edgePullSlider.value;
        stallRotationValue.textContent = stallRotationSlider.value;
        groupPullValue.textContent = groupPullSlider.value;
        groupsPushValue.textContent = groupsPushSlider.value;
        groupSpacingValue.textContent = groupSpacingSlider.value;
        edgesPushValue.textContent = edgesPushSlider.value;
        edgeVertPushValue.textContent = edgeVertPushSlider.value;
        hubPullValue.textContent = hubPullSlider.value;
    }
    static updateSliders(){
        let graph = scene.graph;

        // Helper to assign from slider
        function assignSlider(sliderId, valueId, graphProp, parse = parseFloat) {
            const slider = document.getElementById(sliderId);
            const valueSpan = document.getElementById(valueId);
            graph[graphProp] = parse(slider.value);
            valueSpan.textContent = slider.value;
            slider.oninput = function() {
                graph[graphProp] = parse(this.value);
                valueSpan.textContent = this.value;
            };
        }

        assignSlider('vertexPushSlider', 'vertexPushValue', 'vertexPushConstant');
        assignSlider('edgePullSlider', 'edgePullValue', 'edgePullConstant');
        assignSlider('stallRotationSlider', 'stallRotationValue', 'stallRotationConstant');
        assignSlider('groupPullSlider', 'groupPullValue', 'groupPullConstant');
        assignSlider('groupsPushSlider', 'groupsPushValue', 'groupsPushConstant');
        assignSlider('groupSpacingSlider', 'groupSpacingValue', 'groupSpacingConstant');
        assignSlider('edgesPushSlider', 'edgesPushValue', 'edgesPushConstant');
        assignSlider('edgeVertPushSlider', 'edgeVertPushValue', 'edgeVertPushConstant');
        assignSlider('hubPullSlider', 'hubPullValue', 'hubPullConstant');
    }
    static setupNewGraphButton() {
        const btn = document.getElementById('newGraphBtn');
        btn.onclick = function() {
            const nodes = parseInt(document.getElementById('newNodes').value);
            const extraEdges = parseInt(document.getElementById('newExtraEdges').value);

            if (isNaN(nodes) || nodes < 1) {
                alert("Please enter a valid number of nodes (at least 1).");
                return;
            }
            if (isNaN(extraEdges) || extraEdges < 0) {
                alert("Please enter a valid number of extra edges (0 or more).");
                return;
            }

            scene.nodes = nodes;
            scene.temperature = 1;
            scene.graph = GraphMaker.generateRandomConnectedGraph(nodes, extraEdges);
            Handler.updateSliders();
        };
    }
}