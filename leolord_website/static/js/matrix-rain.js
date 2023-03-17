const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.getElementById('matrix-rain').appendChild(canvas);

const ctx = canvas.getContext('2d');
const fontSize = 14;
const columns = canvas.width / fontSize;

const drops = [];
for (let i = 0; i < columns; i++) {
  drops[i] = 1;
}

function drawMatrixRain() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'lime';
  ctx.font = fontSize + 'px Courier New';

  for (let i = 0; i < drops.length; i++) {
    const text = String.fromCharCode(Math.random() * 128);
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

setInterval(drawMatrixRain, 50);
