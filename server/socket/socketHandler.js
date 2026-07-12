import startEngine, {
    getGameState,
    getBets,
    setBets,
    history,
    winners
} from "../game/gameEngine.js";


// 🔥 GLOBAL FLAG (VERY IMPORTANT)
let engineStarted = false;


export default function socketHandler(io) {

    console.log("Socket server started");

    // ✅ START ENGINE ONLY ONCE
    if (!engineStarted) {
        startEngine(io);
        engineStarted = true;
        console.log("Game engine started ONCE");
    }

    io.on("connection", (socket) => {

        console.log(`Player Connected: ${socket.id}`);


        // ✅ HANDLE INITIAL STATE REQUEST (🔥 THIS WAS MISSING)
        socket.on("requestInitialState", () => {

            socket.emit("gameState", getGameState());
            socket.emit("betsUpdate", getBets());
            socket.emit(
    "historyUpdate",
    [...history]
);
            socket.emit("winnersUpdate", winners);

        });


        // ✅ ALSO SEND IMMEDIATELY (backup, works even without request)
        socket.emit("gameState", getGameState());
        socket.emit("betsUpdate", getBets());
        socket.emit(
    "historyUpdate",
    [...history]
);
        socket.emit("winnersUpdate", winners);


        // ================= PLACE BET =================
        socket.on("placeBet", (data) => {

            const userBalance = 0; // replace later

            if (userBalance <= 0) {
                socket.emit("betRejected", {
                    reason: "Deposit money first"
                });
                return;
            }

            const { userId, amount, roundId, betId } = data;

            const gameState = getGameState();

            if (gameState.status !== "waiting") {
                socket.emit("betRejected", {
                    reason: "Betting closed"
                });
                return;
            }

            if (!amount || amount <= 0) {
                socket.emit("betRejected", {
                    reason: "Invalid amount"
                });
                return;
            }

            const bets = getBets();

            if (!bets[userId]) {
                bets[userId] = {};
            }

            bets[userId][betId] = {
                amount,
                active: true,
                cashedOut: false,
                cashoutMultiplier: null,
                roundId,
                betId
            };

            setBets(bets);

            io.emit("betsUpdate", bets);

            socket.emit("betAccepted", {
                amount,
                betId,
                userId,
                success: true
            });
        });


        // ================= CASH OUT =================
        socket.on("cashOut", (data) => {

            const { userId, betId } = data;

            const gameState = getGameState();
            const bets = getBets();

            const bet = bets[userId]?.[betId];

            if (!bet || !bet.active) return;
            if (gameState.status !== "flying") return;

            const multiplier = gameState.multiplier;

            bet.active = false;
            bet.cashedOut = true;
            bet.cashoutMultiplier = multiplier;

            setBets(bets);

            io.emit("betsUpdate", bets);

            socket.emit("cashoutSuccess", {
                winnings: bet.amount * multiplier,
                betId
            });
        });


        socket.on("disconnect", () => {
            console.log(`Player Left: ${socket.id}`);
        });

    });

}
