const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const leaderboardPath = path.join(__dirname, "leaderboard.json");

let leaderboard = [];
if (fs.existsSync(leaderboardPath)) {
  leaderboard = JSON.parse(fs.readFileSync(leaderboardPath));
}

app.get("/api/leaderboard", (req, res) => {
  res.json(leaderboard.sort((a, b) => b.score - a.score).slice(0, 10));
});

app.post("/api/leaderboard", (req, res) => {
  const { name, score } = req.body;
  leaderboard.push({ name, score });
  fs.writeFileSync(leaderboardPath, JSON.stringify(leaderboard, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
