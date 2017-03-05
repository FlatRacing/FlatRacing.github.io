// **** Remains ****

function Remains() {
	this.xa = 0;
	this.ya = 0;
	this.xb = 0;
	this.xb = 0;

	this.vx = 0;
	this.vy = 0;

	this.available = true;

	this.color = DEFAULT_COLOR;




	this.setter = function(x, y) {
		var s = Math.random() < 0.5 ? 1 : -1;
		var z = Math.random() < 0.5 ? 1 : -1;

		this.vx = s * randomIntFromInterval(5, 20);
		this.vy = z * randomIntFromInterval(5, 20);
		this.available = false;
		this.xa = x;
		this.xb = x;
		this.ya = y;
		this.yb = y;
	};

	this.print = function(context) {
		fillLine(context, this.xa, this.ya, this.xb, this.yb, this.color);
	};

	this.spread = function() {
		if (distanceTwoPoints(this.xa, this.ya, this.xb, this.yb) <= 6) {
			this.xa = this.xa + this.vx;
			this.ya = this.ya + this.vy;
			this.xb = this.xb + this.vx / 2;
			this.yb = this.yb + this.vy / 2;
		} else {
			this.xa = this.xa + this.vx;
			this.ya = this.ya + this.vy;
			this.xb = this.xb + this.vx;
			this.yb = this.yb + this.vy;
		}
	};

	this.stop = function() {
		this.xa = this.xb = this.ya = this.yb = 0;
		this.available = true;
	};
}




// **** PoolRemains ****

function PoolRemains() {
	this.allRemains = new Array(REMAINS_PER_CRASH * 3);
	this.onLine = new Array();

	for (var k = 0; k < REMAINS_PER_CRASH * 4; k++) {
		this.allRemains[k] = new Remains();
	}




	this.explode = function(x, y) {
		var tab = this.allRemains.splice(0, REMAINS_PER_CRASH);

		for (var i = 0, n = tab.length; i < n; i++) {
			tab[i].available = false;
			tab[i].setter(x, y);
			this.onLine.push(tab[i]);
		}
	};

	this.switchOff = function(remain, i) {
		remain.stop();
		var element = this.onLine.splice(i, 1);
		this.allRemains.push(element[0]);
	};

	this.spread = function(context) {
		for (var i = 0; i < this.onLine.length; i++) {
			if (this.onLine[i].available == false) {
				this.onLine[i].spread();
				this.onLine[i].print();

				if (this.onLine[i].xb > MAX_WIDTH || this.onLine[i].yb > MAX_HEIGHT || this.onLine[i].xb < 1 || this.onLine[i].yb < 1) {
					this.switchOff(this.onLine[i], i);
				}
			}
		}
	};

	this.controller = function(context) {
		for (var i = 0; i < this.onLine.length; i++) {
			if (this.onLine[i].available == false) {
				this.onLine[i].spread();
				this.onLine[i].print(context);

				if (this.onLine[i].xb > MAX_WIDTH || this.onLine[i].yb > MAX_HEIGHT) {
					this.switchOff(this.onLine[i], i);
				} else if (this.onLine[i].xb < 1 || this.onLine[i].yb < 1) {
					this.switchOff(this.onLine[i], i);
				}
			}
		}
	};
}