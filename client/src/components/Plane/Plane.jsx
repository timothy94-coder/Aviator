import "./Plane.css";
import { useGame } from "../../context/GameContext";
import { getFlightData } from "../../utils/gameMath";

function Plane() {

    const { game } = useGame();

    const { x, y, progress } = getFlightData(game.multiplier || 1);

    return (

        <div
            className="plane"
            style={{
                left: `${(x / 900) * 100}%`,
                top: `${(y / 400) * 100}%`,
                transform: `
               translate(-35%, -35%)
               rotate(${-progress * 28}deg)

                `
            }}
        />

    );

}

export default Plane;
