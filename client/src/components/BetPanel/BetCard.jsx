import { useState, useEffect } from "react";
import { useGame } from "../../context/GameContext";
import { usePlayer } from "../../context/PlayerContext";
import socket from "../../socket/socket";

function BetCard({ id }) {

        const [loading, setLoading] = useState(false);
    const [betError, setBetError] = useState("");
    
    const { game } = useGame();
    const { balance, setBalance, bets, setBets } = usePlayer();

    const activeBet = bets?.[id];

    const [betAmount, setBetAmount] = useState(20);
    const [betNext, setBetNext] = useState(false);

    const increase = () => setBetAmount(p => p + 10);

    const decrease = () => {
        if (betAmount > 10) setBetAmount(p => p - 10);
    };



    function showBetError(message) {

    setBetError(message);

    setTimeout(() => {
        setBetError("");
    }, 2500);

}

    // ---------------- PLACE BET ----------------
function placeBet() {
    if (loading) return;
    if (activeBet) return;

    // 🔥 NEW IMPORTANT FIX
    if (balance <= 0) {
showBetError("Deposit money first");    return;
}

    if (betAmount > balance) {
       showBetError("Insufficient balance");
        return;
    }

    if (game.status !== "waiting") return;

    setLoading(true);

    socket.emit("placeBet", {
        userId: socket.id,
        amount: betAmount,
        roundId: game.roundId,
        betId: id
    });
}

    // ---------------- CASH OUT ----------------
    function cashOut() {
        if (!activeBet) return;
        if (game.status !== "flying") return;

        socket.emit("cashOut", {
            userId: socket.id,
            betId: id
        });
    }

    // ---------------- QUEUE NEXT BET ----------------
    function queueNext() {
        if (activeBet) return;
        setBetNext(true);
    }

    // ---------------- AUTO NEXT BET SYSTEM ----------------
    useEffect(() => {

        if (betNext && game.status === "waiting" && !activeBet) {
            placeBet();
            setBetNext(false);
        }

    }, [game.status, betNext, activeBet]);

    // ---------------- SOCKETS ----------------
    useEffect(() => {

        const onBetAccepted = (data) => {

            if (data.betId !== id) return;

            setLoading(false);

            setBalance(prev => prev - data.amount);

            setBets(prev => ({
                ...prev,
                [id]: {
                    amount: data.amount,
                    betId: id,
                    cashedOut: false
                }
            }));
        };

    const onBetRejected = (data) => {

    setLoading(false);
    setBetNext(false);

    showBetError(data.reason);

};

        const onCashoutSuccess = (data) => {

            if (data.betId !== id) return;

            setBalance(prev => prev + data.winnings);

            setBets(prev => ({
                ...prev,
                [id]: null
            }));
        };

        socket.on("betAccepted", onBetAccepted);
        socket.on("betRejected", onBetRejected);
        socket.on("cashoutSuccess", onCashoutSuccess);

        return () => {
            socket.off("betAccepted", onBetAccepted);
            socket.off("betRejected", onBetRejected);
            socket.off("cashoutSuccess", onCashoutSuccess);
        };

    }, [id]);

    // ---------------- UI ----------------
    return (
        <div className="bet-card">

            <div className="bet-left">

                <div className="bet-header">
                    BET {id}
                </div>

                <div className="amount-box">

                    <button onClick={decrease}>−</button>

                    <input
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(Number(e.target.value))}
                    />

                    <button onClick={increase}>+</button>

                </div>

                <div className="quick-buttons">
                    <button onClick={() => setBetAmount(20)}>20</button>
                    <button onClick={() => setBetAmount(50)}>50</button>
                    <button onClick={() => setBetAmount(100)}>100</button>
                    <button onClick={() => setBetAmount(1000)}>1000</button>
                </div>

                {betError && (
    <div className="bet-error">
        {betError}
    </div>
)}

            </div>

            <button
                className={`bet-btn ${
                    activeBet && game.status === "flying" ? "cashout" : ""
                } ${game.status === "crashed" ? "disabled" : ""}`}
                onClick={() => {

                    if (game.status === "waiting") {
                        placeBet();
                    } else if (game.status === "flying") {
                        if (activeBet) cashOut();
                        else queueNext();
                    }

                }}
            >

                <div className="bet-title">
                    {loading
                        ? "SENDING..."
                        : game.status === "waiting"
                            ? activeBet ? "BET PLACED" : "BET"
                            : game.status === "flying"
                                ? activeBet
                                    ? `CASH OUT ${game.multiplier.toFixed(2)}x`
                                    : betNext
                                        ? "BET QUEUED"
                                        : "BET NEXT"
                                : "CRASHED"}
                </div>

                <div className="bet-amount">
                    {activeBet ? activeBet.amount : betAmount} KES
                </div>

            </button>

        </div>
    );
}

export default BetCard;