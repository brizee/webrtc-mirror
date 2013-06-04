function _Game(){
// Setup member variables of the Game class
this.state = 0;
this.score = 0;
this.lives = 3;
this.background = document.getElementById('bg');
this.clouds = document.getElementById('clouds');

/* Main Update and Render Functions
	
	These simply call their state specific equivalents */
this.update =  function(){
switch(this.state){
	case 0:
		this.s_Menu.update();
		break;
	case 1:
		this.s_Game.update();
		break;
}
};
this.render = function (context){
switch(this.state){
	case 0:
		this.s_Menu.render(context);
		break;
	case 1:
		this.s_Game.render(context);
		break;
		
}
};


// StartGame function, initialises all the variables for starting or restarting the game
this.startGame = function(){
this.state = 1;
this.score = 0;
this.lives = 3;

this.s_Game.round = 0;
this.s_Game.scaleDetails = new Array(1,1,1,1);
this.s_Game.newRound();


}



// Menu State Class //
// This class is contained within the Game class //
// Contains update and render logic for the menu state //
this.s_Menu = new function(){
this.button = new _uiButton(60,60,40);
this.outline = document.getElementById('outline');
this.button.onComplete = function(){	// Event function, triggered when the button is completely filled
					
				var snapshotContainer = document.getElementById('snapshot');

				var newImg = document.createElement('img');	// Show the image on the page, where it can be copied or saved
				newImg.src = canvas.toDataURL();
				snapshotContainer.appendChild(newImg);
	this.angle = 0;
	Game.startGame();
}
this.update = function(){
	document.getElementById('fcanvas').getContext('2d').globalAlpha = 0.1;
	Motion.update();	// Update the motion tracker
		this.button.update();	// Update the Start button
}
this.render = function(context){
//Motion.render(context);	// Renders either camera output or motion tracker output depending on settings
context.drawImage(Game.background,0,510);	// Draw UI and Graphics
context.drawImage(this.outline,220,600-388-26);
context.drawImage(Game.clouds,0,-100);
this.button.render(context);
// Ensure the camera isn't rotated a funny way from playing the game
$("#flipLayer").css('-webkit-transform','scale(1,1)');

// Draw instructions onto the screen
context.font = "bold 28px Walkway, sans-serif";
context.fillStyle= "#FFF";
context.fillText("Wave over the Start button to fill it", 400, 500);
	
}
}






// Game State Class //
// This class is contained within the Game class //
// Contains update and render logic for the game state //
this.s_Game = new function(){
	// Set up member variables
this.tokens = new Array(-1,1,0,0);
this.time = -3;
this.start = false;
this.starttime = 0;
this.astarttime = 0;
this.round = 1;
this.scaleDetails = new Array(1,1,1,1);
this.shivamonkey = document.getElementById('shivamonkey');
this.chamberlain = document.getElementById('chamberlain');
this.heart = document.getElementById('heart');
this.snapshot = new Array();
this.freeze = false;

// Update Function
this.update = function(){
if(!this.start){	// Sets the start time of the game
	this.start = true;
	this.astarttime = (new Date()).getTime();
}
	if(Game.lives <= 0){	// If out of lives return to the menu
	Game.state =0;
	this.start = false;
	var snapshotContainer = document.getElementById('snapshot');
	for(var i =0; i < this.snapshot.length;i++){
	var newImg = document.createElement('img');	// Show the image on the page, where it can be copied or saved
	newImg.src = this.snapshot[i];
	snapshotContainer.appendChild(newImg);
	}
	return;
	}
var curTime = (new Date()).getTime();
	var dTime = curTime - this.starttime;	// Calculate how long since round started
	if(dTime < 3000){	// Some logic for Freeze Frame
	// If still transitioning into the game then only freeze the camera approx every other frame.
	if(this.freeze)
		document.getElementById('fcanvas').getContext('2d').globalAlpha = 0.1;
	Motion.update(false);
	return;
	}
	else // If not in freeze frame carry on as normal
	Motion.update(this.freeze);

	
	document.getElementById('fcanvas').getContext('2d').globalAlpha = 1.0;
	// Update the token in each corner of the screen
	for(var i = 0; i < 4; i++){ 
		if(this.tokens[i] == 0)	// If that corner is empty, ignore it
			continue;
		var x = i% 2;
		var y = Math.floor(i/2);
	if(Motion.collisionCheck((x * 640)+30,(y*440)+30,(x * 640)+130,(y*440)+130)){
	if(this.tokens[i] == -1){	// If the token is a monkey, lose a life and such
			Game.lives-=1;
			this.newRound();
			return;
			}
			else{		// Otherwise add to the score!
			Game.score += Math.floor(1000 + (13000-dTime)/10);
			this.tokens[i] = 0;
			var done = true;
			for(var t = 0; t < 4; t++)	// Check if the round is over
			if(this.tokens[t] == 1){
				done = false;
			}
			if(done){
				this.newRound();
				var wcanvas = document.getElementById('workcanvas').getContext('2d');
				wcanvas.drawImage(document.getElementById('fcanvas'),0,0,800,600);
				wcanvas.drawImage(document.getElementById('canvas'),0,0,800,600);
				this.snapshot.push(document.getElementById('workcanvas').toDataURL());  // Add a picture to the array of pictures
			}
			return;
			}
	}
		
	}

}


this.newRound = function(){
	
	// The future scaling details become the current ones
	this.scaleDetails[0] = this.scaleDetails[1];
	this.scaleDetails[2] = this.scaleDetails[3];
	this.scaleDetails[3] = 1;	
	// Default the next y scale to 1, so that it doesn't end up stuck upside down
	this.round++;	// Update round number
	for(var t = 0; t < 4; t++)	// Preset tokens til nil
		this.tokens[t] = 0;
	var greenCount = 1;	
	var totalCount = 2;
	this.freeze = false;
	// Calculate what extra gameplay elements should be added by how many rounds player has completed
	if(this.round > 3)
		if(Math.random() > 0.5)
		this.scaleDetails[1] = -this.scaleDetails[0];
	if(this.round > 7)
		totalCount++;
	if(this.round > 10)
		if(Math.random() > 0.7)
			this.freeze = true;
	if(this.round > 15)
		if(Math.random() > 0.7)
			this.scaleDetails[3] = -1;
	if(this.round > 25)
		totalCount++;
	if(this.round > 12)
		if(Math.random() > 0.4)
		greenCount++;
	if(this.round > 28)
		if(Math.random() > 0.6)
		greenCount++;
	
	
	// Setup each of the tokens
	while(totalCount > 0){
		var i = Math.floor(Math.random()*3.999);
		if(this.tokens[i] == 0){
			this.tokens[i] = -1;
			totalCount--;
		}
	}
	
		while(greenCount > 0){
		var i = Math.floor(Math.random()*3.999);
		if(this.tokens[i] == -1){
			this.tokens[i] = 1;
			greenCount--;
		}
	}
		
		this.starttime = (new Date()).getTime() - 1500;
}
this.render = function(context){
	var curTime = (new Date()).getTime();
	var dTime = curTime - this.starttime;
	var adTime = curTime - this.astarttime;

	//Motion.render(context);
	if(this.freeze){
		// Tint the screen ice blue if Freeze Framed
		var mag = (dTime/3000)*0.5;
		if(mag > 0.5)
			mag = 0.5;
	context.fillStyle= "rgba(212,240,255," + mag + ")";
	context.fillRect(0,0,800,600);
	$('#fcanvas').css('opacity', mag*2);
	}
	context.drawImage(Game.background,0,510);
	context.drawImage(Game.clouds,0,-100-adTime/100);
	context.save();
	// Ensure the image always appears right whilst being flipped
	context.translate(400*-(this.scaleDetails[1]-1),300*-(this.scaleDetails[3]-1));
	context.scale(this.scaleDetails[1],this.scaleDetails[3]);
	context.font = "bold 32px Walkway, sans-serif";
		context.fillStyle= "#FFF";
		if(this.freeze && dTime > 3000){
			context.fillStyle= "#000";
			context.fillText("Freeze Frame", 400,300);
	}
		for(var i = 0; i < Game.lives; i++){
	context.drawImage(this.heart,370+(i*26),60);
	}
		context.fillText(Game.score, 400, 25);
		context.restore();
		if(dTime < 3000){
		if(this.round == 1){	// Draw the score on the screen
		var secondsIn = 3-Math.floor(dTime/1000)
	context.font = "bold 32px Walkway, sans-serif";
		context.fillStyle= "#FFF";
		context.fillText(secondsIn, 400, 300);
		}
		else{
		var t = (dTime - 1500) / 1500;
		var xScale = (this.scaleDetails[1] - this.scaleDetails[0])*t;
		xScale += this.scaleDetails[0];
		var yScale = (this.scaleDetails[3] - this.scaleDetails[2])*t;
		yScale += this.scaleDetails[2];
		// Flip the image using css to avoid confusion in areas such as saving out images and collisions
		$("#flipLayer").css('-webkit-transform','scale(' + xScale + ',' + yScale + ')');
		//$("#flipLayer").css('top',(yScale-1)*-300 + 'px');
		}
		return;
	}
		$("#flipLayer").css('-webkit-transform','scale(' + this.scaleDetails[1] + ',' + this.scaleDetails[3] + ')');
		//$("#flipLayer").css('top',(this.scaleDetails[3] - 1)*-300);
		var radius = 1-((dTime - 3000)/(10000-(1000*(this.round/5))));
		
		if(radius <= 0.45)	// If time runs out then lose a life
		{
			Game.lives--;
			this.newRound();
			return;
		}
	for(var i = 0; i < 4; i++){ //Render tokens
		var x = i% 2;
		var y = Math.floor(i/2);
		if(this.tokens[i] == 1){
		context.drawImage(this.chamberlain,1,8,76,57,(x * 640)+80-(38*radius),(y*440)+80-(28.5*radius),76*radius,57*radius);
		}
		else if(this.tokens[i] == -1){
		var frame = Math.floor(dTime/125)%15;
		
		if(frame > 3)
			frame = 0;
		context.drawImage(this.shivamonkey,5,92,108,83,(x * 640)+80-(54*radius),(y*440)+80-(41.5*radius),108*radius,83*radius);
		}
		else
		continue;
	
	}

}


}

}