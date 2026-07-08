let gameState = {
    status: "waiting",
    multiplier: 1,
    crashPoint: 2,
    countdown: 5,
    roundId: 1,
};

let io = null;
let winners = [];
let history = [];
let bets = {};

function generateFakeWinners() {

    const fakeUsers = [
        "Alex", "Brian", "Kevin", "John", "Sarah",
        "Wambui", "Mutua", "Ali", "Grace", "Tony"
    ];

    const count = Math.floor(Math.random() * 5) + 3;

    const roundWinners = [];

    for (let i = 0; i < count; i++) {

        const multiplier = Number((Math.random() * 8 + 1.2).toFixed(2));
        const amount = Math.floor(Math.random() * 500) + 50;

        roundWinners.push({
            userId: fakeUsers[Math.floor(Math.random() * fakeUsers.length)],
            multiplier,
            winnings: Math.floor(amount * multiplier),
            roundId: gameState.roundId
        });
    }

    winners = roundWinners;

    io.emit("winnersUpdate", winners);
}


let forcedCrashPoints = [];

let schedules = [
    {
        // Nairobi time (EAT UTC+3)
        time: new Date("2026-07-08T16:00:00+03:00"),
        rounds: 4,
        used: false
    },
    {
        time: new Date("2026-07-09T03:15:00+03:00"),
        rounds: 4,
        used: false
    },
    {
        time: new Date("2026-07-09T18:45:00+03:00"),
        rounds: 4,
        used: false
    }
];






function randomCrashPoint() {

    const now = new Date();


    /*
    ==============================
    SCHEDULED HIGH ROUND OVERRIDE
    ==============================
    */

    for (const schedule of schedules) {

        if (
            now >= schedule.time &&
            !schedule.used
        ) {

            schedule.used = true;


            forcedCrashPoints = [];


            for (let i = 0; i < schedule.rounds; i++) {

                forcedCrashPoints.push(
                    Number(
                        (Math.random() * 39 + 60).toFixed(2)
                    )
                );

            }


            console.log(
                "High rounds activated:",
                forcedCrashPoints
            );

        }

    }



    /*
    ==============================
    USE FORCED HIGH ROUNDS
    ==============================
    */

    if (forcedCrashPoints.length > 0) {

        const forced = forcedCrashPoints.shift();

        console.log(
            "Forced crash point:",
            forced
        );

        return forced;

    }



    /*
    ==============================
    NORMAL CRASH DISTRIBUTION
    MANY LOW / FEW HIGH
    ==============================
    */
/*
==============================
NORMAL CRASH DISTRIBUTION
MOST LOW / FEW HIGH
==============================
*/

const r = Math.random();

let crash;


if (r < 0.70) {

    // Very common:
    // 1.00x - 3.50x

    crash = Math.random() * 2.5 + 1;

}


else if (r < 0.90) {

    // Common:
    // 3.50x - 10x

    crash = Math.random() * 6.5 + 3.5;

}


else if (r < 0.98) {

    // Rare:
    // 10x - 30x

    crash = Math.random() * 20 + 10;

}


else {

    // Very rare:
    // 30x - 100x

    crash = Math.random() * 70 + 30;

}


return Number(crash.toFixed(2));

}

/* =====================================================
   PUBLIC FUNCTIONS (used by socketHandler.js)
===================================================== */

export function getGameState() {
    return gameState;
}

export function getBets() {
    return bets;
}

export function setBets(newBets) {
    bets = newBets;
}

/* =====================================================
   ENGINE
===================================================== */

function startEngine(socketIO) {

    io = socketIO;

    runWaitingPhase();
}

/* =====================================================
   EMIT
===================================================== */

function emitState() {

    io.emit("gameState", gameState);
    io.emit("betsUpdate", bets);

}

/* =====================================================
   WAITING PHASE
===================================================== */

function runWaitingPhase() {

    winners = [];
io.emit("winnersUpdate", winners);

    // Clear bets every new round
    bets = {};
    io.emit("betsUpdate", bets);

    gameState.status = "waiting";
    gameState.countdown = 5;
    gameState.multiplier = 1;
    gameState.crashPoint = randomCrashPoint();

    emitState();

    const waitingInterval = setInterval(() => {

        gameState.countdown--;

        emitState();

        if (gameState.countdown <= 0) {

            clearInterval(waitingInterval);

            runFlyingPhase();

        }

    }, 1000);

}

/* =====================================================
   FLYING PHASE
===================================================== */

function runFlyingPhase() {

    gameState.status = "flying";

    emitState();

    const flyInterval = setInterval(() => {

        gameState.multiplier += 0.02;
        gameState.multiplier = Number(gameState.multiplier.toFixed(2));

        emitState();

        if (gameState.multiplier >= gameState.crashPoint) {


            clearInterval(flyInterval);

            gameState.status = "crashed";

            history.unshift(gameState.crashPoint);

            if (history.length > 20) {
                history.pop();
            }

            emitState();

            io.emit("historyUpdate", history);

generateFakeWinners();

// ensure sync after crash
io.emit("gameState", gameState);
            setTimeout(() => {

                gameState.roundId++;

                runWaitingPhase();

            }, 3000);

        }

    }, 40);

}
export {
    
    history,
    winners
};

export default startEngine;
