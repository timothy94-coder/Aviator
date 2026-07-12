import { useEffect } from "react";
import "./GameBoard.css";
import Plane from "../Plane/Plane";
import { useGame } from "../../context/GameContext";
import LiveGraph from "../LiveGraph/LiveGraph";
import { useSound } from "../../context/SoundContext";


import bg from "../../assets/images/imagebg.svg";

function GameBoard() {
    const { game, gameReady } = useGame();
    const { playEngine, stopEngine, playCrash } = useSound();

     useEffect(() => {

        if (game.status === "flying") {
            playEngine();
        }

        if (game.status === "crashed") {
            stopEngine();
            playCrash();
        }

        if (game.status === "waiting") {
            stopEngine();
        }

}, [game.status, game.roundId]);

    return (
<div className="game-board">

    <div className="game-canvas">

        {/* 🌪️ SPIRAL ONLY INSIDE CANVAS */}
        <img src={bg} className="sky-bg" alt="bg" />
    <div className={`flight-zone ${game.status}`}>
       {gameReady && (
    <>
        <LiveGraph />
        <Plane />
    </>
)}

        <div className="multiplier">

    {/* ✈️ LOGO (ONLY DURING COUNTDOWN) */}
    {game.status === "waiting" && game.countdown <= 5 && (
        <img
            src="/logo.png"
            className="countdown-logo"
            alt="logo"
        />
    )}

    <span>
        {game.status === "waiting"
            ? `Starting in ${game.countdown}s`
            : game.status.toUpperCase()}
    </span>

    <h1 className={`multiplier-value ${game.status}`}>
        {game.multiplier.toFixed(2)}x
    </h1>

</div>

    </div>
        </div>


</div>
    );
}

export default GameBoard;


