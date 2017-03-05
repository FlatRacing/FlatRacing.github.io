// ***** Utility functions *****

function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function fillStrokeCircle(context, x, y, r, color) {
	context.lineWidth = 3.2;
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI, true);
	context.closePath();
	context.fill();
	context.stroke();
	context.fillStyle = DEFAULT_COLOR;
	context.lineWidth = 1;
}

function distanceTwoPoints(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function printTime(duration, screenClock) {
	var min = parseInt(duration / 60);
	var sec = duration % 60;

	if (sec < 10) {
		sec = "0" + sec;
	}

	screenClock.innerHTML = "<span style=\"color: #919191;\">[</span> " + min + ":" + sec + " <span style=\"color: #919191;\">]</span>";
}

function fillLine(context, xa, ya, xb, yb, color) {
	context.lineWidth = 3.6;
	context.beginPath();
	context.fillStyle = color;

	context.beginPath();
	context.moveTo(xa, ya);

	context.lineTo(xb, yb);

	context.stroke();
	context.closePath();
	context.lineWidth = 1;
}

function detectBrowser() {
	var ua = navigator.userAgent,
		tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE ' + (tem[1] || '');
	}

	if (M[1] === 'Chrome') {
		tem = ua.match(/\bOPR\/(\d+)/)
		if (tem != null) return 'Opera ' + tem[1];
	}

	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

	if ((tem = ua.match(/version\/(\d+)/i)) != null) {
		M.splice(1, 1, tem[1]);
	}

	return M.join(' ');
}

function detectMobileBrowser() {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return true;
	} else {
		return false;
	}
}