const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const data = {
  players: {}, // name -> team
  bullTimes: [], // {name, time}
  cottonWars: [], // {p1, p2, winner}
  beerPongs: [], // {team1:[a,b], team2:[c,d], winner}
  pacalWars: [], // {p1,p2,winner}
  bingoWinners: null, // {first,second,third}
  attractions: [], // {time, name}
  teamNames: {blue: 'Azul', yellow: 'Amarelo'},
  points: {
    bullFirst: 20,
    bullSecond: 10,
    cottonWin: 3,
    beerWin: 3,
    pacalWin: 3,
    bingoFirst: 5,
    bingoSecond: 3,
    bingoThird: 1
  },
  scores: {blue:0, yellow:0}
};

function computeScores() {
  data.scores = {blue:0, yellow:0};
  if (data.bullTimes.length >= 2) {
    const sorted = [...data.bullTimes].sort((a,b)=>a.time-b.time).slice(0,2);
    if(sorted[0]) data.scores[data.players[sorted[0].name]] += data.points.bullFirst;
    if(sorted[1]) data.scores[data.players[sorted[1].name]] += data.points.bullSecond;
  }
  data.cottonWars.forEach(b=>{ data.scores[data.players[b.winner]] += data.points.cottonWin; });
  data.beerPongs.forEach(b=>{ data.scores[data.players[b.winner]] += data.points.beerWin; });
  data.pacalWars.forEach(b=>{ data.scores[data.players[b.winner]] += data.points.pacalWin; });
  if(data.bingoWinners){
    if(data.bingoWinners.first) data.scores[data.players[data.bingoWinners.first]] += data.points.bingoFirst;
    if(data.bingoWinners.second) data.scores[data.players[data.bingoWinners.second]] += data.points.bingoSecond;
    if(data.bingoWinners.third) data.scores[data.players[data.bingoWinners.third]] += data.points.bingoThird;
  }
}

app.get('/api/state', (req,res)=>{
  computeScores();
  res.json(data);
});

app.get('/api/players', (req,res)=>{
  res.json(data.players);
});

app.post('/api/player', (req,res)=>{
  const {name, team} = req.body;
  if(!name || !team) return res.status(400).end();
  data.players[name]=team;
  res.end();
});

app.post('/api/bull', (req,res)=>{
  const {name,time} = req.body;
  data.bullTimes.push({name,time:parseFloat(time)});
  res.end();
});

app.post('/api/cotton', (req,res)=>{
  const {p1,p2,winner} = req.body;
  data.cottonWars.push({p1,p2,winner});
  res.end();
});

app.post('/api/beer', (req,res)=>{
  const {team1,team2,winner} = req.body;
  data.beerPongs.push({team1,team2,winner});
  res.end();
});

app.post('/api/pacal', (req,res)=>{
  const {p1,p2,winner} = req.body;
  data.pacalWars.push({p1,p2,winner});
  res.end();
});

app.post('/api/bingo', (req,res)=>{
  const {first,second,third} = req.body;
  data.bingoWinners = {first,second,third};
  res.end();
});

app.post('/api/attraction', (req,res)=>{
  const {time,name} = req.body;
  data.attractions.push({time,name});
  res.end();
});

app.get('/api/attractions', (req,res)=>{
  res.json(data.attractions);
});

app.put('/api/attraction/:index', (req,res)=>{
  const idx = parseInt(req.params.index,10);
  if (Number.isNaN(idx) || !data.attractions[idx]) return res.status(404).end();
  const { time, name } = req.body;
  data.attractions[idx] = { time, name };
  res.end();
});

app.delete('/api/attraction/:index', (req,res)=>{
  const idx = parseInt(req.params.index,10);
  if (Number.isNaN(idx) || !data.attractions[idx]) return res.status(404).end();
  data.attractions.splice(idx,1);
  res.end();
});

app.post('/api/config/teamNames', (req,res)=>{
  data.teamNames=req.body;
  res.end();
});

app.post('/api/reset', (req,res)=>{
  Object.assign(data, {
    players:{}, bullTimes:[], cottonWars:[], beerPongs:[], pacalWars:[], bingoWinners:null, attractions:[], scores:{blue:0,yellow:0}
  });
  res.end();
});

function startServer() {
  const server = app.listen(port, () => {
    console.log('Server listening on', port);
  });

  const wss = new WebSocket.Server({ server });
  function broadcast() {
    computeScores();
    const msg = JSON.stringify(data);
    wss.clients.forEach(c => c.readyState === WebSocket.OPEN && c.send(msg));
  }
  setInterval(broadcast, 5000);
  return { server, wss };
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
