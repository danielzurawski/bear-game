// function Matrix(rows, columns) {
// 	this.rows = rows;
// 	this.columns = columns;
// 	this.array = new Array(this.rows);

// 	for (var i = 0; i < this.columns; i++) {
// 		this.array[i] = new Array(this.rows);
// 	}
// 	return this.array;
// }

function Tile(x, y, special, walkable) {
	this.x = x;
	this.y = y;
	this.walkable = walkable;
	this.special = special;
}

var resultElem = document.getElementById("result");
var world = [];

function assembleWorld() {
	for(var x = 0; x < 20; x++) {
		world[x] = [];
		for(var y = 0; y < 20; y++) {
			if (x == 0 || y == 0 || x == 19 || y == 19) {
				world[x][y] = new Tile(x, y, 'stoneWall', false)
			} else {
				world[x][y] = new Tile(x, y, 'grass', true);
			}
		}
	}	
}

var specialSymbols = {
	'wall': '  || ',
	'bear': 'B',
	'human': ' * ',
	'grass': ' u ',
	'stoneWall': ' 0 '
}

function printWorld(elem) {
	elem.innerHTML = '';
	for(var i = 0; i < world.length; i++) {
		for(var j = 0; j < world[i].length; j++) {
			if (world[i][j].tracks) {
				elem.innerHTML = elem.innerHTML + ' x ';
				continue;
			}
			var specialSymbol = specialSymbols[world[i][j].special];
			if (specialSymbol) {
				if (j == world[i].length-1) elem.innerHTML = elem.innerHTML + specialSymbol + '<br>';
				else elem.innerHTML = elem.innerHTML + specialSymbol;
				continue;
			}
		}
	}	
}

function addWall(world, wall) {
	world[wall.x][wall.y] = wall;
}

function addBear(world, bear) {
	world[bear.x][bear.y] = bear;
}

function addBear(world, bear) {
	world[bear.x][bear.y] = bear;
}

function addHuman(world, human) {
	world[human.x][human.y] = human;
}

/* 
 * This is a primitive implementation of an A* search 
 * to allow bear find the human and eat him. 
 */
function aStar(startingTile, targetTile) {
	console.log('Searching using A*');
	var openObj = {};
	var visited = {};
	startingTile.G = 0;
	// Calculate heuristic distance using Manhattan distance method
	startingTile.H = hDistance(startingTile, targetTile);
	openObj[String(startingTile.x)+String(startingTile.y)] = startingTile;

	do {
		var currentTile = tileWithLowestFScore(openObj);
		visited[String(currentTile.x)+String(currentTile.y)] = currentTile;
		removeTile(openObj, currentTile);

		if (currentTile.x == targetTile.x && currentTile.y == targetTile.y) {
			console.log('FOUND HUMAN, YUM!')
			var tile = currentTile;
			do {
				console.log('Backtracking: ', tile);
				tile.parent.tracks = true;
				tile = tile.parent;
			} while(tile);
			break;
		}
		
		// Get neighbour tiles that are not special tiles (bear, human, wall)
		var adjacentTiles = getAdjacentTiles(currentTile);
		for (var i = 0; i < adjacentTiles.length; i++) {
			var neighbour = adjacentTiles[i];
			
			// If an adjacent tile was visited, skip to next neighbour
			if (visited[String(neighbour.x)+String(neighbour.y)]) {
				continue;
			} 

			var G = currentTile.G + 1;
			// Neighbour is not in the open object
			if (! openObj[String(neighbour.x)+String(neighbour.y)]) {
				neighbour.G = G;
				neighbour.H = hDistance(neighbour, targetTile);
				neighbour.parent = currentTile;
				openObj[String(neighbour.x)+String(neighbour.y)] = neighbour;
			} else if (G < neighbour.G) {
				neighbour.parent = currentTile;
				neighbour.G = currentTile.G + 1;
				neighbour.H = hDistance(neighbour, targetTile);
			}
		}
		
	} while (Object.keys(openObj).length);

	// Heuristic Manhattan distance
	function hDistance(tile1, tile2) {
		return Math.abs((tile1.x - tile2.x) + (tile1.y - tile2.y));
	}

	function removeTile(obj, tile) {
		for (var tileKey in obj) {
			if (tileKey == (String(tile.x) + String(tile.y))) delete obj[tileKey];
		}
	}

	function tileWithLowestFScore(obj) {
		var lowestTile = obj[Object.keys(obj)[0]];
		for (var key in obj) {
			if ((obj[key].G + obj[key].H) < (lowestTile.G + lowestTile.H)) lowestTile = obj[key];
		}
		return lowestTile;
	}

	function getAdjacentTiles(currentPosition) {
		var adjacentTiles = [];
		try {
			var west = world[currentPosition.x][currentPosition.y-1];
			var south = world[currentPosition.x+1][currentPosition.y];
			var east = world[currentPosition.x][currentPosition.y+1];
			var north = world[currentPosition.x-1][currentPosition.y];
			if (east && east.walkable) adjacentTiles.push(east);
			if (west && west.walkable) adjacentTiles.push(west);
			if (north && north.walkable) adjacentTiles.push(north);
			if (south && south.walkable) adjacentTiles.push(south);
		} catch (e) {
		}
		return adjacentTiles;
	}
}

function main() {
	assembleWorld();

	var bear1 = new Tile(11, 4, 'bear')
	addBear(world, bear1);
	
	addWall(world, new Tile(9, 8, 'wall', false));
	addWall(world, new Tile(9, 9, 'wall', false));
	addWall(world, new Tile(9, 10, 'wall', false));
	addWall(world, new Tile(9, 11, 'wall', false));
	addWall(world, new Tile(9, 12, 'wall', false));
	addWall(world, new Tile(10, 12, 'wall', false));
	
	addWall(world, new Tile(10, 8, 'wall', false));
	
	addWall(world, new Tile(11, 8, 'wall', false));
	addWall(world, new Tile(11, 12, 'wall', false));

	addWall(world, new Tile(12, 8, 'wall', false));
	addWall(world, new Tile(12, 9, 'wall', false));
	addWall(world, new Tile(12, 10, 'wall', false));
	addWall(world, new Tile(11, 10, 'wall', false));
	
	var human1 = new Tile(11, 9, 'human', true)
	addHuman(world, human1);
	
	// Print initial world
	printWorld(resultElem);
	// Bear, go find the human!
	aStar(bear1, human1);
}

function showResult() {
	// Show bears tracks after the human is eaten
	printWorld(resultElem);
}