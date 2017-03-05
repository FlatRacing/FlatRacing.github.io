// ***** Ship *****

function Ship(x, y, vx, vy, vxMax, vyMax, ax, ay, frictX, frictY, r, color, lives, keyLeft, keyRight, keyUp, keyDown) {
	this.x = x;
	this.y = y;

	this.vx = vx;
	this.vy = vy;
	this.vxMax = vxMax;
	this.vyMax = vyMax;

	this.ax = ax;
	this.ay = ay;

	this.frictX = frictX;
	this.frictY = frictY;

	this.r = r;
	this.color = color;

	this.lives = lives;
	this.score = 0;

	this.invincibility = false;
	this.invincibilityClock = 10;

	this.keyLeft = keyLeft;
	this.keyRight = keyRight;
	this.keyUp = keyUp;
	this.keyDown = keyDown;

	this.poolRemains = new PoolRemains();
	this.poolFootPrint = new Array(20);

	for (var i = 0; i < 20; i++) {
		this.poolFootPrint[i] = new FootPrint();
	}

	this.oldX = y;
	this.oldY = x;




	this.drive = function(mainClock) {
		if (KEY_STATUS[this.keyLeft]) {
			this.timeToPrint(mainClock);

			if (this.vx - this.ax * DT > -this.vxMax) {
				this.vx -= this.ax * DT;
			} else {
				this.vx = -this.vxMax;
			}
		}

		if (KEY_STATUS[this.keyRight]) {
			this.timeToPrint(mainClock);

			if (this.vx + this.ax * DT < this.vxMax) {
				this.vx += this.ax * DT;
			} else {
				this.vx = this.vxMax;
			}
		}

		if (KEY_STATUS[this.keyUp]) {
			this.timeToPrint(mainClock);

			if (this.vy - this.ay * DT > -this.vyMax) {
				this.vy -= this.ay * DT;
			} else {
				this.vy = -this.vyMax;
			}
		}

		if (KEY_STATUS[this.keyDown]) {
			this.timeToPrint(mainClock);

			if (this.vy + this.ay * DT < this.vyMax) {
				this.vy += this.ay * DT;
			} else {
				this.vy = this.vyMax;
			}
		}
	};

	this.move = function() {
		if (this.vx < 0) {
			if (this.x + this.vx * DT < MIN_WIDTH + this.r) {
				this.x = MIN_WIDTH + this.r;
			} else {
				this.x += this.vx * DT;
			}
		} else {
			if (this.x + this.vx * DT > MAX_WIDTH - this.r) {
				this.x = MAX_WIDTH - this.r;
			} else {
				this.x += this.vx * DT;
			}
		}

		if (this.vy < 0) {
			if (this.y + this.vy * DT < MIN_HEIGHT + this.r) {
				this.y = MIN_HEIGHT + this.r;
			} else {
				this.y += this.vy * DT;
			}
		} else {
			if (this.y + this.vy * DT > MAX_HEIGHT - this.r) {
				this.y = MAX_HEIGHT - this.r;
			} else {
				this.y += this.vy * DT;
			}
		}

		this.vx *= this.frictX;
		this.vy *= this.frictY;
	};

	this.print = function(context) {
		if (!this.invincibility) {
			fillStrokeCircle(context, this.x, this.y, this.r, this.color);
		} else {
			if (this.invincibilityClock % 10 >= 0 && this.invincibilityClock % 10 <= 3) {
				fillStrokeCircle(context, this.x, this.y, this.r, BACKGROUND_COLOR);
			} else {
				fillStrokeCircle(context, this.x, this.y, this.r, this.color);
			}
		}
	};

	this.collisionTunnel = function(tunnel, screenPlayer) {
		if (this.x >= 0 && this.x < MAX_WIDTH) {
			var l = Math.round(this.x);
			var m = Math.round(this.x - this.r);
			var n = Math.round(this.x + this.r);

			if (this.y <= tunnel.top.y[l] + this.r) {
				var a = (tunnel.top.y[n - 1] - tunnel.top.y[m]) / (n - m);

				this.vy = -tunnel.vx;
				this.vx = tunnel.vx * a;

				this.y = tunnel.top.y[l] + this.r;

				if (!this.invincibility) {
					this.lives--;
					this.invincibility = true;

					screenPlayer.childNodes[0].innerHTML = "Lives : <span style=\"color: " + this.color + ";\">" + this.lives + " |</span>";

					if (tunnel.vx < -3) {
						tunnel.vx += 0.25;
					}
				}
			} else if (this.y >= tunnel.bottom.y[l] - this.r) {
				var a = (tunnel.bottom.y[n - 1] - tunnel.bottom.y[m]) / (n - m);

				this.vy = tunnel.vx;
				this.vx = -tunnel.vx * a;

				this.y = tunnel.bottom.y[l] - this.r;

				if (!this.invincibility) {
					this.lives--;
					this.invincibility = true;

					screenPlayer.childNodes[0].innerHTML = "Lives : <span style=\"color: " + this.color + ";\">" + this.lives + " |</span>";

					if (tunnel.vx < -3) {
						tunnel.vx += 0.25;
					}
				}
			}
		}
	};

	this.collisionShip = function(ships) {
		for (var i = 0, n = ships.length; i < n; i++) {
			if (ships[i] != this) {
				if (distanceTwoPoints(this.x, this.y, ships[i].x, ships[i].y) <= this.r + ships[i].r) {
					var k = Math.abs(distanceTwoPoints(this.x, this.y, ships[i].x, ships[i].y) - (this.r + ships[i].r));

					var dx = this.vx / Math.sqrt(this.vx * this.vx + this.vy * this.vy);
					dx = isFinite(dx) ? dx : 0;
					this.x = this.x - (k * dx * 1.5);

					var dy = this.vy / Math.sqrt(this.vx * this.vx + this.vy * this.vy);
					dy = isFinite(dy) ? dy : 0;
					this.y = this.y - (k * dy * 1.5);

					var shipVx = ships[i].vx;
					var shipVy = ships[i].vy;

					ships[i].vx = this.vx;
					ships[i].vy = this.vy;

					this.vx = shipVx;
					this.vy = shipVy;
				}
			}
		}
	};

	this.collisionMeteor = function(meteorShower, screenPlayer) {
		for (var i = 0; i < meteorShower.stock.length; i++) {
			if (meteorShower.stock[i].available == false) {
				if (distanceTwoPoints(this.x, this.y, meteorShower.stock[i].x, meteorShower.stock[i].y) <= this.r + meteorShower.stock[i].size) {
					meteorShower.stop(i);

					if (!this.invincibility) {
						this.lives--;
						this.invincibility = true;

						screenPlayer.childNodes[0].innerHTML = "Lives : <span style=\"color: " + this.color + ";\">" + this.lives + " |</span>";
					}

					this.vx = this.vx - 6;
					this.poolRemains.explode(this.x, this.y);
				}
			}
		}
	};

	this.scoreCalculator = function(mainClock, screenPlayer) {
		if (mainClock == 0) {
			screenPlayer.childNodes[1].innerHTML = "Score : <span style=\"color: " + this.color + ";\">" + this.score + "</span>";
		}

		if (mainClock % 20 == 0 && this.x > 0) {
			if (MAX_WIDTH - this.x > 0 && this.invincibility == false) {
				screenPlayer.childNodes[1].innerHTML = "Score : <span style=\"color: " + this.color + ";\">" + this.score + "</span>";
				this.score += parseInt(10 * (10 - ((Math.log((MAX_WIDTH - this.x)) / Math.log(MAX_WIDTH) * 10))));
			}
		}
	};

	this.checkLives = function(mainClock, screenPlayer) {
		if (mainClock == 0) {
			screenPlayer.childNodes[0].innerHTML = "Lives : <span style=\"color: " + this.color + ";\">" + this.lives + " |</span>";
		}

		if (this.lives <= 0) {
			screenPlayer.childNodes[2].innerHTML = "<span style=\"color: " + this.color + ";\">GAME OVER</span>";
			return false;
		} else {
			return true;
		}
	};

	this.checkInvincibility = function() {
		if (this.invincibility) {
			if (this.invincibilityClock % 180 == 0) {
				this.invincibility = false;
				this.invincibilityClock = 0;
			}

			this.invincibilityClock++;
		}
	};

	this.endlight = function(mainClock) {
		if (!this.invincibility) {
			this.invincibility = true;
		}

		if (this.invincibilityClock % 180 == 0) {
			this.invincibilityClock = 0;
		}

		if (mainClock % 6 == 0) {
			this.invincibilityClock++;
		}
	};

	this.setFootPrint = function() {
		for (var i = 0, n = this.poolFootPrint.length; i < n; i++) {
			if (this.poolFootPrint[i].available == true) {
				this.poolFootPrint[i].setter(this.x, this.y);
				break;
			}
		}
	};

	this.timeToPrint = function(mainClock) {
		if (mainClock % 3 == 0) {
			this.setFootPrint();
		}
	};

	this.printController = function(context, tunnelvx) {
		for (var i = 0, n = this.poolFootPrint.length; i < n; i++) {
			if (this.poolFootPrint[i].available == false) {
				this.poolFootPrint[i].grow();
				this.poolFootPrint[i].x = this.poolFootPrint[i].x + tunnelvx / 1.5;
				this.poolFootPrint[i].print(context);

				if (this.poolFootPrint[i].r <= 0.4) {
					this.poolFootPrint[i].stop();
				}
			}
		}
	};

	this.checkNaN = function() {
		if (isFinite(this.x) && isFinite(this.y)) {
			this.oldX = this.x;
			this.oldY = this.y;
		} else {
			this.x = this.oldX;
			this.y = this.oldY;
		}
	};

	this.controller = function(tunnel, meteorShower, ships, mainClock, gameDuration, context, screenPlayer) {
		this.poolRemains.controller(context);
		this.drive(mainClock);
		this.move();
		this.printController(context, tunnel.vx);
		this.collisionShip(ships);
		this.collisionTunnel(tunnel, screenPlayer);
		this.collisionMeteor(meteorShower, screenPlayer);
		this.checkNaN();
		this.checkInvincibility();
		this.scoreCalculator(mainClock, screenPlayer);
		this.checkLives(mainClock, screenPlayer);
		this.print(context);
	};

	this.postGameController = function(tunnel, meteorShower, ships, mainClock, gameDuration, context, screenPlayer) {
		this.printController(context, tunnel.vx);
		this.endlight(mainClock);
		this.collisionShip(ships);
		this.print(context);
	};
}




// ***** FootPrint *****

function FootPrint() {
	this.x = 0;
	this.y = 0;

	this.r = 6;
	this.color = DEFAULT_COLOR;

	this.available = true;




	this.setter = function(x, y) {
		this.available = false;
		this.x = x;
		this.y = y;
		this.r = 6;
	};

	this.stop = function() {
		this.available = true;
		this.r = 6;
		this.x = 0;
		this.y = 0;
	};

	this.print = function(context) {
		fillStrokeCircle(context, this.x, this.y, this.r, this.color);
	};

	this.grow = function() {
		this.r = this.r - 0.6;
	};
}