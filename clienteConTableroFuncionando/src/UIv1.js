import { ELEMENTS } from "./entities/Board.js";
import { UI_BUILDER } from "./Ui.js";

export const UIv1 = UI_BUILDER.init();

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
}

UIv1.drawBoard = (board, players) => {
    UIv1.players = players;
    UIv1.board = board;
    const currentPlayerId = players.find(p => p.isCurrentPlayer)?.id; // Para identificar el jugador actual

    if (board !== undefined) {
        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';
        base.style.gridTemplateColumns = `repeat(${board.length}, 50px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 50px)`;

        board.forEach((row, rowIndex) => {
            row.forEach((element, colIndex) => {
                const tile = document.createElement("div");
                const encontrar = players.find((p) => p.x === rowIndex && p.y === colIndex);
                tile.classList.add("tile");
                
                // Verificar si la celda es un arbusto
                const isBush = element === ELEMENTS.bush;
                
                if (encontrar) {
                    
                    const shouldShowPlayer = encontrar.id === currentPlayerId || !isBush;
                    
                    if (shouldShowPlayer) {
                        tile.style.backgroundImage = "url('assets/photos/imagesup.png')";
                        
                        const rotationAngles = {
                            "up": "0deg",
                            "right": "90deg",
                            "down": "180deg",
                            "left": "270deg"
                        };
                        
                        if (rotationAngles[encontrar.direction]) {
                            tile.style.transform = `rotate(${rotationAngles[encontrar.direction]})`;
                        }
                    }
                    
                    tile.id = `player-${encontrar.id}`;
                    
            
                    encontrar.visibility = !isBush || encontrar.id === currentPlayerId;
                }

                if (isBush) { 
                    tile.style.backgroundColor = 'green'; 
                }

                base.appendChild(tile);

                
                anime({
                    targets: tile,
                    opacity: [1, 1],
                    duration: (Math.random() * 8000) + 1000,
                    easing: 'easeInOutQuad'
                });
            });
        });
    }
}

UIv1.rotatePlayer = (playerId, direction) => {
    const playerElement = document.getElementById(`player-${playerId}`);
    if (!playerElement) return;

    const rotationAngles = {
        "up": "0deg",
        "right": "90deg",
        "down": "180deg",
        "left": "270deg"
    };
    playerElement.style.transform = `rotate(${rotationAngles[direction]})`;
}


UIv1.movePlayer = (playerId, newX, newY, direction) => {
    if (!UIv1.players || !UIv1.board) return;

    // Comprobación de límites del tablero
    if (newX < 0 || newX >= UIv1.board.length || newY < 0 || newY >= UIv1.board[0].length) {
        console.log("Movimiento inválido: fuera de los límites del mapa");
        return;
    }
    

    const collision = UIv1.players.some(p => p.id !== playerId && p.x === newX && p.y === newY);
    if (collision) {
        console.log("Movimiento inválido: casilla ocupada por otro jugador");
        return;
    }
    
    // Si la celda es un arbusto, solo se permite si está libre
    if (UIv1.board[newX][newY] === ELEMENTS.bush) {
        const bushOccupied = UIv1.players.some(p => p.x === newX && p.y === newY);
        if (bushOccupied) {
            console.log("Movimiento inválido: arbusto ya ocupado");
            return;
        }
    }
    
    const player = UIv1.players.find(p => p.id === playerId);
    if (!player) return;  
    
    // Actualiza la posición y la dirección del jugador
    player.x = newX;
    player.y = newY;
    player.direction = direction;
    

    const isOnBush = UIv1.board[newX][newY] === ELEMENTS.bush;
    player.visibility = !isOnBush;

    UIv1.drawBoard(UIv1.board, UIv1.players);
};

