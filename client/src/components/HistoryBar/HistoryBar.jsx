import "./HistoryBar.css";
import { useGame } from "../../context/GameContext";
import { useEffect, useRef } from "react";

function getColor(value) {
    if (value < 2) return "red";
    if (value < 10) return "blue";
    return "purple";
}

function HistoryBar() {

    const { history } = useGame();
    const barRef = useRef(null);

    // ✅ ALWAYS SHOW LATEST ITEM (RIGHT EDGE)
    useEffect(() => {
        if (barRef.current) {
            barRef.current.scrollLeft = barRef.current.scrollWidth;
        }
    }, [history]);

    return (
        <div className="history-bar" ref={barRef}>
            {history?.map((item, index) => (
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
