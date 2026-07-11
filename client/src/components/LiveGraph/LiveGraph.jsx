import "./LiveGraph.css";
import { useGame } from "../../context/GameContext";
import { getFlightData } from "../../utils/gameMath";

function LiveGraph() {

    const { game } = useGame();

    const { x, y } = getFlightData(game.multiplier || 1);


    const tailX = x - 20;
    const tailY = y + 55;


    const path = `
        M 0 395
        Q ${tailX * 0.5} 395,
          ${tailX} ${tailY}
    `;


    return (
        <svg
            className="live-graph"
            viewBox="0 0 900 400"
            preserveAspectRatio="none"
        >

            <path
                d={`${path} L ${tailX} 400 L 0 400 Z`}
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
