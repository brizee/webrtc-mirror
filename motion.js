var Motion= new function(){
	// Set up member variables
	this.lastImage = null;
	this.renderMovemap = false;
	this.moveMap = null;
	this.context = null;
	this.image = null;
	this.ready = false;
	
	this.setVideo = function(video){
	// Stores the video tag within the class and prepares the module for use
	this.video = video;
	context.save();
	context.drawImage(video,0,0,800,600);
	context.restore();
	this.lastImage = context.getImageData(0,0,800,600);
	this.ready = true;
	};
this.update =  function(freeze){
if(!this.video){
	console.error("Motion.update called before Motion.video is set");
	return;
}

var context = this.context;
	context.save();
	context.translate(800,0);
	context.scale(-1,1);
	context.drawImage(this.video,0,0,800,600);
	context.restore();
	
	if(!freeze)
		document.getElementById('fcanvas').getContext('2d').drawImage(video,0,0,800,600);
		var d = context.getImageData(0,0,800,600);	// Store a working copy of image data for rendering output of motion
		var curImage = context.getImageData(0,0,800,600); // Store a working copy of image data for processing
		for(var i = 0; i < 800*600*4;i+=4){
			// For each pixel calculate whether the colour change has exceeded the threshold
			var changed = false;
		for(var t = 0; t < 3; t++){
			if(Math.abs(curImage.data[i] - this.lastImage.data[i]) > 50)
				changed = true;
		}
		
			for(var t = 0; t < 3; t++){
				
				// If no motion detected black out this pixel on output
				if(!changed){
				d.data[i+t] = 0;
				
			}
		}
		}
		
		this.moveMap = d;	// Store output as a member variable for later use
		this.lastImage = curImage;  // Update the previous image 
};
this.render = function (context){
	if(this.renderMovement)	// If rendering motion controller data then put that on the screen
		context.putImageData(this.moveMap,0,0);
		else{	// If not then make sure image data if flipped in the x for more intuitive movement
		context.save();
	context.translate(800,0);
	context.scale(-1,1);
	context.putImageData(this.image,0,0);
	context.restore();
		}
}
this.collisionCheck = function (x1,y1,x2,y2){
	// Do bounding box collision detection looking for movement pixels
	for(var x = x1; x < x2; x++){
		for(var y = y1; y < y2; y++){
			var id = y * 800 + x;
		if(this.moveMap.data[id*4+2] > 0){
				return true;
				
		}
			
		}}
		return false;
	
}
}