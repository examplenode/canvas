const canvas = document.getElementById('cityCanvas');
const context = canvas.getContext('2d');

let structures = [];
let windowPanes = [];
let flickerInterval;

function setupScene() {
    createSkyline();
    renderFrame();
    beginLightFlicker();
}

// генерация зданий и окон
function createSkyline() {
    structures = [];
    windowPanes = [];
    
    const baselineY = canvas.height - 40;
    let xPos = 15;

    while (xPos < canvas.width - 20) {
        // дом
        const bWidth = 40 + Math.random() * 70;
        const bHeight = 80 + Math.random() * 320;
        const posX = xPos;
        const posY = baselineY - bHeight;

        const brightness = 15 + Math.random() * 25;
        const buildcolor = `rgb(${brightness}, ${brightness}, ${brightness + 15})`;

        structures.push({ 
            x: posX, 
            y: posY, 
            width: bWidth, 
            height: bHeight, 
            color: buildcolor
        });

        const paneW = 8, paneH = 10;
        const distanceX = 5, distanceY = 6;
        const edgeMargin = 6;

        const colCount = Math.floor((bWidth - edgeMargin * 2) / (paneW + distanceX));
        const rowCount = Math.floor((bHeight - edgeMargin * 2) / (paneH + distanceY));

        const startX = posX + (bWidth - (colCount * paneW + (colCount - 1) * distanceX)) / 2;
        const startY = posY + edgeMargin;

        // случайные окна
        for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
            for (let colIdx = 0; colIdx < colCount; colIdx++) {
                const isLit = Math.random() < 0.3;
                windowPanes.push({
                    x: startX + colIdx * (paneW + distanceX),
                    y: startY + rowIdx * (paneH + distanceY),
                    w: paneW,
                    h: paneH,
                    active: isLit
                });
            }
        }
        xPos += bWidth + 10;
    }
}

// Отрисовка 
function renderFrame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const skyGradient = context.createLinearGradient(0, 0, 0, canvas.height);
    skyGradient.addColorStop(0, '#0a0e24');
    skyGradient.addColorStop(0.6, '#141b38');
    skyGradient.addColorStop(1, '#1f2845');
    context.fillStyle = skyGradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#e8e4d9';
    context.shadowColor = '#e8e4d9';
    context.shadowBlur = 15;
    context.beginPath();
    context.arc(140, 70, 22, 0, Math.PI * 2);
    context.fill();
    context.shadowBlur = 0;

    // Земля 
    context.fillStyle = '#0d111a';
    context.fillRect(0, canvas.height - 40, canvas.width, 40);
    context.fillStyle = '#1a2235';
    context.fillRect(0, canvas.height - 40, canvas.width, 2);

    structures.forEach(struct => {
        context.fillStyle = struct.color;
        context.fillRect(struct.x, struct.y, struct.width, struct.height);
    });

    windowPanes.forEach(pane => {
        if (pane.active) {
            context.shadowColor = '#ffcc66';
            context.shadowBlur = 4;
            context.fillStyle = '#ffcc66';
            context.fillRect(pane.x, pane.y, pane.w, pane.h);
            context.shadowBlur = 0;
        } else {
            context.fillStyle = '#0a0c14';
            context.fillRect(pane.x, pane.y, pane.w, pane.h);
        }
    });
}

function beginLightFlicker() {
    flickerInterval = setInterval(() => {
        const updatesCount = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < updatesCount; i++) {
            const randomIdx = Math.floor(Math.random() * windowPanes.length);
            windowPanes[randomIdx].active = !windowPanes[randomIdx].active;
        }
        renderFrame();
    }, 500);
}

window.addEventListener('load', setupScene);