class Drawer {
    constructor(x, y) {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.steps = [];
    }

    move(direction) {
        var dst = this.get_destination(direction);

        const dst_x = dst[0];
        const dst_y = dst[1];

        this.draw_line(dst_x, dst_y);

        // update the steps array
        this.steps.push(direction);
        console.log(this.steps);
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

        new_x = this.x + new_x;
        new_y = this.y + new_y;

        return [new_x, new_y]
    }

    draw_line(dst_x, dst_y, erase = false) {
        // draw line
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(dst_x, dst_y);

        if (erase) {
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.lineWidth = 2;
        }
        else {
            this.ctx.lineWidth = 2;
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.strokeStyle = 'black';
        }

        this.ctx.stroke();

        // update the object's position
        this.x = dst_x;
        this.y = dst_y;
    }

    clear() {
        // clear the drawn canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // clear the steps array
        this.steps = [];
        // reset the starting coordinates
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
    }

    undo() {
        // last element of steps array contains the latest direction
        var last_direction = this.steps.splice(-1, 1)
        // find the reverse direction
        const reverse_direction_map = { 'forward': 'back', 'back': 'forward', 'left': 'right', 'right': 'left' };
        const reverse_direction = reverse_direction_map[last_direction];
        // draw a white line in the reverse direction to undo the movement
        var dst = this.get_destination(reverse_direction);
        this.draw_line(dst[0], dst[1], true);
    }
}


const drawer = new Drawer();
