import React, { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket/socket";

const GameContext = createContext(null);

export function GameProvider({ children }) {

    const [gameReady, setGameReady] = useState(false);

    const [game, setGame] = useState({
        status: "waiting",
        multiplier: 1,
        countdown: 5,
        roundId: 1,
        crashPoint: null
    });

    const [history, setHistory] = useState([]);
    const [bets, setBets] = useState({});
    const [cashouts, setCashouts] = useState({});
    const [winners, setWinners] = useState([]); // ✅ FIXED LOCATION

useEffect(() => {

    const onConnect = () => {
        socket.emit("requestInitialState");
    };

    socket.on("connect", onConnect);

    socket.on("gameState", (data) => {
    setGame(data);
    setGameReady(true); // ✅ ADD THIS LINE
});
    socket.on("historyUpdate", setHistory);
    socket.on("betsUpdate", setBets);
    socket.on("winnersUpdate", setWinners);

    return () => {
        socket.off("connect", onConnect);
        socket.off("gameState");
        socket.off("historyUpdate");
        socket.off("betsUpdate");
        socket.off("winnersUpdate");
    };

}, []);

    return (
        <GameContext.Provider value={{
            game,
            history,
            bets,
            cashouts,
            winners,
            gameReady
        }}>
            {children}
        </GameContext.Provider>
    );
}

export const useGame = () => useContext(GameContext);
