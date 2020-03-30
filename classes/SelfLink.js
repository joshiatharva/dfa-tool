export default class SelfLoop {
    constructor(a) {
        this.node = a;
        this.anchorAngle = 0;
    }

    draw(c) {
        var startX = (this.node.y + this.node.radius);
        var endX = (this.node.y + this.node.radius);
        
    }
    getEndPointsAndCircle() {
		var circleX = this.node.x + 1.5 * nodeRadius * Math.cos(this.anchorAngle);
		var circleY = this.node.y + 1.5 * nodeRadius * Math.sin(this.anchorAngle);
		var circleRadius = 0.75 * nodeRadius;
		var startAngle = this.anchorAngle - Math.PI * 0.8;
		var endAngle = this.anchorAngle + Math.PI * 0.8;
		var startX = circleX + circleRadius * Math.cos(startAngle);
		var startY = circleY + circleRadius * Math.sin(startAngle);
		var endX = circleX + circleRadius * Math.cos(endAngle);
		var endY = circleY + circleRadius * Math.sin(endAngle);
		return {
			'hasCircle': true,
			'startX': startX,
			'startY': startY,
			'endX': endX,
			'endY': endY,
			'startAngle': startAngle,
			'endAngle': endAngle,
			'circleX': circleX,
			'circleY': circleY,
			'circleRadius': circleRadius
		};
	}
	draw(c) {
		var stuff = this.getEndPointsAndCircle();
		// draw arc
		c.beginPath();
		c.arc(stuff.circleX, stuff.circleY, stuff.circleRadius, stuff.startAngle, stuff.endAngle, false);
		c.stroke();
		// draw the text on the loop farthest from the node
		var textX = stuff.circleX + stuff.circleRadius * Math.cos(this.anchorAngle);
		var textY = stuff.circleY + stuff.circleRadius * Math.sin(this.anchorAngle);
		drawText(c, this.text, textX, textY, this.anchorAngle, selectedObject == this);
		// draw the head of the arrow
		drawArrow(c, stuff.endX, stuff.endY, stuff.endAngle + Math.PI * 0.4);
	}
	containsPoint(x, y) {
		var stuff = this.getEndPointsAndCircle();
		var dx = x - stuff.circleX;
		var dy = y - stuff.circleY;
		var distance = Math.sqrt(dx * dx + dy * dy) - stuff.circleRadius;
		return (Math.abs(distance) < hitTargetPadding);
	}
}