import "./Plane.css";
import { useGame } from "../../context/GameContext";
import { getFlightData } from "../../utils/gameMath";
import { useEffect, useState } from "react";

function Plane() {

    const { game } = useGame();

    const [position, setPosition] = useState({
    x:45,
    y:350,
    progress:0
});

    const [crashed, setCrashed] = useState(false);


    useEffect(() => {

        if (game.status === "flying") {

            const data = getFlightData(game.multiplier || 1);

            setPosition(data);
            setCrashed(false);

        }


        if (game.status === "crashed") {

            setCrashed(true);

        }


        if (game.status === "waiting") {

            setPosition({
    x: 45,
    y: 350,
    progress:0
});

            setCrashed(false);

        }


    }, [
        game.status,
        game.multiplier
    ]);



    return (

        <div

            className={`plane ${crashed ? "plane-crash" : ""}`}

            style={{

                left: `${(position.x / 900) * 100}%`,

                top: `${(position.y / 400) * 100}%`,

                transform: `
                    translate(-35%, -35%)
                    rotate(${-position.progress * 28}deg)
                `

            }}

        />

    );

}

export default Plane;
