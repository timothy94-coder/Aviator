import Header from "./components/Header/Header";
import HistoryBar from "./components/HistoryBar/HistoryBar";
import GameBoard from "./components/GameBoard/GameBoard";
import BetPanel from "./components/BetPanel/BetPanel";
import Leaderboard from "./components/Leaderboard/Leaderboard";

function App() {
  return (
    <>
      <Header />

      <div className="main-layout">

        <div className="left-panel">
          <Leaderboard />
        </div>

        <div className="center-panel">
          <HistoryBar />
          <GameBoard />
        </div>

        <div className="right-panel">
          <BetPanel />
        </div>

      </div>
    </>
  );
}

export default App;