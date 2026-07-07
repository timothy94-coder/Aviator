import "./LiveGraph.css";
import { useGame } from "../../context/GameContext";
import { getFlightData } from "../../utils/gameMath";

function LiveGraph() {

    const { game } = useGame();

    const { x, y } = getFlightData(game.multiplier || 1);

    const path = `
        M 70 340
        Q ${x * 0.55} ${340},
          ${x} ${y}
    `;

    return (

        <svg
            className="live-graph"
            viewBox="0 0 900 400"
            preserveAspectRatio="none"
        >

            <path
                d={`${path} L ${x} 400 L 70 400 Z`}
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