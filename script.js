// Obtener el elemento canvas y su contexto 2D para dibujar
const canvas = document.getElementById("breakoutCanvas");
const ctx = canvas.getContext("2d");
//canvas: Obtiene el elemento HTML <canvas> para dibujar en él.
//Obtiene el contexto 2D del canvas, que es necesario para realizar las operaciones de dibujo.
// Inicialización de las variables de la pelota
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
/*ballRadius: Define el radio de la pelota.
x y y: Posición inicial de la pelota en el centro del canvas.
dx y dy: Velocidad de la pelota en las direcciones x e y.*/
// Establecer el tamaño del ancho y alto
canvas.width = 600;
canvas.height = 500;

// Inicialización de las variables de la pala
const paddleHeight = 10;    
const paddleWidth = 80;
let paddleX = (canvas.width - paddleWidth) / 2; //paddleX: Posición inicial de la pala centrada en la parte inferior del canvas.

// Inicialización de las variables de control de movimiento
let rightPressed = false;
let leftPressed = false;

// Configuración de los ladrillos
const brickRowCount = 12;  
const brickColumnCount = 7;
const brickWidth = 65;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 40;
const brickOffsetLeft = 40;

// Puntuación inicial
let score = 0;

// Creación de la matriz de ladrillos
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Event listeners para el control de la pala
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.getElementById("restartBtn").addEventListener("click", restartGame);

// Función para manejar las pulsaciones de teclas
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

// Función para manejar el levantamiento de teclas
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// Función para dibujar la pelota
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "RED"; // color de la pelota
    ctx.fill();
    ctx.closePath();
}

// Función para dibujar la pala
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = ""; // color de la pala
    ctx.fill();
    ctx.closePath();
}

// Función para dibujar los ladrillos
function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Función para detectar colisiones entre la pelota y los ladrillos
function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("Congratulations! You win!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

// Función para dibujar la puntuación
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "Black";
    ctx.fillText("Score: " + score, 8, 20);
}

// Función para reiniciar el juego
function restartGame() {
    score = 0;
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
    draw();
}

// Función principal de dibujado y actualización del juego
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    // Detección de colisiones con las paredes
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            document.location.reload();
            alert("GAME OVER");
            restartGame();
        }
    }

    // Movimiento de la pala
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    // Movimiento de la pelota
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

// Iniciar el juego
draw();
