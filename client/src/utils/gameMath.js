export function getFlightData(multiplier) {

    const safeMultiplier = Math.max(1, multiplier);

    /*
    🔥 NEW PROGRESS (LOG BASED)
    Slower start, smoother growth
    */
    const progress = Math.min(
        Math.log(safeMultiplier) / Math.log(100), // up to ~100x
        1
    );


    /*
    Horizontal movement
    */
    const x = 60 + progress * 720;


    /*
    Vertical movement
    smoother takeoff (no jumping)
    */
    const y = 360 - Math.pow(progress, 2.2) * 280;


    return {
        progress,
        x,
        y
    };
}
