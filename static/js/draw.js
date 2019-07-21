class Drawer {
    constructor(x, y) {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");

        // starting point is set to the middle of the canvas
        this.start_x = this.canvas.width / 2;
        this.start_y = this.canvas.height / 2;

        // position intialized
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;

        // the steps of the tello movement
        this.steps = [];

        // draw initial tringle
        this.draw_triangle(this.start_x, this.start_y);
    }

    move(direction) {
        // update the steps array with the given direction
        this.steps.push(direction);
        console.log(this.steps);

        // clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw the updated path
        this.draw_path();
    }

    get_destination(direction) {
        var new_x = 0;
        var new_y = 0;

        // according to the given direction set the change of the position
        switch (direction) {
            case "forward":
                new_x = 0;
                new_y = -50;
                break;
            case "back":
                new_x = 0;
                new_y = 50;
                break;
            case "left":
                new_x = -50;
                new_y = 0;
                break;
            case "right":
                new_x = 50;
                new_y = 0;
                break;
        }

        // updated position
        new_x = this.x + new_x;
        new_y = this.y + new_y;

        return [new_x, new_y]
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
