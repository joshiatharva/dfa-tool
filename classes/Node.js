export default class Node {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.acceptState = false;
        this.radius = 20
        this.name = '';
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    draw(c) { 
        c.font = '20px Arial';
        if (this.acceptState) {
            c.beginPath();
            c.arc(this.x, this.y, this.radius + 6 , 0, 2*Math.PI, false);
            c.stroke();
        } else {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
            c.fillText(this.name, this.x, this.y);
            c.stroke();
        }
    }

    closestPointsOnCircle(x,y) {
        var dx = x - this.x;
        var dy = y - this.y;
        var scale = Math.sqrt(dx * dx + dy * dy);
        console.log(x +","+ y + "," + scale);
        return {
            'x': this.x + x * this.radius / scale,
            'y': this.y + y * this.radius / scale,
        };
    }
    containsPoint(x, y) {
        if (this.acceptState) {
            return (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) < (this.radius + 6) * (this.radius + 6); 
        } else {
            return (x - this.x) * (x - this.x) + (y - this.y) * (y - this.y) < this.radius * this.radius;   
        }  
    }
}