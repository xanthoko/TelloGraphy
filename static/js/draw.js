class Drawer {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(direction) {
        var new_x = 0;
        var new_y = 0;
        switch (direction) {
            case "up":
                new_x = 0;
                new_y = -100;
                break;
            case "down":
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

        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");

        var midx = canvas.width / 2;
        var midy = canvas.height / 2;
        ctx.beginPath();
        ctx.moveTo(midx, midy);
        ctx.lineTo(midx + new_x, midy + new_y);
        ctx.stroke();
    }
}

function draw(direction) {
    var new_x = 0;
    var new_y = 0;
    switch (direction) {
        case "up":
            new_x = 0;
            new_y = -100;
            break;
        case "down":
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


    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var midx = canvas.width / 2;
    var midy = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(midx, midy);
    ctx.lineTo(midx + new_x, midy + new_y);
    ctx.stroke();
}
