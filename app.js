const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initilizationDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Db Error : ${e.message}`);
    process.exit(1);
  }
};
initilizationDbAndServer();

const requiredFormat = (each) => {
  return {
    playerId: each.player_id,
    playerName: each.player_name,
    jerseyNumber: each.jersey_number,
    role: each.role,
  };
};

//api-1

app.get(`/players/`, async (request, response) => {
  const query = `select * from cricket_team;`;
  const result = await db.all(query);
  response.send(result.map((each) => requiredFormat(each)));
});

//api-3

app.get(`/players/:playerId/`, async (request, response) => {
  const { playerId } = request.params;
  const query = `select * from cricket_team where player_id = ${playerId};`;
  const result = await db.get(query);
  response.send(requiredFormat(result));
});

//api-2

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const query = `INSERT INTO cricket_team (player_name , jersey_number , role) VALUES ('${playerName}' , ${jerseyNumber} , '${role}')`;
  const result = await db.run(query);
  response.send("Player Added to Team");
});

//api-4

app.put(`/players/:playerId/`, async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const query = `update cricket_team set player_name = "${playerName}" , jersey_number = ${jerseyNumber} , role = "${role}" where player_id = ${playerId};`;
  const result = await db.run(query);
  response.send("Player Details Updated");
});

//api-5

app.delete(`/players/:playerId/`, async (request, response) => {
  const { playerId } = request.params;
  const query = `delete from cricket_team where player_id = ${playerId};`;
  const result = await db.run(query);
  response.send("Player Removed");
});

module.exports = app;
