export function getFlightData(multiplier) {

    const safeMultiplier = Math.max(1, multiplier);

    // Flight progress (0 -> 1)
    const progress = Math.min((safeMultiplier - 1) / 9, 1);

    /*
      Horizontal movement:
      Plane reaches only about 78% of the board.
      It never flies outside.
    */
    const x = 70 + progress * 700;

    /*
      Smooth climb.
      Starts low then rises faster.
    */
    const y = 340 - Math.pow(progress, 1.8) * 250;

    return {
        progress,
        x,
        y
    };
}