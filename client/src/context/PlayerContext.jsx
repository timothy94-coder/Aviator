import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import socket from "../socket/socket";
const PlayerContext = createContext();

export function PlayerProvider({ children }) {

    const [balance, setBalance] = useState(0);
    const [bets, setBets] = useState({});

useEffect(() => {

    socket.on("walletUpdate", (data) => {

        if (data.userId !== socket.id) return;

        setBalance(prev => prev + data.amount);

    });

    return () => socket.off("walletUpdate");

}, []);

    return (
        <PlayerContext.Provider value={{
            balance,
            setBalance,
            bets,
            setBets
        }}>
            {children}
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => useContext(PlayerContext);