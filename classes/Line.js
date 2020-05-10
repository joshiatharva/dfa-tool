export default class Line {
/*************************************************************************************************** */   
// DESIGN OF THIS CLASS BASED ON THE CLASSES BUILT BY EVAN WALLACE IN HIS FINITE STATE MACHINE DESIGNER
/*************************************************************************************************** */
    constructor(a,b) {
        this.nodeA = a;
        this.nodeB = b;
        this.oX = 0.0;
        this.oY = 0.0;
        this.eX = 0.0;
        this.eY = 0.0;
        this.length = 0.0;
        this.transition = '';
    }

    getName() {
        return this.transition;
    }

    setName(transition) {
        this.transition = transition;
    }
    
    drawManual(c, a, b) {
        var radius_a = a.acceptState ? a.radius+6 : a.radius;
        var radius_b = b.acceptState ? b.radius+6 : b.radius;
        c.beginPath();
        if (a != null && b != null) {
            if (a.x == b.x) {
                if (b.y > a.y) {
                    // b below a on canvas
                    this.oX = a.x;
                    this.oY = a.y + radius_a;
                    this.eX = b.x; 
                    this.eY = b.y - radius_b;
                } else {
                    // b above a on canvas
                    this.oX = a.x;
                    this.oY = a.y - radius_a;
                    this.eX = b.x;
                    this.eY = b.y + radius_b;
                }
                c.moveTo(this.oX, this.oY);
                c.lineTo(this.eX, this.eY);
            } else if (b.x > a.x) {
                if (b.y > a.y) {
                    var arg = (b.y - a.y) / (b.x - a.x);
                    console.log(Math.atan(arg));
                    if (Math.atan(arg) > 0.75 ) {
                        console.log("case1");
                        this.oX = a.x;
                        this.oY = a.y + radius_a;
                        this.eX = b.x;
                        this.eY = b.y - radius_b;
                        c.moveTo(this.oX, this.oY);
                        c.lineTo(this.eX, this.eY);
                    } else {
                        console.log("caseA");
                        this.oX = a.x + radius_a;
                        this.oY = a.y;
                        this.eX = b.x - radius_b;
                        this.eY = b.y;
                        c.moveTo(this.oX, this.oY);
                        c.lineTo(this.eX, this.eY);
                    } 
                } else {
                    //b above a
                    var arg = (b.y - a.y) / (b.x - a.x);
                    console.log(Math.atan(arg));
                    if (Math.atan(arg) < -0.75) {
                        console.log("case2");
                        this.oX = a.x;
                        this.oY = a.y - radius_a;
                        this.eX = b.x;
                        this.eY = b.y + radius_b;
                        c.moveTo(this.oX, this.oY);
                        c.lineTo(this.eX, this.eY);
                    } else {
                        console.log("yeet");
                        this.oX = a.x + radius_a;
                        this.oY = a.y;
                        this.eX = b.x - radius_b;
                        this.eY = b.y;
                        c.moveTo(this.oX, this.oY);
                        c.lineTo(this.eX, this.eY);
                    } 
                }

            } else {
                if (b.y > a.y) {
                    // b below a
                    var arg = (b.y - a.y) / (b.x - a.x);
                    console.log(Math.atan(arg));
                    if (Math.atan(arg) < -0.75) {
                        console.log("case3");
                        this.oX = a.x;
                        this.oX = a.x;
                        this.oY = a.y + radius_a;
                        this.oY = this.oY
                        this.eX = b.x;
                        this.eX = this.eX;
                        this.eY = b.y - radius_b;
                        c.moveTo(this.oX, this.oY);
                        c.lineTo(this.eX, this.eY);
                    } else {
                        console.log("caseB")
                        this.oX = a.x - radius_a;
                        this.oY = a.y;
                        this.eX = b.x + radius_b;
                        this.eY = b.y;
                        c.moveTo(this.oX, this.oY);
                        c.lineTo(this.eX, this.eY);
                    }
                } else {
                    // b above a
                    var arg = (b.y - a.y) / (b.x - a.x);
                    console.log(Math.atan(arg));
                    if (Math.atan(arg) > 0.75) {
                        console.log("case4");
                        this.oX = a.x;
                        this.oY = a.y - radius_a;
                        this.eX = b.x;
                        this.eY = b.y + radius_b;
                        c.moveTo(this.oX, this.oY);
                        c.lineTo(this.eX, this.eY);
                    } else {
                        console.log("caseC");
                        this.oX = a.x - radius_a;
                        this.oY = a.y;
                        this.eX = b.x + radius_b;
                        this.eY = b.y;
                        c.moveTo(this.oX, this.oY);
                        c.lineTo(this.eX, this.eY);
                    }
                }
                //links going righ

            }
        }  
        c.stroke();
        this.drawArrow(c, this.eX, this.eY, Math.atan2(this.eY - this.oY, this.eX - this.oX));
    }

    drawLoop(c, a) {
        var radius_a = a.acceptState ? (a.radius + 6) : a.radius;
        console.log(radius_a);
        var length = radius_a * Math.cos(Math.PI/6);
        var centreX = a.x;
        var displacement_a = (radius_a * Math.cos(Math.PI/6));
        var centreY = a.y - displacement_a - (15*Math.cos(Math.PI/4));
        c.beginPath();
        this.oX, this.eX = centreX;
        this.oY, this.eY = centreY;
        this.length = 15;
        c.arc(centreX, centreY , 15 , 0.75*Math.PI, 0.25* Math.PI);
        var circumferenceA = 15 * Math.cos(Math.PI/4);
        var x_displacement = radius_a * Math.sin(Math.PI/6);
        // this.eX = a.x + x_displacement;
        var endY = a.y - 0;
        var startY = endY;
        var startX = a.x - circumferenceA;
        c.stroke();
        // this.drawArrow(c, endX, endY, Math.atan2(endY - startY, endX - startX));
    }

    drawText(c) {
        c.fillText(transition, this.oX, this.oY + this.length + 1);
    }

    drawManualReverse(c, a, b) {
        var radius_a = a.acceptState ? a.radius+6 : a.radius;
        var radius_b = b.acceptState ? b.radius+6 : b.radius;
        c.beginPath();
        if (a != null && b != null) {
            if (a.x == b.x) {
                if (b.y > a.y) {
                    // b below a on canvas
                    var startX = a.x;
                    var startY = a.y + radius_a;
                    var endX = b.x; 
                    var endY = b.y - radius_b;
                } else {
                    // b above a on canvas
                    var startX = a.x;
                    var startY = a.y - radius_a;
                    var endX = b.x;
                    var endY = b.y + radius_b;
                }
                c.arcTo(startX, startY, endX, endY, 50);
            } else if (b.x > a.x) {
                if (b.y > a.y) {
                    var arg = (b.y - a.y) / (b.x - a.x);
                    //console.log(Math.atan(arg));
                    if (Math.atan(arg) > 0.75 ) {
                        console.log("case1");
                        var startX = a.x;
                        var startY = a.y + radius_a;
                        var endX = b.x;
                        var endY = b.y - radius_b;
                        c.arcTo(startX, startY, endX, endY, 50);
                    } else {
                        //console.log("caseA");
                        var startX = a.x + radius_a;
                        var startY = a.y;
                        var endX = b.x - radius_b;
                        var endY = b.y;
                        c.arcTo(startX, startY, endX, endY, 50);
                    } 
                } else {
                    //b above a
                    var arg = (b.y - a.y) / (b.x - a.x);
                    //console.log(Math.atan(arg));
                    if (Math.atan(arg) < -0.75) {
                        //console.log("case2");
                        var startX = a.x;
                        var startY = a.y - radius_a;
                        var endX = b.x;
                        var endY = b.y + radius_b;
                        c.arcTo(startX, startY, endX, endY, 50);
                    } else {
                        //console.log("yeet");
                        var startX = a.x + radius_a;
                        var startY = a.y;
                        var endX = b.x - radius_b;
                        var endY = b.y;
                        c.arcTo(startX, startY, endX, endY, 50);
                    } 
                }

            } else {
                if (b.y > a.y) {
                    // b below a
                    var arg = (b.y - a.y) / (b.x - a.x);
                    console.log(Math.atan(arg));
                    if (Math.atan(arg) < -0.75) {
                        //console.log("case3");
                        var startX = a.x;
                        var startY = a.y + radius_a;
                        var endX = b.x;
                        var endY = b.y - radius_b;
                        c.arcTo(startX, startY, endX, endY, 50);
  
                    } else {
                        //console.log("caseB")
                        var startX = a.x - radius_a;
                        var startY = a.y;
                        var endX = b.x + radius_b;
                        var endY = b.y;
                        c.arcTo(startX, startY, endX, endY, 50);
                    }
                } else {
                    // b above a
                    var arg = (b.y - a.y) / (b.x - a.x);
                    console.log(Math.atan(arg));
                    if (Math.atan(arg) > 0.75) {
                        // console.log("case4");
                        var startX = a.x;
                        var startY = a.y - radius_a;
                        var endX = b.x;
                        var endY = b.y + radius_b;
                        c.arcTo(startX, startY, endX, endY, 50);
                    } else {
                        //console.log("caseC");
                        var startX = a.x - radius_a;
                        var startY = a.y;
                        var endX = b.x + radius_b;
                        var endY = b.y;
                        c.arcTo(startX, startY, endX, endY, 50);
                    }
                }
                //links going righ

            }
        }
        c.stroke();
        this.drawArrow(c, endX, endY, Math.atan2(endY - startY, endX - startX));
    }

    drawArrow(c, x, y, angle) {
        var dx = Math.cos(angle);
        var dy = Math.sin(angle);
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x - 8 * dx + 5 * dy, y - 8 * dy - 5 * dx);
        c.lineTo(x - 8 * dx - 5 * dy, y - 8 * dy + 5 * dx);
        c.stroke();
    }

}