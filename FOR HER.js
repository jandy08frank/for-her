<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Te Amo Michi</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js"></script>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background-color: black;
    }
  </style>
</head>
<body>
<script>
let particles = [];
let basePositions = [];
let heartCenter;

function setup() {
  createCanvas(windowWidth, windowHeight);
  heartCenter = createVector(width / 2, height / 2 - 50);
  let total = 3000; // más partículas para rellenar

  // Generar partículas dentro del corazón
  for (let i = 0; i < total; i++) {
    let pos = getRandomHeartPoint();
    basePositions.push(pos.copy());
    particles.push({
      pos: pos.copy(),
      vel: createVector(0, 0)
    });
  }
}

function draw() {
  background(0);

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let base = basePositions[i];

    let d = dist(mouseX, mouseY, p.pos.x, p.pos.y);
    if (d < 100) {
      let angle = atan2(p.pos.y - mouseY, p.pos.x - mouseX);
      let force = (100 - d) * 0.05;
      let push = p5.Vector.fromAngle(angle).mult(force);
      p.vel.add(push);
    }

    let pull = p5.Vector.sub(base, p.pos).mult(0.05);
    p.vel.add(pull);
    p.vel.mult(0.9);
    p.pos.add(p.vel);

    // Color degradado radial: más rosado lejos del centro, rojo en el centro
    let distToCenter = dist(p.pos.x, p.pos.y, heartCenter.x, heartCenter.y);
    let maxDist = 140; // radio del corazón
    let t = constrain(distToCenter / maxDist, 0, 1);
    let r = lerp(255, 255, t);  // de rosado a rojo
    let g = lerp(128, 0, t);
    let b = lerp(160, 0, t);
    fill(r, g, b);
    noStroke();
    circle(p.pos.x, p.pos.y, 2);
  }

  drawText();
}

function drawText() {
  textAlign(CENTER, CENTER);
  textSize(48);
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      if (dx !== 0 || dy !== 0) {
        fill(255, 0, 0, 50);
        text("TE AMO MICHI", width / 2 + dx, height - 80 + dy);
      }
    }
  }
  fill(255, 0, 0);
  text("TE AMO MICHI", width / 2, height - 80);
}

// Generador de puntos dentro de un corazón (usando fórmula implícita)
function getRandomHeartPoint() {
  while (true) {
    let x = random(-1, 1);
    let y = random(-1.5, 1.1);
    let fx = 16 * pow(x, 3);
    let fy = 13 * y - 5 * cos(2 * x * PI) - 2 * cos(3 * x * PI) - cos(4 * x * PI);
    let d = pow(x * 16 * sin(x * PI), 3) + pow(fy, 2);

    // Forma implícita del corazón (simplificada)
    let r = sqrt(pow(x, 2) + pow(y, 2));
    let heartShape = pow(x * x + y * y - 1, 3) - x * x * y * y * y;
    if (heartShape <= 0) {
      let scale = 100; // tamaño más pequeño
      return createVector(x * scale + width / 2, -y * scale + height / 2 - 50);
    }
  }
}
</script>
</body>
</html>
