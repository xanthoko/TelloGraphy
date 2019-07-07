class Drawer {
    constructor(x, y) {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height / 2;
        this.steps = [];
    }

    draw(direction) {
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

        // draw line
        this.ctx.beginPath();
        this.ctx.moveTo(this.x, this.y);
        this.ctx.lineTo(new_x, new_y);
        this.ctx.stroke();

        // update the object's position
        this.x = new_x;
        this.y = new_y;

        this.steps.push(direction);
        console.log(this.steps);
    }

    clear() {
        // clear the drawn canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // clear the steps array
        this.steps = [];
    }
}


const drawer = new Drawer();
