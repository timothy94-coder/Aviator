import "./WinnerTicker.css";
import { useGame } from "../../context/GameContext";
import { useEffect, useState } from "react";

function WinnerTicker() {

    const { winners } = useGame();
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        if (!winners) return;

        setFeed(prev => {
            const merged = [...winners, ...prev];
            return merged.slice(0, 40);
        });

    }, [winners]);

    return (
        <div className="winner-wrapper">

            <div className="winner-scroll">

                {feed.map((w, i) => (
                    <div className="winner-item" key={i}>

                        <span className="name">{w.userId}</span>

                        <span className="mult">
                            {w.multiplier}x
                        </span>

                        <span className="win">
                            +{w.winnings} KES
                        </span>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default WinnerTicker;