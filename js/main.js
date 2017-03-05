// ***** Main *****

var typeGame = new Game(0, ctx);
var refMainLoop;
var play = true;
var gameBeing = 0;

window.onload = function() {
	var myBrowser = detectBrowser().toLowerCase();

	if (!detectMobileBrowser() && (myBrowser.indexOf("chrome") != -1 || myBrowser.indexOf("firefox") != -1 || myBrowser.indexOf("opera") != -1 || myBrowser.indexOf("ie") != -1)) {
		mainLoop();

		onePlayer.onclick = function() {
			launchGame(1);
			return false;
		};

		twoPlayers.onclick = function() {
			launchGame(2);
			return false;
		};

		howToPlay.onclick = function() {
			var message = "Use your arrow keys to drive your ship. The aim of the game is to increase your score without bumping into the tunnel and the meteors. The more you drive on the right of the screen, the more you increase your score.\n\nIn the 2 players mode, if the countdown terminates before none of the players dies, then the winner is the player with the highest score. Feel free to bump into the other player’s ship to make him die!\n\n- Player 1: [up] [down] [left] [right]\n- Player 2: [e] [d] [s] [f]";

			alert(message);
		};

		stop.onclick = function() {
			launchGame(0);
			return false;
		};

		restart.onclick = function() {
			launchGame(gameBeing);
			return false;
		};

		playPause.onclick = function() {
			play = !play;

			if (play) {
				playPause.innerHTML = "Pause";
			} else {
				playPause.innerHTML = "Play";
			}

			return false;
		};
	} else {
		var canvas = document.getElementById("canvas");
		var menu = document.getElementById("menu");
		var screenAll = document.getElementById("screenAll");

		menu.parentNode.removeChild(menu);
		screenAll.parentNode.removeChild(screenAll);

		var message = document.createElement("div");
		canvas.parentNode.replaceChild(message, canvas);

		message.style.width = MAX_WIDTH + "px";
		message.style.height = MAX_HEIGHT + "px";
		message.style.display = "table-cell";
		message.style.textAlign = "center";
		message.style.verticalAlign = "middle";

		message.innerHTML = "Please use <span style=\"color: " + FLAT_ORANGE + ";\">Chrome</span>, <span style=\"color: " + FLAT_PURPLE + ";\">Firefox</span>, <span style=\"color: " + FLAT_BLUE + ";\">Opera</span> or <span style=\"color: " + FLAT_GREEN + ";\">IE (9, 10, 11)</span> to play.";
	}
};




// ***** Main functions *****

function mainLoop() {
	if (play) {
		typeGame.controller();
	}

	refMainLoop = requestAnimFrame(mainLoop);
}

function launchGame(n) {
	gameBeing = n;
	play = true;
	playPause.innerHTML = "Pause";
	cancelRequestAnimFrame(refMainLoop);
	typeGame = new Game(n, ctx);
	mainLoop();
}
