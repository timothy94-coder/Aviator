export function getFlightProgress(multiplier) {
    // normalize (tweak this later for difficulty)
    return Math.min(multiplier / 10, 1);
}

export function getY(baseY, progress) {
    return baseY - progress;
}