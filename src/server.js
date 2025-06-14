const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Serve mobile view at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'mobile', 'index.html'));
});

// Serve slideshow view under /tv
app.get('/tv', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, '..', 'public')));

const DATA_FILE = process.env.DATA_FILE || path.join(process.env.DATA_DIR || path.join(__dirname, '..', 'data'), 'data.json');

const defaultData = {
  players: {}, // name -> team
  bullTimes: [], // {name, time}
  bullFinished: false,
  cottonWars: [], // {p1, p2, winner}
  beerPongs: [], // {team1:[a,b], team2:[c,d], winner:team}
  pacalWars: [], // {team1:[a,b], team2:[c,d], winner:team}
  bingoWinners: null, // {first,second,third}
  attractions: [], // {time, name}
  teamNames: {blue: 'Azul', yellow: 'Amarelo'},
  points: {
    bullFirst: 20,
    bullSecond: 10,
    bullThird: 5,
    bullFourth: 3,
    bullFifth: 1,
    cottonWin: 3,
    beerWin: 3,
    pacalWin: 3,
    bingoFirst: 5,
    bingoSecond: 3,
    bingoThird: 1
  },
  scores: {blue:0, yellow:0}
};

let data = JSON.parse(JSON.stringify(defaultData));

function loadData(){
  if(fs.existsSync(DATA_FILE)){
    try{
      const parsed = JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
      data = { ...defaultData, ...parsed };
    }catch(e){
      console.error('Failed to load data file:', e);
    }
  }
}

function saveData(){
  try{
    const dir = path.dirname(DATA_FILE);
    if(!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  }catch(e){
    console.error('Failed to save data file:', e);
  }
}

loadData();

function sameTeam(...players){
  const teams = players.map(p => data.players[p]).filter(Boolean);
  if(teams.length < players.length) return false;
  return new Set(teams).size === 1;
}

function computeScores() {
  data.scores = {blue:0, yellow:0};
  if (data.bullFinished && data.bullTimes.length > 0) {
    const keys = ['bullFirst','bullSecond','bullThird','bullFourth','bullFifth'];
    const sorted = [...data.bullTimes].sort((a,b)=>b.time-a.time).slice(0, keys.length);
    sorted.forEach((r,i)=>{
      const k = keys[i];
      const team = data.players[r.name];
      if(r && data.points[k] && team) {
        data.scores[team] += data.points[k];
      }
    });
  }
  data.cottonWars.forEach(b=>{
    const team = data.players[b.winner];
    if(team) data.scores[team] += data.points.cottonWin;
  });
  data.beerPongs.forEach(b=>{
    const team = b.winner; // winner is stored as team
    if(team) data.scores[team] += data.points.beerWin;
  });
  data.pacalWars.forEach(b=>{
    const team = b.winner; // winner is stored as team
    if(team) data.scores[team] += data.points.pacalWin;
  });
  if(data.bingoWinners){
    if(data.bingoWinners.first && data.players[data.bingoWinners.first])
      data.scores[data.players[data.bingoWinners.first]] += data.points.bingoFirst;
    if(data.bingoWinners.second && data.players[data.bingoWinners.second])
      data.scores[data.players[data.bingoWinners.second]] += data.points.bingoSecond;
    if(data.bingoWinners.third && data.players[data.bingoWinners.third])
      data.scores[data.players[data.bingoWinners.third]] += data.points.bingoThird;
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
  if(data.players[name]) return res.status(409).end();
  data.players[name]=team;
  saveData();
  res.end();
});

app.put('/api/player/:name', (req,res)=>{
  const oldName = req.params.name;
  if(!data.players[oldName]) return res.status(404).end();
  const {name = oldName, team} = req.body;
  if(name !== oldName){
    if(data.players[name]) return res.status(409).end();
    data.players[name] = data.players[oldName];
    delete data.players[oldName];

    data.bullTimes.forEach(r => {
      if(r.name === oldName) r.name = name;
    });
    data.cottonWars.forEach(r => {
      if(r.p1 === oldName) r.p1 = name;
      if(r.p2 === oldName) r.p2 = name;
      if(r.winner === oldName) r.winner = name;
    });
    data.beerPongs.forEach(b => {
      b.team1 = b.team1.map(p => p === oldName ? name : p);
      b.team2 = b.team2.map(p => p === oldName ? name : p);
    });
    data.pacalWars.forEach(r => {
      r.team1 = r.team1.map(p => p === oldName ? name : p);
      r.team2 = r.team2.map(p => p === oldName ? name : p);
    });
    if (data.bingoWinners) {
      if(data.bingoWinners.first === oldName) data.bingoWinners.first = name;
      if(data.bingoWinners.second === oldName) data.bingoWinners.second = name;
      if(data.bingoWinners.third === oldName) data.bingoWinners.third = name;
    }
  }
  if(team) data.players[name] = team;
  saveData();
  res.end();
});

app.delete('/api/player/:name', (req,res)=>{
  const name = req.params.name;
  delete data.players[name];
  saveData();
  res.end();
});

app.post('/api/bull', (req,res)=>{
  const {name,time} = req.body;
  const t = parseFloat(time);
  if(!Number.isFinite(t)) return res.status(400).end();
  data.bullTimes.push({name,time:t});
  saveData();
  res.end();
});

app.put('/api/bull/:index', (req,res)=>{
  const idx = parseInt(req.params.index,10);
  if(Number.isNaN(idx) || !data.bullTimes[idx]) return res.status(404).end();
  const {name,time} = req.body;
  const t = parseFloat(time);
  if(!Number.isFinite(t)) return res.status(400).end();
  data.bullTimes[idx] = {name,time:t};
  saveData();
  res.end();
});

app.delete('/api/bull/:index', (req,res)=>{
  const idx = parseInt(req.params.index,10);
  if(Number.isNaN(idx) || !data.bullTimes[idx]) return res.status(404).end();
  data.bullTimes.splice(idx,1);
  saveData();
  res.end();
});

app.post('/api/bull/finish', (req,res)=>{
  data.bullFinished = true;
  saveData();
  res.end();
});

app.post('/api/bull/new', (req,res)=>{
  data.bullTimes = [];
  data.bullFinished = false;
  saveData();
  res.end();
});

app.post('/api/cotton', (req,res)=>{
  const {p1,p2,winner,time} = req.body;
  if(!p1 || !p2 || p1===p2 || sameTeam(p1,p2)) return res.status(400).end();
  data.cottonWars.push({
    p1,
    p2,
    winner,
    time: time || new Date().toISOString()
  });
  saveData();
  res.end();
});

app.put('/api/cotton/:index', (req,res)=>{
  const idx = parseInt(req.params.index,10);
  if(Number.isNaN(idx) || !data.cottonWars[idx]) return res.status(404).end();
  const {p1,p2,winner,time} = req.body;
  if(!p1 || !p2 || p1===p2 || sameTeam(p1,p2)) return res.status(400).end();
  const existing = data.cottonWars[idx];
  data.cottonWars[idx] = {
    p1,
    p2,
    winner,
    time: time || existing.time || new Date().toISOString()
  };
  saveData();
  res.end();
});

app.delete('/api/cotton/:index', (req,res)=>{
  const idx = parseInt(req.params.index,10);
  if(Number.isNaN(idx) || !data.cottonWars[idx]) return res.status(404).end();
  data.cottonWars.splice(idx,1);
  saveData();
  res.end();
});

app.post('/api/beer', (req,res)=>{
  const {team1,team2,winner} = req.body;
  if(!team1 || !team2 || team1.length!==2 || team2.length!==2) return res.status(400).end();
  if(team1[0]===team1[1] || team2[0]===team2[1]) return res.status(400).end();
  if(!sameTeam(team1[0],team1[1]) || !sameTeam(team2[0],team2[1]) || sameTeam(team1[0],team2[0])) return res.status(400).end();
  data.beerPongs.push({team1,team2,winner});
  saveData();
  res.end();
});

app.put('/api/beer/:index', (req,res)=>{
  const idx = parseInt(req.params.index,10);
  if(Number.isNaN(idx) || !data.beerPongs[idx]) return res.status(404).end();
  const {team1,team2,winner} = req.body;
  if(!team1 || !team2 || team1.length!==2 || team2.length!==2) return res.status(400).end();
  if(team1[0]===team1[1] || team2[0]===team2[1]) return res.status(400).end();
  if(!sameTeam(team1[0],team1[1]) || !sameTeam(team2[0],team2[1]) || sameTeam(team1[0],team2[0])) return res.status(400).end();
  data.beerPongs[idx] = {team1,team2,winner};
  saveData();
  res.end();
});

app.delete('/api/beer/:index', (req,res)=>{
  const idx = parseInt(req.params.index,10);
  if(Number.isNaN(idx) || !data.beerPongs[idx]) return res.status(404).end();
  data.beerPongs.splice(idx,1);
  saveData();
  res.end();
});

app.post('/api/pacal', (req,res)=>{
  const {team1,team2,winner} = req.body;
  if(!team1 || !team2 || team1.length!==2 || team2.length!==2) return res.status(400).end();
  if(team1[0]===team1[1] || team2[0]===team2[1]) return res.status(400).end();
  if(!sameTeam(team1[0],team1[1]) || !sameTeam(team2[0],team2[1]) || sameTeam(team1[0],team2[0])) return res.status(400).end();
  data.pacalWars.push({team1,team2,winner});
  saveData();
  res.end();
});

app.put('/api/pacal/:index', (req,res)=>{
  const idx = parseInt(req.params.index,10);
  if(Number.isNaN(idx) || !data.pacalWars[idx]) return res.status(404).end();
  const {team1,team2,winner} = req.body;
  if(!team1 || !team2 || team1.length!==2 || team2.length!==2) return res.status(400).end();
  if(team1[0]===team1[1] || team2[0]===team2[1]) return res.status(400).end();
  if(!sameTeam(team1[0],team1[1]) || !sameTeam(team2[0],team2[1]) || sameTeam(team1[0],team2[0])) return res.status(400).end();
  data.pacalWars[idx] = {team1,team2,winner};
  saveData();
  res.end();
});

app.delete('/api/pacal/:index', (req,res)=>{
  const idx = parseInt(req.params.index,10);
  if(Number.isNaN(idx) || !data.pacalWars[idx]) return res.status(404).end();
  data.pacalWars.splice(idx,1);
  saveData();
  res.end();
});

app.post('/api/bingo', (req,res)=>{
  const {first,second,third} = req.body;
  data.bingoWinners = {first,second,third};
  saveData();
  res.end();
});

app.put('/api/bingo', (req,res)=>{
  const {first,second,third} = req.body;
  data.bingoWinners = {first,second,third};
  saveData();
  res.end();
});

app.delete('/api/bingo', (req,res)=>{
  data.bingoWinners = null;
  saveData();
  res.end();
});

app.post('/api/attraction', (req,res)=>{
  const { time, name } = req.body;
  data.attractions.push({ time, name });
  saveData();
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
  saveData();
  res.end();
});

app.delete('/api/attraction/:index', (req,res)=>{
  const idx = parseInt(req.params.index,10);
  if (Number.isNaN(idx) || !data.attractions[idx]) return res.status(404).end();
  data.attractions.splice(idx,1);
  saveData();
  res.end();
});

app.post('/api/config/teamNames', (req,res)=>{
  data.teamNames=req.body;
  saveData();
  res.end();
});

app.post('/api/config/points', (req,res)=>{
  Object.keys(req.body).forEach(k=>{
    const v = parseFloat(req.body[k]);
    if(!isNaN(v)) data.points[k]=v;
  });
  saveData();
  res.end();
});

app.post('/api/reset', (req,res)=>{
  Object.assign(data, {
    players:{}, bullTimes:[], bullFinished:false, cottonWars:[], beerPongs:[], pacalWars:[], bingoWinners:null, attractions:[], scores:{blue:0,yellow:0}
  });
  saveData();
  res.end();
});

function startServer() {
  const server = app.listen(port, () => {
    console.log('Server listening on', port);
  });
  return { server };
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
