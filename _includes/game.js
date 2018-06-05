window.addEventListener('load', game, false);

function game() {
  var myCanvas = document.getElementById('myCanvas');

  var ctx = myCanvas.getContext('2d');

	var edges = new Set();
	edges.add(toKey(0, 0, 1, 0))
	edges.add(toKey(1, 0, 2, 0))

	const deltas = [[0, 1], [1, 0]];

	function toKey(i1, j1, i2, j2) {
		return `${i1},${j1},${i2},${j2}`
	}

	function toScreen(x) {
		return x * 50 + 10;
	}

	function drawLine() {
		const args = Array.prototype.slice.call(arguments).map(toScreen)
		ctx.moveTo.apply(ctx, args.slice(0, 2))
		ctx.lineTo.apply(ctx, args.slice(2, 4))
	}
  
  function drawScreen () {
		ctx.beginPath();
    ctx.lineWidth = 1;
		ctx.strokeStyle = "#000000";
		
		for (i = 0; i <= 4; i++) {
			for (j = 0; j <= 4; j++) {
				deltas.forEach(function(delta) {
					i2 = i + delta[0]
					j2 = j + delta[1]
					if (i2 <= 4 && j2 <= 4) {
						drawLine(i, j, i2, j2);
					}
				})
			}
		}
		ctx.stroke();   
		ctx.closePath();

		ctx.beginPath();
    ctx.lineWidth = 5;
		ctx.strokeStyle = "#FF0000";
		for (let edge of edges) {
			drawLine.apply(null, edge.split(',').map(Number));
		}
		ctx.stroke();   
		ctx.closePath();
  }
  drawScreen();
}
