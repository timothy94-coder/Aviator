import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import { SoundProvider } from "./context/SoundContext.jsx";

import { PlayerProvider } from "./context/PlayerContext";
import { GameProvider } from "./context/GameContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GameProvider>
     <SoundProvider>
     <PlayerProvider>
        <App />
     </PlayerProvider>
    </SoundProvider>
    </GameProvider>
  </React.StrictMode>
);