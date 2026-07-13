import "./HistoryBar.css";
import { useGame } from "../../context/GameContext";

function getColor(value) {
  if (value < 2) return "red";
  if (value < 10) return "blue";
  return "purple";
}

function HistoryBar() {
  const { history } = useGame();

  // Limit to last 20 items
  const limitedHistory = history?.slice(-4);

  return (
    <div className="history-bar">
      {limitedHistory?.map((item, index) => (
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
