var stage;

function init() {
	stage = new createjs.Stage('canvas');

	var ss = new createjs.SpriteSheet({
		images: [""],
		frames: {width: 50, height: 75, regX: 240, regY: 20},
		animations: {
			"run": [0, 10],
		}
	});

	var sprite = new createjs.Sprite(ss, "run");

	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", stage);
	stage.addChild(sprite);
	
}

