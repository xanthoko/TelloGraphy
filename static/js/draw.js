class Drawer {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(direction) {
        var new_x = 0;
        var new_y = 0;
        switch (direction) {
            case "forward":
                new_x = 0;
                new_y = -100;
                break;
            case "back":
                new_x = 0;
                new_y = 100;
                break;
            case "left":
                new_x = -100;
                new_y = 0;
                break;
            case "right":
                new_x = 100;
                new_y = 0;
                break;
        }

        new_x = this.x + new_x;
        new_y = this.y + new_y;

        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");

        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(new_x, new_y);
        ctx.stroke();

        this.x = new_x;
        this.y = new_y;
    }
}


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const drawer = new Drawer(canvas.width / 2, canvas.height / 2);
