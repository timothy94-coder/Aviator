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
    const [winners, setWinners] = useState([]);



    useEffect(() => {


        const onConnect = () => {

            socket.emit("requestInitialState");

        };



        socket.on("connect", onConnect);



        socket.on("gameState", (data) => {

            setGame(data);

            setGameReady(true);

        });





        socket.on("historyUpdate", (data) => {


            if(Array.isArray(data)){


                console.log(
                    "History received:",
                    data
                );


                setHistory((prev) => {


                    // ignore empty old updates
                    if(
                        data.length === 0 &&
                        prev.length > 0
                    ){

                        return prev;

                    }



                    // ignore duplicate updates
                    if(
                        prev.length > 0 &&
                        prev[0] === data[0] &&
                        prev.length === data.length
                    ){

                        return prev;

                    }



                    return [...data];


                });


            }


        });





        socket.on("betsUpdate", (data) => {

            setBets(data);

        });





        socket.on("winnersUpdate", (data) => {

            setWinners(data);

        });





        return () => {


            socket.off(
                "connect",
                onConnect
            );


            socket.off(
                "gameState"
            );


            socket.off(
                "historyUpdate"
            );


            socket.off(
                "betsUpdate"
            );


            socket.off(
                "winnersUpdate"
            );


        };


    }, []);





    return (

        <GameContext.Provider
            value={{
                game,
                history,
                bets,
                cashouts,
                winners,
                gameReady
            }}
        >

            {children}

        </GameContext.Provider>

    );


}





export const useGame = () => useContext(GameContext);
