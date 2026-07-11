export function getFlightData(multiplier) {

    const safeMultiplier = Math.max(1, multiplier);

    const progress = Math.min(
        Math.log(safeMultiplier) / Math.log(100),
        1
    );


    const x = 45 + progress * 775;


    // smoother takeoff
    const climb = Math.pow(progress, 1.7);

    const y = 350 - climb * 300;


    return {
        progress,
        x,
        y
    };
}
