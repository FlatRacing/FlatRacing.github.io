// ***** Tunnel *****

function Tunnel(size, vx, vxMax, accelerationTunnelFrequency, minThreshold, maxThreshold, initSummit, colorTop, colorBottom, context) {
	this.top = new PieceOfTunnel(size, vx, initSummit, 0, colorTop, context);
	this.bottom = new PieceOfTunnel(size, vx, MAX_HEIGHT - initSummit, MAX_HEIGHT, colorBottom, context);

	this.vx = vx;
	this.vxMax = vxMax;

	this.minThreshold = minThreshold;
	this.maxThreshold = maxThreshold;

	this.counterPeriod = 0;
	this.poolRemains = new PoolRemains();




	this.print = function() {
		this.top.print();
		this.bottom.print();
	};

	this.move = function(mainClock) {
		this.top.move(Math.floor(this.vx));
		this.bottom.move(Math.floor(this.vx));

		if (mainClock % (60 * accelerationTunnelFrequency) == 0) {
			if (this.vx >= this.vxMax) {
				this.vx--;
			}
		}
	};

	this.arrange = function() {
		var counterHidden = 0;

		for (var i = 0; i < this.top.size; i++) {
			if (this.top.x[i] < 0) {
				counterHidden++;
			}
		}

		for (var i = 0; i < this.top.size - counterHidden; i++) {
			this.top.x[i] = this.top.x[i + counterHidden];
			this.top.y[i] = this.top.y[i + counterHidden];

			this.bottom.x[i] = this.bottom.x[i + counterHidden];
			this.bottom.y[i] = this.bottom.y[i + counterHidden];
		}

		for (var i = this.top.size - counterHidden; i < this.top.size; i++) {
			var buildPieces = this.buildPieces();

			this.top.x[i] = i;
			this.top.y[i] = buildPieces[0];

			this.bottom.x[i] = i;
			this.bottom.y[i] = buildPieces[1];
		}
	};

	this.randomPoints = function() {
		var randomX = randomIntFromInterval(MAX_WIDTH / 6, MAX_WIDTH / 2);

		var randomMasterY = randomIntFromInterval(MIN_HEIGHT, MAX_HEIGHT - this.minThreshold);
		var randomY = randomIntFromInterval(randomMasterY + this.minThreshold, Math.min(MAX_HEIGHT, randomMasterY + this.maxThreshold));

		return [
			[randomX, randomMasterY],
			[randomX, randomY]
		];
	};

	this.sinusTechnology = function(oldSummit, targetPoint, t) {
		var targetPointX = targetPoint[0];
		var targetPointY = targetPoint[1];

		if (oldSummit <= targetPointY) {
			return (targetPointY - oldSummit) * 0.5 * (Math.sin(Math.PI / targetPointX * t - Math.PI / 2) + 1) + oldSummit;
		} else {
			return (oldSummit - targetPointY) * 0.5 * (Math.sin(Math.PI / targetPointX * t + Math.PI / 2) + 1) + targetPoint[1];
		}
	};

	this.buildPieces = function() {
		var topValue = this.sinusTechnology(this.top.oldSummit, this.top.targetPoint, this.counterPeriod);
		var bottomValue = this.sinusTechnology(this.bottom.oldSummit, this.bottom.targetPoint, this.counterPeriod);

		if (this.counterPeriod < this.top.targetPoint[0]) {
			this.counterPeriod++;
		} else {
			this.top.oldSummit = this.top.targetPoint[1];
			this.bottom.oldSummit = this.bottom.targetPoint[1];

			var newTargetPoints = this.randomPoints();
			this.top.targetPoint = newTargetPoints[0];
			this.bottom.targetPoint = newTargetPoints[1];

			this.counterPeriod = 0;
		}

		return [topValue, bottomValue];
	};

	this.controller = function(context, mainClock) {
		this.poolRemains.controller(context);
		this.print(context);
		this.move(mainClock);
		this.arrange();
	};
}




// ***** PieceOfTunnel *****

function PieceOfTunnel(size, vx, initSummit, ground, color, context) {
	this.size = size + 1;

	this.x = new Array(this.size);
	this.y = new Array(this.size);

	this.oldSummit = initSummit;
	this.targetPoint = [1, initSummit];

	this.color = color;

	for (var i = 0; i < this.size; i++) {
		this.x[i] = i;
		this.y[i] = initSummit;
	}




	this.print = function() {
		context.fillStyle = this.color;
		context.beginPath();
		context.moveTo(this.x[0], this.y[0]);

		for (var i = 1; i < this.size; i++) {
			context.lineTo(this.x[i], this.y[i]);
		}

		context.lineTo(this.x[this.size - 1], ground);
		context.lineTo(this.x[0], ground);
		context.lineTo(this.x[0], this.y[0]);
		context.fill();
		context.closePath();
		context.fillStyle = DEFAULT_COLOR;


		context.lineWidth = 3.6;
		context.beginPath();
		context.moveTo(this.x[0], this.y[0]);

		for (var i = 1; i < this.size; i++) {
			context.lineTo(this.x[i], this.y[i]);
		}

		context.stroke();
		context.closePath();
		context.lineWidth = 1;
	};

	this.move = function(vx) {
		for (var i = 0; i < this.size; i++) {
			this.x[i] += vx * DT;
		}
	};
}