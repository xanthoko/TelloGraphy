class Drawer {
    constructor(x, y) {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        this.altCanvas = document.getElementById("altCanvas");
        this.altCtx = this.altCanvas.getContext("2d");
        this.altCtx.lineWidth = 2;
        this.altCanvas.width = this.altCanvas.offsetWidth;
        this.altCanvas.height = this.altCanvas.offsetHeight

        this.distSlider = document.getElementById("distRange");
        this.angleSlider = document.getElementById("angleRange");
        this.speedSlider = document.getElementById("speedRange");
        this.distT = document.getElementById("distT");
        this.angleT = document.getElementById("angleT");
        this.speedT = document.getElementById("speedT");

        // starting point is set to the middle of the canvas
        this.startX = this.canvas.width / 2;
        this.startY = this.canvas.height / 2;
        this.startZ = this.altCanvas.offsetHeight / 2;

        // position intialized
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.z = this.altCanvas.offsetHeight / 2;
        this.angle = 0;
        this.speed = 10;

        this.distance = 20;
        this.rotation = 10;

        // the steps of the tello movement
        this.steps = [];

        // draw initial tringle
        this.drawTriangle(this.startX, this.startY);
    }

    move(direction) {
        // update the steps array with the given direction
        const distnace = this.distSlider.value;
        const speed = this.speedSlider.value;
        // move command format: '{direction} {distance} {speed}'
        var fullMove = direction + ' ' + distnace + ' ' + speed;
        this.steps.push(fullMove);

        // clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.altCtx.clearRect(0, 0, this.altCanvas.offsetWidth, this.altCanvas.offsetHeight);

        // draw the updated path
        this.drawPath();
    }

    rotate(direction) {
        console.log('here');
    }

    getDestination(step) {
        var newX = 0;
        var newY = 0;
        var newZ = 0;

        var tiles = step.split(' ');
        var direction = tiles[0];
        var distance = parseInt(tiles[1]);

        // scale down the distance drawn in canvas
        distance = distance * 0.8;
        const altitude = distance * 0.3;

        // according to the given direction set the change of the position
        switch (direction) {
            case "forward":
                newY = -distance;
                break;
            case "back":
                newY = distance;
                break;
            case "left":
                newX = -distance;
                break;
            case "right":
                newX = distance;
                break;
            case "up":
                newZ = -altitude;
                break;
            case "down":
                newZ = +altitude;
                break;
        }

        // updated position
        newX = this.x + newX;
        newY = this.y + newY;
        newZ = this.z + newZ;

        return [newX, newY, newZ]
    }

    drawPath() {
        // reset the position to the starting point
        this.x = this.startX;
        this.y = this.startY;
        this.z = this.startZ;

        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);

        for (var i = 0; i < this.steps.length; i++) {
            // destination poin after the given direction
            var dst = this.getDestination(this.steps[i]);

            // update position
            this.x = dst[0];
            this.y = dst[1];

            this.drawAltitude(i, this.z, dst[2]);
            this.z = dst[2];

            this.ctx.lineTo(dst[0], dst[1]);
        }
        this.ctx.stroke();

        this.drawTriangle(this.x, this.y);
    }

    drawTriangle(dstX, dstY) {
        this.ctx.beginPath();
        // width: 16, height:6
        this.ctx.moveTo(dstX - 8, dstY);
        this.ctx.lineTo(dstX + 8, dstY);
        this.ctx.lineTo(dstX, dstY - 6);
        this.ctx.lineTo(dstX - 8, dstY);
        this.ctx.lineWidth = 2;
        console.log(dstX, dstY)

        this.ctx.stroke();
    }

    drawAltitude(step, altStart, altEnd) {
        this.altCtx.beginPath();
        const sLength = 50;

        var startX = step * sLength + 10;
        var endX = (step + 1) * sLength;

        this.altCtx.moveTo(startX, altStart);
        this.altCtx.lineTo(endX, altEnd);
        this.altCtx.stroke();
    }

    clear() {
        // clear the drawn canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.altCtx.clearRect(0, 0, this.altCanvas.offsetWidth, this.altCanvas.offsetHeight);

        // clear the steps array
        this.steps = [];

        // draw the initial pointer
        this.drawTriangle(this.startX, this.startY);

        // reset the slider values
        this.distSlider.value = 20;
        this.distT.innerHTML = 20;

        this.angleSlider.value = 10;
        this.angleT.innerHTML = 10;

        this.speedSlider.value = 10;
        this.speedT.innerHTML = 10;
    }

    undo() {
        // remove the latest movement direction
        this.steps.splice(-1, 1)
        // clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.altCtx.clearRect(0, 0, this.altCanvas.offsetWidth, this.altCanvas.offsetHeight);

        // draw the updated path
        this.drawPath()
    }

    execute() {
        var request = new XMLHttpRequest();
        // POST to httpbin which returns the POST data as JSON
        request.open('POST', '');

        var formData = new FormData();
        formData.append('steps', this.steps);

        request.send(formData);
    }
}


const drawer = new Drawer();
