import "./Leaderboard.css";

export default function Leaderboard() {
  const players = [
    {
      name: "👑 CryptoKing",
      multiplier: "187.42x",
      amount: "KES 12,480,000",
    },
    {
      name: "🔥 Lucky254",
      multiplier: "96.75x",
      amount: "KES 8,920,000",
    },
    {
      name: "💎 EliteBet",
      multiplier: "73.11x",
      amount: "KES 6,530,000",
    },
    {
      name: "⚡ Maverick",
      multiplier: "58.90x",
      amount: "KES 5,810,000",
    },
    {
      name: "🚀 MoonShot",
      multiplier: "42.60x",
      amount: "KES 4,370,000",
    },
  ];

  return (
    <div className="leaderboard">
      <div className="leader-glow"></div>

      <h2 className="leader-title">
        🏆 BIG WINNERS
      </h2>

      {players.map((player, index) => (
        <div className="leader-card" key={index}>
          <div className="rank">
            #{index + 1}
          </div>

          <div className="player-info">
            <div className="player-name">{player.name}</div>
            <div className="player-win">{player.amount}</div>
          </div>

          <div className="multiplier">
            {player.multiplier}
          </div>
        </div>
      ))}
    </div>
  );
}