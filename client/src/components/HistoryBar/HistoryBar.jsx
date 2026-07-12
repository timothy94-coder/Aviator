import "./HistoryBar.css";
import { useGame } from "../../context/GameContext";

function getColor(value) {
    if (value < 2) return "red";
    if (value < 10) return "blue";
    return "purple";
}

function HistoryBar() {

    const { history } = useGame();

    return (

        <div className="history-bar">

            {[...history].reverse().map((item, index) => (

                <div
                    key={`${item}-${index}`}
                    className={`history-chip ${getColor(item)}`}
                >
                    {Number(item).toFixed(2)}x
                </div>

            ))}

        </div>

    );

}

export default HistoryBar;
