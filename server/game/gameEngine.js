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
        "Alex",
        "Brian",
        "Kevin",
        "John",
        "Sarah",
        "Wambui",
        "Mutua",
        "Ali",
        "Grace",
        "Tony"
    ];


    const count = Math.floor(Math.random() * 5) + 3;


    const roundWinners = [];


    for (let i = 0; i < count; i++) {


        const multiplier = Number(
            (Math.random() * 5 + 1.2).toFixed(2)
        );


        const amount = Math.floor(
            Math.random() * 500
        ) + 50;



        roundWinners.push({

            userId:
                fakeUsers[
                    Math.floor(
                        Math.random() * fakeUsers.length
                    )
                ],

            multiplier,

            winnings:
                Math.floor(
                    amount * multiplier
                ),

            roundId:
                gameState.roundId

        });

    }


    winners = roundWinners;


    io.emit(
        "winnersUpdate",
        winners
    );

}





/*
=================================================
SCHEDULED SPECIAL ROUNDS
EDIT THESE NUMBERS ONLY
=================================================

Example:

15 = crash at 15x
2 = crash at 2x
60 = crash at 60x

These happen once at the given time.
*/


let scheduledEvents = [

    {

        // Nairobi time UTC+3

        time:
        new Date(
            "2026-07-12T19:55:00+03:00"
        ),


        rounds:[

            64,
            62,
            72,
            35
            

        ],


        used:false

    },


];



let forcedCrashPoints = [];





function checkScheduledRounds(){


    const now = new Date();



    for(
        const event of scheduledEvents
    ){


        if(

            now >= event.time
            &&
            !event.used

        ){


            event.used = true;



            forcedCrashPoints = [
                ...event.rounds
            ];



            console.log(
                "Scheduled rounds:",
                forcedCrashPoints
            );


        }


    }


}







function randomCrashPoint(){



    checkScheduledRounds();



    /*
    ===================================
    USE SCHEDULED ROUNDS FIRST
    ===================================
    */


    if(
        forcedCrashPoints.length > 0
    ){


        const forced =
            forcedCrashPoints.shift();



        console.log(
            "Special crash:",
            forced
        );



        return forced;

    }





    /*
    ===================================
    NORMAL DISTRIBUTION
    ===================================

    90%  -> 1x - 10x
    8%   -> 10x - 30x
    2%   -> 30x - 100x

    */


const r = Math.random();

let crash;


if(r < 0.90){

    // 90% low rounds
    crash = Math.random() * 4 + 1;

}


else if(r < 0.98){

    // 8% medium
    crash = Math.random() * 15 + 5;

}


else{

    // 2% high
    crash = Math.random() * 50 + 20;

}


return Number(crash.toFixed(2));

}





/*
=================================================
PUBLIC FUNCTIONS
=================================================
*/


export function getGameState(){

    return gameState;

}



export function getBets(){

    return bets;

}



export function setBets(newBets){

    bets = newBets;

}







/*
=================================================
ENGINE
=================================================
*/


function startEngine(socketIO){


    io = socketIO;


    runWaitingPhase();


}







function emitState(){


    io.emit(
        "gameState",
        gameState
    );


    io.emit(
        "betsUpdate",
        bets
    );


}








function runWaitingPhase(){


    winners = [];


    io.emit(
        "winnersUpdate",
        winners
    );



    bets = {};

    io.emit(
        "betsUpdate",
        bets
    );



    gameState.status = "waiting";

    gameState.countdown = 5;

    gameState.multiplier = 1;


    gameState.crashPoint =
        randomCrashPoint();



    emitState();





    const waitingInterval =
    setInterval(()=>{


        gameState.countdown--;


        emitState();



        if(
            gameState.countdown <=0
        ){


           // ================= CRASH HANDLING =================

clearInterval(flyInterval);


gameState.status = "crashed";


// Add latest crash to history
const crashedMultiplier = Number(
    gameState.crashPoint.toFixed(2)
);


history.unshift(crashedMultiplier);


// Keep only latest 20 rounds
if (history.length > 20) {
    history = history.slice(0, 20);
}


// Send history immediately
io.emit(
    "historyUpdate",
    [...history]
);


// Send crashed game state
emitState();


// Generate winners
generateFakeWinners();


setTimeout(() => {

    gameState.roundId++;

    runWaitingPhase();

}, 3000);

        }


    },40);


}



export {

    history,
    winners

};


export default startEngine;
