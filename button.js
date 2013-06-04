
function _uiButton(x,y,radius,label){
	// Setup the member variables
	this.x = x;
	this.y = y;
	this.radius = radius;
	if(label)
		this.label = label;
	else
		this.label = "Start";
	this.angle = 0;
	this.enabled = true;
	
	// Function stub in case no one declares it, users of this class should replace it with outcome behaviour
	this.onComplete = function(){};
	this.update = function(){
		if(!this.enabled)
			return;			// Check for collisions
		if(Motion.collisionCheck(this.x-this.radius,this.y-this.radius,this.x+radius,this.y+radius))
			this.angle += Math.PI/10;		// Increase Fill Rotation
		else
			this.angle -= Math.PI/50;		// Decrease Fill Rotation
		
		if(this.angle >= Math.PI*2){	// Check whether the button is filled
			this.angle = Math.PI*2;
			this.onComplete()
		}
		if(this.angle <= 0)		// Prevents a bug where both arcs are drawn in the same direction at 0 degrees in size rather than 0 & 360
			this.angle = Math.PI/50;
		
	}
	this.render = function(context){
		if(!this.enabled)
			return;
		
		// Render Grey Circle of unfilled button
		context.fillStyle="#BBB";
		context.beginPath();
		context.arc(this.x,this.y,this.radius,0,this.angle, true);
		context.closePath();
		context.fill();
		
		// Render Orange Circle of filled button
		context.fillStyle="#D66216";
		context.beginPath();
		context.arc(this.x,this.y,this.radius,0,this.angle, false);
		context.closePath();
		context.fill();	
		
		// Render Label on top of button
		context.fillStyle="#000";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.font = "bold 28px sans-serif";
		context.fillText(this.label, this.x, this.y);
	}
	
}
