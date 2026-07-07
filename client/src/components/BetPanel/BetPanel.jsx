import "./BetPanel.css";
import BetCard from "./BetCard";
import WinnerTicker from "../WinnerTicker/WinnerTicker";

function BetPanel() {

    return (
        <div className="bet-panel">

            <div className="bets-stack">

                <BetCard id={1} />
                <BetCard id={2} />

            </div>

            <WinnerTicker />

        </div>
    );
}

export default BetPanel;