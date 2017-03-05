// ***** Screen *****

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = MAX_WIDTH * 2;
canvas.height = MAX_HEIGHT * 2;

canvas.style.width = MAX_WIDTH + "px";
canvas.style.height = MAX_HEIGHT + "px";

ctx.scale(2,2);

ctx.fillStyle = DEFAULT_COLOR;
ctx.strokeStyle = DEFAULT_COLOR;

var screenAll = document.getElementById("screenAll");
screenAll.style.width = MAX_WIDTH + "px";

var screenLeft = document.getElementById("left");
var screenRight = document.getElementById("right");

var screenClock = document.getElementById("clock");

var screenPlayers = [];




// ***** Buttons *****

var menu = document.getElementById("menu");
menu.style.width = MAX_WIDTH + "px";

var onePlayer = document.getElementById("onePlayer");
var twoPlayers = document.getElementById("twoPlayers");

var howToPlay = document.getElementById("howToPlay");

var buttons = document.getElementById("buttons");
var stop = document.getElementById("stop");
var playPause = document.getElementById("playPause");
var restart = document.getElementById("restart");
var pauseEntity = document.getElementById("pauseEntity");
