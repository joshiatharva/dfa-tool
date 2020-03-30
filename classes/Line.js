
export default class Line {
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
    
    // getAnchor() {
    //     var dx = this.nodeB.x - this.nodeA.x;
    //     var dy = this.nodeB.y - this.nodeA.y;
    //     var scale = Math.sqrt(dx * dx + dy * dy);
    //     return {
    //         'x': this.nodeA.x + dx * this.parallel - dy * this.perpendicular / scale,
    //         'y': this.nodeA.y + dy * this.parallel + dx * this.perpendicular / scale,
    //     };
    // }
    // setAnchor(x,y) {
    //     var dx = this.nodeB.x - this.nodeA.x;
    //     var dy = this.nodeB.y - this.nodeA.y;
    //     var scale = Math.sqrt(dx * dx + dy * dy);
    //     this.parallel = (dx * (x - this.nodeA.x) + dy * (y - this.nodeA.y)) / (scale * scale);
	// 	this.perpendicular = (dx * (y - this.nodeA.y) - dy * (x - this.nodeA.x)) / scale;
	// 	// snap to a straight line
	// 	if (this.parallel > 0 && this.parallel < 1 && Math.abs(this.perpendicular) < snapToPadding) {
	// 		this.angleAdjust = (this.perpendicular < 0) * Math.PI;
	// 		this.perpendicular = 0;
	// 	}
    //     return {
    //         'x': this.nodeA.x + dx * this.parallel - dy * this.perpendicular / scale,
    //         'y': this.nodeA.y + dy * this.parallel + dx * this.perpendicular / scale,
    //     };
    // }
    det(a, b, c, d, e, f, g, h, i) {
        return a*e*i + b*f*g + c*d*h - a*f*h - b*d*i - c*e*g;
    }
    
    circleFromThreePoints(x1, y1, x2, y2, x3, y3) {
        var a = det(x1, y1, 1, x2, y2, 1, x3, y3, 1);
        var bx = -det(x1*x1 + y1*y1, y1, 1, x2*x2 + y2*y2, y2, 1, x3*x3 + y3*y3, y3, 1);
        var by = det(x1*x1 + y1*y1, x1, 1, x2*x2 + y2*y2, x2, 1, x3*x3 + y3*y3, x3, 1);
        var c = -det(x1*x1 + y1*y1, x1, y1, x2*x2 + y2*y2, x2, y2, x3*x3 + y3*y3, x3, y3);
        return {
            'x': -bx / (2*a),
            'y': -by / (2*a),
            'radius': Math.sqrt(bx*bx + by*by - 4*a*c) / (2*Math.abs(a))
        };
    }
    getEndPointsOnCircle() {
        if (this.perpendicular == 0) {
            var midX = (this.nodeA.x + this.nodeB.x) / 2;
            var midY = (this.nodeA.y + this.nodeB.y) / 2;
            var start = this.nodeA.closestPointsOnCircle(midX, midY);
            var end = this.nodeB.closestPointsOnCircle(midX, midY);
            return {
                'hasCircle': false,
                'startX': start.x,
                'startY': start.y,
                'endX': end.x,
                'endY': end.y,
            };
        }
        var anchor = this.getAnchor()
        var circle = this.circleFromThreePoints(this.nodeA.x, this.nodeA.y, this.nodeB.x, this.nodeB.y, anchor.x, anchor.y);
        var isReversed = (this.perpendicular > 0);
        var reverseScale = isReversed ? 1: -1;
        var startAngle = Math.atan2(this.nodeA.y - circle.y, this.nodeA.x - circle.x) - reverseScale * this.radius / circle.radius;
        var endAngle = Math.atan2(this.nodeB.y - circle.y, this.nodeB.x - circle-x) + reverseScale * this.radius / circle.radius;
        var startX = circle.x + circle.radius * Math.cos(startAngle);
        var startY = circle.y + circle.radius * Math.sin(startAngle);
        var endX = circle.x + circle.radius * Math.cos(endAngle);
        var endY = circle.y + circle.radius * Math.sin(endAngle);
        return {
            'hasCircle': true,
            'startX': startX,
            'startY': startY,
            'endX': endX,
            'endY': endY,
            'startAngle': startAngle,
            'endAngle': endAngle,
            'circleX': circle.x,
            'circleY': circle.y,
            'circleRadius': circle.radius,
            'reverseScale': reverseScale,
            'isReversed': isReversed,
        };
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
                // if (Math.atan(arg) < theta * (Math.PI/2)) {
                //     this.oX = a.x + a.radius;
                //     this.oY = a.y;
                //     this.eX = b.x - b.radius;
                //     this.eY = b.y;
                //     c.moveTo(this.oX, this.oY);
                //     c.lineTo(this.eX, this.eY);
                // }
                // if (b.x < a.x) {
                //     var arg = (a.y - b.y) / (a.x - b.x);
                // } 

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

            // if (a.x == b.x) {
            //     if (a.y < b.y) {
            //         // b directly on top of a
            //         this.oX = a.x;
            //         this.oY = a.y + a.radius;
            //         this.eX = b.x;
            //         this.eY = b.y - b.radius;
            //         c.moveTo(this.oX, this.oY);
            //         c.lineTo(this.eX, this.eY);
            //     }
            //     if (a.y > b.y) {
            //         this.oX = a.x;
            //         this.oY = a.y - a.radius;
            //         this.eX = b.x;
            //         this.eY = b.y + b.radius;
            //         c.moveTo(this.oX, this.oY);
            //         c.lineTo(this.eX, this.eY);
            //     }
            // }
            // if (a.x < b.x) {
            //     var arg = (b.y - a.y) / ((b.x-b.radius) - (a.x + a.radius));
            //     if (a.y < b.y) {
            //         if (Math.atan(arg) <= 0.25 * Math.PI) {
            //             console.log(Math.atan((this.eY - this.oY) / (this.eX - this.oX)));
            //             this.oX = a.x + a.radius;
            //             this.oY = a.y;
            //             this.eX = b.x - b.radius;
            //             this.eY = b.y;
            //             c.moveTo(this.oX, this.oY);
            //             c.lineTo(this.eX, this.eY);
            //         }
            //         if (Math.atan(arg) > 0.25 * Math.PI) {
            //             this.oX = a.x;
            //             this.oY = a.y + a.radius;
            //             this.eX = b.x;
            //             this.eY = b.y - b.radius;
            //             c.moveTo(this.oX, this.oY);
            //             c.lineTo(this.eX, this.eY);
            //         }
            //     }
            //     else if (a.y > b.y) {
            //         if (Math.atan(arg) >= -0.25*Math.PI) {
            //             this.oX = a.x+a.radius;
            //             this.oY = a.y;
            //             this.eX = b.x - b.radius;
            //             this.eY = b.y;
            //             c.moveTo(this.oX, this.oY);
            //             c.lineTo(this.eX, this.eY);
            //         }
            //         if (Math.atan(arg) < 0.25*Math.PI) {
            //             this.oX = a.x;
            //             this.oY = a.y - a.radius;
            //             this.eX = b.x;
            //             this.eY = b.y + b.radius;
            //             c.moveTo(this.oX, this.oY);
            //             c.lineTo(this.eX, this.eY);
            //         } 
            //     }
            //     // this.oX = a.x + a.radius;
            //     // this.oY = a.y;
            //     // this.eX = b.x - b.radius;
            //     // this.eY = b.y; 
            //     // c.moveTo(this.oX, this.oY);
            //     // c.lineTo(this.eX, this.eY);
            // } else {
            //     this.oX = a.x  + a.radius;
            //     this.oY = a.y;
            //     this.eX = b.x - b.radius;
            //     this.eY = b.y;
            // // var isReversed = (this.perpendicular > 0);
            // // var reverseScale = isReversed ? 1: -1;
            // // var startAngle = Math.atan2(this.nodeA.y - circle.y, this.nodeA.x - circle.x) - reverseScale * this.radius / circle.radius;
            // // var endAngle = Math.atan2(this.nodeB.y - circle.y, this.nodeB.x - circle-x) + reverseScale * this.radius / circle.radius;
            // c.moveTo(this.oX, this.oY);
            // c.lineTo(this.eX, this.eY);
            // }
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
                // if (Math.atan(arg) < theta * (Math.PI/2)) {
                //     var startX = a.x + a.radius;
                //     var startY = a.y;
                //     var endX = b.x - b.radius;
                //     var endY = b.y;
                //     c.moveTo(startX, startY);
                //     c.lineTo(endX, endY);
                // }
                // if (b.x < a.x) {
                //     var arg = (a.y - b.y) / (a.x - b.x);
                // } 

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

    drawForwardAuto(c) {
        if (this.nodeA != null && this.nodeB != null) {
            c.beginPath()
            var startX = a.x + a.radius;
            var startY = a.y;
            var endX = b.x - b.radius;
            var endY = b.y; 
            c.moveTo(startX, startY);
            c.lineTo(endX, endY);
            c.stroke(); 
        }
    }
    
    drawReverseAuto(c) {
        c.beginPath()

    }

    containsPoint(x, y) {
        var stuff = this.getEndPointsOnCircle();
        if (stuff.hasCircle) {
            var dx = x - stuff.circleX;
            var dy = y - stuff.circleY;
            var distance = Math.sqrt(dx * dx + dy * dy) - stuff.circleRadius;
            if (Math.abs(distance) < hitTargetPadding) {
				var angle = Math.atan2(dy, dx);
				var startAngle = stuff.startAngle;
				var endAngle = stuff.endAngle;
				if (stuff.isReversed) {
					var temp = startAngle;
					startAngle = endAngle;
					endAngle = temp;
				}
				if (endAngle < startAngle) {
					endAngle += Math.PI * 2;
				}
				if (angle < startAngle) {
					angle += Math.PI * 2;
				}
				else if (angle > endAngle) {
					angle -= Math.PI * 2;
				}
				return (angle > startAngle && angle < endAngle);
			}
		} else {
			var dx = stuff.endX - stuff.startX;
			var dy = stuff.endY - stuff.startY;
			var length = Math.sqrt(dx * dx + dy * dy);
			var percent = (dx * (x - stuff.startX) + dy * (y - stuff.startY)) / (length * length);
			var distance = (dx * (y - stuff.startY) - dy * (x - stuff.startX)) / length;
			return (percent > 0 && percent < 1 && Math.abs(distance) < hitTargetPadding);
		} return false;
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
    // write (c, text) {
    //     var greekLetterNames = [ 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega' ];
    //     for(var i = 0; i < greekLetterNames.length; i++) {
	// 	    var name = greekLetterNames[i];
	// 	    text = text.replace(new RegExp('\\\\' + name, 'g'), String.fromCharCode(913 + i + (i > 16)));
	//     	text = text.replace(new RegExp('\\\\' + name.toLowerCase(), 'g'), String.fromCharCode(945 + i + (i > 16)));
    //     }
    //     if (text.includes("_")) {
    //         first = text.split("_")[0];
    //         last = text.split("_")[1];
    //         text = first+last.sub();
    //     }
    //     c.font = "10px Arial";
    //     c.fillText(text, ((b.x-a.x) /2), ((b.y-a.y/2)));
    // }

}