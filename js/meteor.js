// ***** Meteor *****

function Meteor(x, y, vx, vy, size, color) {
	this.x = x;
	this.y = y;

	this.vx = vx;
	this.vy = vy;

	this.size = size;
	this.color = color;

	this.available = true;




	this.print = function(context) {
		fillStrokeCircle(context, this.x, this.y, this.size, this.color);
	};

	this.up = function() {
		this.y = this.y - this.vy;
	};

	this.left = function(step) {
		this.x = this.x + step - 2;
	};

	this.launch = function(tunnel) {
		this.available = false;
		this.size = METEOR_SIZE;

		this.x = MAX_WIDTH + this.size;
		this.y = randomIntFromInterval(tunnel.top.y[tunnel.top.size - 1], tunnel.bottom.y[tunnel.bottom.size - 1]);

	};

	this.stop = function() {
		this.available = true;
	};

	this.collisionTunnel = function(tunnel) {
		var l = Math.round(this.x);

		if (this.x > 0 && this.x < MAX_WIDTH) {
			if (this.y <= tunnel.top.y[l] + this.size || this.y >= tunnel.bottom.y[l] - this.size) {
				return true;
			}
		} else {
			return false;
		}
	};
}




// ***** MeteorShower *****

function MeteorShower() {
	this.stock = new Array();
	this.isFull = false;




	this.shoot = function(tunnel) {
		var e = new Meteor(0, 0, METEOR_STEP, METEOR_STEP, 0, FLAT_GRAY);
		e.launch(tunnel);
		this.stock.push(e);
	};

	this.stop = function(i) {
		this.stock[i].available = true;
	};

	this.controller = function(tunnel, context, mainClock) {
		if (this.stock.length >= 10 && this.isFull) {
			this.stock = new Array();
		}

		if (Math.random() * 10 > 8 && mainClock % 30 == 0) {
			this.shoot(tunnel);
		}

		this.isFull = true;

		for (var i = 0; i < this.stock.length; i++) {
			if (this.stock[i].available == false) {
				this.isFull = false;

				if (this.stock[i].x > -this.stock[i].size) {
					this.stock[i].left(tunnel.vx);
					this.stock[i].print(context);

					if (this.stock[i].x > METEOR_SIZE) {
						if (this.stock[i].collisionTunnel(tunnel)) {
							var accX = this.stock[i].x;
							var accY = this.stock[i].y;

							this.stop(i);
							tunnel.poolRemains.explode(accX, accY);
						}
					}
				} else {
					this.stop(i);
				}
			}
		}
	};
}