// ***** Game *****

function Game(nShips, context) {
	var allShips = [
		new Ship(50, MAX_HEIGHT / 2, 0, 0, SHIP_MAX_SPEED, SHIP_MAX_SPEED, SHIP_ACCELERATION, SHIP_ACCELERATION, FLUID_BRAKE, FLUID_BRAKE, 8, FLAT_ORANGE, SHIP_LIVES, "left", "right", "up", "down"),
		new Ship(150, MAX_HEIGHT / 2, 0, 0, SHIP_MAX_SPEED, SHIP_MAX_SPEED, SHIP_ACCELERATION, SHIP_ACCELERATION, FLUID_BRAKE, FLUID_BRAKE, 8, FLAT_PURPLE, SHIP_LIVES, "s", "f", "e", "d")
	];

	screenLeft.innerHTML = "";
	screenRight.innerHTML = "";
	screenClock.innerHTML = "";
	pauseEntity.style.display = "inline";

	this.mainClock = 0;
	this.gameDuration = GAME_DURATION;
	this.play = true;
	this.IsOver = false;

	this.tunnel = new Tunnel(MAX_WIDTH, TUNNEL_INIT_SPEED, TUNNEL_MAX_SPEED, TUNNEL_FREQUENCY_ACCELERATION, MIN_THRESHOLD, MAX_THRESHOLD, INIT_SUMMIT, FLAT_GRAY, FLAT_GRAY, ctx);
	this.ships = [];
	this.meteorShower = new MeteorShower();


	screenPlayers = [];

	for (var i = 0; i < nShips && i < allShips.length; i++) {
		this.ships[i] = allShips[i];
	}

	for (var i = 0, n = this.ships.length; i < n; i++) {
		if (i % 2 == 0) {
			screenLeft.innerHTML += "<div id=\"player" + i + "\" class=\"player\"><div class=\"lives\"></div><div class=\"score\"></div><div class=\"gameOver\"></div></div>";
		} else {
			screenRight.innerHTML += "<div id=\"player" + i + "\" class=\"player\"><div class=\"lives\"></div><div class=\"score\"></div><div class=\"gameOver\"></div></div>";
		}
	}

	for (var i = 0, n = this.ships.length; i < n; i++) {
		screenPlayers[i] = document.getElementById("player" + i);
	}

	if (this.ships.length > 0) {
		screenAll.style.display = "table";
		buttons.style.display = "block";
		menu.style.display = "none";
	} else {
		screenAll.style.display = "none";
		buttons.style.display = "none";
		menu.style.display = "block";
	}




	this.findWinner = function() {
		if (this.ships.length > 1) {
			var res = 0;
			var k = 0;

			for (var i = 0, n = this.ships.length; i < n; i++) {
				this.ships[i].invincibility = true;
				this.ships[i].invincibilityClock = 10;

				if (this.ships[i].score > res && this.ships[i].lives > 0) {
					k = i;
					res = this.ships[i].score;
				}

				screenPlayers[i].childNodes[1].innerHTML = "Score : <span style=\"color: " + this.ships[i].color + ";\">" + this.ships[i].score + "</span>";
			}

			var q = k + 1;

			screenClock.innerHTML = screenClock.innerHTML + "<br/><span style=color:" + this.ships[k].color + ";> WINNER : PLAYER " + q + "</span>";
		} else {
			screenPlayers[0].childNodes[1].innerHTML = "Score : <span style=\"color: " + this.ships[0].color + ";\">" + this.ships[0].score + "</span>";
			screenRight.innerHTML = "<div style=\"display: inline-block; vertical-align: top; margin-right: 5px;\">Share on</div><div style=\"color: #919191; display: inline-block; vertical-align: top; text-align: left; margin-left: 5px;\"><div>/ <a href=\"http://www.facebook.com/sharer.php?app_id=643746005713643&amp;sdk=joey&amp;u=http%3A%2F%2Fflatracing.github.io%2F&amp;display=popup&amp;ref=plugin\" target=\"_blank\" style=\"color: #3b5998;\">Facebook</a></div><div>/ <a href=\"https://twitter.com/intent/tweet?original_referer=&text=I%20just%20scored%20" + this.ships[0].score + "%20at%20%23FlatRacing,%20try%20to%20beat%20me%20on:%20http%3A%2F%2Fflatracing.github.io%2F\" target=\"_blank\" style=\"color: #34beda;\">Twitter</a></div></div>"
		}
	};

	this.controller = function() {
		if (!this.isOver) {
			var gameStatus = true;

			context.clearRect(MIN_WIDTH, MIN_HEIGHT, MAX_WIDTH, MAX_HEIGHT);

			for (var i = 0, n = this.ships.length; i < n; i++) {
				this.ships[i].controller(this.tunnel, this.meteorShower, this.ships, this.mainClock, this.gameDuration, context, screenPlayers[i]);
			}

			this.tunnel.controller(context, this.mainClock);
			this.meteorShower.controller(this.tunnel, context, this.mainClock);

			if (this.mainClock % 60 == 0 && this.ships.length > 1) {
				printTime(this.gameDuration, screenClock);
				this.gameDuration--;
			}

			if (this.gameDuration == -1) {
				this.isOver = true;
				this.findWinner();
				pauseEntity.style.display = "none";
			}

			for (var i = 0, n = this.ships.length; i < n; i++) {
				if (this.ships[i].lives <= 0) {
					this.isOver = true;
					this.findWinner();
					pauseEntity.style.display = "none";
				}
			}
		} else {
			context.clearRect(MIN_WIDTH, MIN_HEIGHT, MAX_WIDTH, MAX_HEIGHT);

			for (var i = 0, n = this.ships.length; i < n; i++) {
				this.ships[i].postGameController(this.tunnel, this.meteorShower, this.ships, this.mainClock, this.gameDuration, context, screenPlayers[i]);
			}

			this.tunnel.print(context);

		}

		this.mainClock++;
	};
}
