import "./LiveGraph.css";
import { useGame } from "../../context/GameContext";
import { getFlightData } from "../../utils/gameMath";

function LiveGraph() {

    const { game } = useGame();

    const { x, y } = getFlightData(game.multiplier || 1);


    // Plane tail anchor adjustment
    const tailX = x - 35;
    const tailY = y + 54;


    const path = `
        M 40 380
        Q ${tailX * 0.55} 380,
          ${tailX} ${tailY}
    `;


    return (

        <svg
            className="live-graph"
            viewBox="0 0 900 400"
            preserveAspectRatio="none"
        >

            <path
                d={`${path} L ${tailX} 400 L 40 400 Z`}
                className="graph-fill"
            />

            <path
                d={path}
                className="graph-line"
            />

        </svg>

    );

}

export default LiveGraph;
