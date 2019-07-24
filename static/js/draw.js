class Drawer {
    constructor(x, y) {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.slider1 = document.getElementById("myRange1");
        this.slider2 = document.getElementById("myRange2");
        this.out1 = document.getElementById("out1");
        this.out2 = document.getElementById("out2");

        // starting point is set to the middle of the canvas
        this.start_x = this.canvas.width / 2;
        this.start_y = this.canvas.height / 2;

        // position intialized
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.z = 0;
        this.angle = 0;

        this.distance = 20;
        this.rotation = 5;

        // the steps of the tello movement
        this.steps = [];

        // draw initial tringle
        this.draw_triangle(this.start_x, this.start_y);
    }

    move(direction) {
        // update the steps array with the given direction
        var full_move = direction + ' ' + this.slider1.value;
        this.steps.push(full_move);

        // clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw the updated path
        this.draw_path();
    }

    rotate(direction) {
        console.log('here');
    }

    get_destination(step) {
        var new_x = 0;
        var new_y = 0;
        var new_z = 0;

        var tiles = step.split(' ');
        var direction = tiles[0];
        var distance = parseInt(tiles[1]);

        // according to the given direction set the change of the position
        switch (direction) {
            case "forward":
                new_y = -distance;
                break;
            case "back":
                new_y = distance;
                break;
            case "left":
                new_x = -distance;
                break;
            case "right":
                new_x = distance;
                break;
            case "up":
                new_z = distance;
                break;
            case "down":
                new_z = -distance;
                break;
        }

        // updated position
        new_x = this.x + new_x;
        new_y = this.y + new_y;
        new_z = this.z + new_z;

        return [new_x, new_y, new_z]
    }

    draw_path() {
        // reset the position to the starting point
        this.x = this.start_x;
        this.y = this.start_y;

        this.ctx.beginPath();
        this.ctx.moveTo(this.start_x, this.start_y);

        for (var i = 0; i < this.steps.length; i++) {
            // destination poin after the given direction
            var dst = this.get_destination(this.steps[i]);

            // update position
            this.x = dst[0];
            this.y = dst[1];

            this.ctx.lineTo(dst[0], dst[1]);
        }
        this.ctx.stroke();

        this.draw_triangle(this.x, this.y);
    }

    draw_triangle(dst_x, dst_y, angle = 0) {
        this.ctx.beginPath();
        // width: 17, height:7
        this.ctx.moveTo(dst_x - 8, dst_y);
        this.ctx.lineTo(dst_x + 8, dst_y);
        this.ctx.lineTo(dst_x, dst_y - 6);
        this.ctx.lineTo(dst_x - 8, dst_y);
        this.ctx.lineWidth = 2;

        this.ctx.stroke();
    }

    clear() {
        // clear the drawn canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // clear the steps array
        this.steps = [];
        // draw the initial pointer
        this.draw_path();

        this.slider1.value = 20;
        this.out1.innerHTML = 20;

        this.slider2.value = 20;
        this.out2.innerHTML = 20;
    }

    undo() {
        // remove the latest movement direction
        this.steps.splice(-1, 1)
        // clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // draw the updated path
        this.draw_path()
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
