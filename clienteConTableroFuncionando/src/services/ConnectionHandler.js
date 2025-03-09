import { io } from "../../node_modules/socket.io-client/dist/socket.io.esm.min.js";
import { GameService } from "./GameService.js";

export const ConnectionHandler = {
    connected: false,
    socket: null,
    url: null,
    controller: null,
    init: (url, controller, onConnectedCallBack, onDisconnectedCallBack) => {
        ConnectionHandler.controller = controller;
        let { socket } = ConnectionHandler;
        socket = io(url);
        socket.onAny((message, payload) => {
            console.log("Esta llegando: ");
            console.log(payload);
            console.log(payload.type);
            console.log(payload.content);

        });

        socket.on("connect", (data) => {
            socket.on("connectionStatus", (data) => {
                ConnectionHandler.connected = true;
                console.log(data);
                onConnectedCallBack();
            });
            socket.on("message", (payload) => {
                ConnectionHandler.controller.actionController(payload);
                //socket.emit("message",{ type: "HELLO", content: "Hello world!"});
            })
            socket.on("disconnect", () => {
                ConnectionHandler.connected = false;
                onDisconnectedCallBack();
            });


            
            const moveButton = document.getElementById("mover");
            const rotateButton = document.getElementById("rotar");
            const shootButton = document.getElementById("disparar");

            // Evento de movimiento
            moveButton.addEventListener("click", () => {
            
                event.preventDefault();
                socket.emit("movePlayer", { playerId: socket.id });// Aquí socket.id es el ID del jugador
            });

            // Evento de rotación
            rotateButton.addEventListener("click", () => {
                
                event.preventDefault();
                socket.emit("rotatePlayer", { playerId: socket.id }); 

            });


            shootButton.addEventListener("click", () => {
            
                event.preventDefault();
                socket.emit("shootPlayer", { playerId: socket.id });

            });

        })
    }
}