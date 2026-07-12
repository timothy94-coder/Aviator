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


    for(let i = 0; i < count; i++){

        const multiplier = Number(
            (Math.random() * 5 + 1.2).toFixed(2)
        );


        const amount =
            Math.floor(Math.random() * 500) + 50;


        roundWinners.push({

            userId:
                fakeUsers[
                    Math.floor(
                        Math.random() * fakeUsers.length
                    )
                ],

            multiplier,

            winnings:
                Number(
                    (amount * multiplier).toFixed(2)
                ),

            roundId:
                gameState.roundId

        });

    }


    winners = [...roundWinners];


    io.emit(
        "winnersUpdate",
        [...winners]
    );

}





let scheduledEvents = [

    {
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
    }

];



let forcedCrashPoints = [];





function checkScheduledRounds(){

    const now = new Date();


    for(const event of scheduledEvents){

        if(
            now >= event.time &&
            !event.used
        ){

            event.used = true;

            forcedCrashPoints =
                [...event.rounds];


            console.log(
                "Scheduled rounds loaded:",
                forcedCrashPoints
            );

        }

    }

}





function randomCrashPoint(){

    checkScheduledRounds();


    if(forcedCrashPoints.length > 0){

        const forced =
            forcedCrashPoints.shift();


        console.log(
            "FORCED CRASH:",
            forced
        );


        return Number(forced.toFixed(2));

    }



    const r = Math.random();


    let crash;


    if(r < 0.90){

        crash =
            Math.random() * 4 + 1;

    }
    else if(r < 0.98){

        crash =
            Math.random() * 15 + 5;

    }
    else{

        crash =
            Math.random() * 50 + 20;

    }



    return Number(
        crash.toFixed(2)
    );

}





export function getGameState(){

    return {
        ...gameState
    };

}



export function getBets(){

    return {
        ...bets
    };

}



export function setBets(newBets){

    bets = {
        ...newBets
    };

}





function startEngine(socketIO){

    io = socketIO;


    runWaitingPhase();

}





function emitState(){

    io.emit(
        "gameState",
        {
            ...gameState
        }
    );


    io.emit(
        "betsUpdate",
        {
            ...bets
        }
    );

}





function sendHistory(){

    io.emit(
        "historyUpdate",
        [...history]
    );

}





function runWaitingPhase(){


    winners = [];

    io.emit(
        "winnersUpdate",
        []
    );



    bets = {};

    io.emit(
        "betsUpdate",
        {}
    );



    gameState.status =
        "waiting";


    gameState.countdown =
        5;


    gameState.multiplier =
        1;



    gameState.crashPoint =
        randomCrashPoint();



    console.log(
        "NEW ROUND",
        gameState.roundId,
        "CRASH:",
        gameState.crashPoint
    );



    emitState();



    const waitingInterval =
        setInterval(()=>{


            gameState.countdown--;


            emitState();



            if(gameState.countdown <= 0){


                clearInterval(
                    waitingInterval
                );


                runFlyingPhase();

            }


        },1000);


}







function runFlyingPhase(){


    gameState.status =
        "flying";


    emitState();



    const flyInterval =
        setInterval(()=>{


            gameState.multiplier += 0.05;


            gameState.multiplier =
                Number(
                    gameState.multiplier.toFixed(2)
                );



            emitState();





            if(
                gameState.multiplier >=
                gameState.crashPoint
            ){


                clearInterval(
                    flyInterval
                );



                const finalCrash =
                    Number(
                        gameState.crashPoint.toFixed(2)
                    );



                gameState.multiplier =
                    finalCrash;



                gameState.status =
                    "crashed";



                history.unshift(
                    finalCrash
                );



                if(history.length > 20){

                    history.length = 20;

                }



                console.log(
                    "HISTORY UPDATED:",
                    history
                );



                sendHistory();



                emitState();



                generateFakeWinners();




                setTimeout(()=>{


                    gameState.roundId++;


                    runWaitingPhase();


                },3000);



            }



        },40);


}







export {

    history,
    winners

};


export default startEngine;
