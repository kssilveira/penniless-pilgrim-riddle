window.addEventListener('load', game, false);

function game() {
	var canvas = document.getElementById('canvas');

	var ctx = canvas.getContext('2d');

	const directions = ['L', 'D', 'R', 'U'];

	const keyCodeToDirection = {
		37: 'L',
		40: 'D',
		39: 'R',
		38: 'U',
	};

	const keyCodeToActionFn = {
		82: restart,  // 'r'
	};

	const directionToDelta = {
		'L': [-1,  0],
		'R': [+1,  0],
		'U': [ 0, -1],
		'D': [ 0, +1],
	};

	const directionToScoreFn = {
		'L': function(score) { return score - 2; },
		'R': function(score) { return score + 2; },
		'U': function(score) { return score / 2.0; },
		'D': function(score) { return score * 2; },
	};

	var edges, pos, score;

	const drawDeltas = [[0, 1], [1, 0]];

	function toKey(i1, j1, i2, j2) {
		return `${i1},${j1},${i2},${j2}`;
	}

	function toScreen(x) {
		return x * 50 + 10;
	}

	function drawLine() {
		const args = Array.prototype.slice.call(arguments).map(toScreen);
		ctx.moveTo.apply(ctx, args.slice(0, 2));
		ctx.lineTo.apply(ctx, args.slice(2, 4));
	}

	function drawCircle(i, j) {
		ctx.arc(toScreen(i),toScreen(j), 5, 0, 2*Math.PI);
	}

	function drawText(text, i, j) {
		ctx.font = "30px Arial";
		ctx.fillText(text, toScreen(i), toScreen(j));
	}

	function restart() {
		edges = new Set();
		pos = [0, 0];
		score = 0;
		move('R');
		move('R');
		drawScreen();
	}

	function drawScreen () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = "#000000";

		for (var i = 0; i <= 4; i++) {
			for (var j = 0; j <= 4; j++) {
				drawDeltas.forEach(function(delta) {
					const i2 = i + delta[0];
					const j2 = j + delta[1];
					if (i2 <= 4 && j2 <= 4) {
						drawLine(i, j, i2, j2);
					}
				});
			}
		}
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#FF0000";
		for (var edge of edges) {
			drawLine.apply(null, edge.split(',').map(Number));
		}
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		drawCircle(pos[0], pos[1]);
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		drawCircle(4, 4);
		ctx.stroke();
		ctx.closePath();

		ctx.beginPath();
		drawText(`Score: ${score}`, 0, 5);
		ctx.stroke();
		ctx.closePath();

		const [isEnd, isSuccess] = isFinished();
		if (isEnd) {
			ctx.beginPath();
			if (isSuccess) {
				drawText('Success! 🙌', 0, 6);
			} else {
				drawText('Failure! 🤷', 0, 6);
			}
			ctx.stroke();
			ctx.closePath();
		}
	}

	function isFinished() {
		if (pos[0] == 4 && pos[1] == 4) {
			if (score == 0) {
				return [true, true];
			} else {
				return [true, false];
			}
		}
		const len = directions.length;
		for (var i = 0; i < len; i++) {
			const direction = directions[i];
			const [isValid] = canMove(direction);
			if (isValid) {
				return [false];
			}
		};
		return [true, false];
	}

	function canMove(direction) {
		const delta = directionToDelta[direction];
		const [i, j] = pos;
		const ni = i + delta[0], nj = j + delta[1];
		if (ni <= 4 && nj <= 4 && ni >= 0 && nj >= 0 && (i != 4 || j != 4)) {
			const key1 = toKey(i, j, ni, nj);
			const key2 = toKey(ni, nj, i, j);
			if (!edges.has(key1) && !edges.has(key2)) {
				return [true, ni, nj, key1]
			}
		}
		return [false]
	}

	function move(direction) {
		const [isValid, ni, nj, key] = canMove(direction);
		if (isValid) {
			edges.add(key);
			pos = [ni, nj];
			score = directionToScoreFn[direction](score);
		}
	}

	restart();

	document.addEventListener('keydown', function(event) {
		const code = event.keyCode;
		if (keyCodeToDirection.hasOwnProperty(code)) {
			move(keyCodeToDirection[code]);
			drawScreen();
			event.preventDefault();
		} else if (keyCodeToActionFn.hasOwnProperty(code)) {
			keyCodeToActionFn[code]();
		}
		// console.log(event.keyCode);
	}, true);
}
