if(!document.querySelector){
  document.body.innerHTML='<div style="padding:20px;font-family:sans-serif;text-align:center">Seu navegador não suporta os recursos necessários para exibir esta página.</div>';
  console.warn('Navegador sem suporte: querySelector ausente');
}else{
const container=document.getElementById('cards');
const defaultState={
  players:{},
  bullTimes:[],
  bullFinished:false,
  cottonWars:[],
  beerPongs:[],
  pacalWars:[],
  bingoWinners:null,
  attractions:[],
  teamNames:{blue:'Azul',yellow:'Amarelo'},
  points:{
    bullFirst:20,
    bullSecond:10,
    bullThird:5,
    bullFourth:3,
    bullFifth:1,
    cottonWin:3,
    beerWin:3,
    pacalWin:3,
    bingoFirst:5,
    bingoSecond:3,
    bingoThird:1
  },
  scores:{blue:0,yellow:0},
};
let state={...defaultState};
let pollTimer;
function render(){
  container.innerHTML='';
  if(state.bullTimes.length>0){
    const keys=['bullFirst','bullSecond','bullThird','bullFourth','bullFifth'];
    const sorted=[...state.bullTimes].sort((a,b)=>b.time-a.time).slice(0,5);
    const card=document.createElement('div');
    card.className='card bull-card';
    let html='<h2>Touro Mecânico 🐂</h2><ol>';
    sorted.forEach((r,i)=>{
      const pts=i<keys.length?state.points[keys[i]]||0:0;
      html+=`<li><span class="team-${state.players[r.name]}">${r.name}</span> - ${r.time}s (${pts} pts)${i==0?' 🏆':''}</li>`;
    });
    html+='</ol>';
    card.innerHTML=html;
    container.appendChild(card);
  }
  if(state.cottonWars.length>0){
    const pts=state.points.cottonWin||0;
    const recent=state.cottonWars.slice().reverse();
    const card=document.createElement('div');
    card.className='card cotton-card';
    let html='<h2>Guerra de Cotonete ⚔️</h2>';
    html+='<ul>';
    recent.forEach(b=>{
      const trophy1=b.winner===b.p1?'🏆':'';
      const trophy2=b.winner===b.p2?'🏆':'';
      const time=b.time?new Date(b.time).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'';
      html+=`<li><span class="team-${state.players[b.p1]}">${b.p1}${trophy1}</span> vs <span class="team-${state.players[b.p2]}">${b.p2}${trophy2}</span> (+${pts}) <small>${time}</small></li>`;
    });
    html+='</ul>';
    card.innerHTML=html;
    container.appendChild(card);
  }
  if(state.bingoWinners){
    const card=document.createElement('div');
    card.className='card bingo-card';
    let html='<h2>Bingo 🎉</h2><ol>';
    const rows=[
      {name:state.bingoWinners.first,key:'bingoFirst',trophy:'🏆',pos:'1º'},
      {name:state.bingoWinners.second,key:'bingoSecond',pos:'2º'},
      {name:state.bingoWinners.third,key:'bingoThird',pos:'3º'},
    ];
    rows.forEach((r,i)=>{
      const pts=state.points[r.key]||0;
      html+=`<li>${r.pos} <span class="team-${state.players[r.name]}">${r.name||''}</span> (${pts} pts) ${r.trophy||''}</li>`;
    });
    html+='</ol>';
    card.innerHTML=html;
    container.appendChild(card);
  }
  if(state.beerPongs.length>0){
    const pts=state.points.beerWin||0;
    const recent=state.beerPongs.slice().reverse();
    const card=document.createElement('div');
    card.className='card beer-card';
    let html='<h2>🍺 Beer Pong 🍺</h2><ul>';
    recent.forEach(b=>{
      const team1Color=state.players[b.team1[0]];
      const team2Color=state.players[b.team2[0]];
      const trophy1=b.winner===team1Color?'🏆':'';
      const trophy2=b.winner===team2Color?'🏆':'';
      html+=`<li><span class="team-${team1Color}">${b.team1[0]}</span> & <span class="team-${team1Color}">${b.team1[1]}</span>${trophy1} vs <span class="team-${team2Color}">${b.team2[0]}</span> & <span class="team-${team2Color}">${b.team2[1]}</span>${trophy2} (+${pts})</li>`;
    });
    html+='</ul>';
    card.innerHTML=html;
    container.appendChild(card);
  }
  if(state.pacalWars.length>0){
    const pts=state.points.pacalWin||0;
    const recent=state.pacalWars.slice().reverse();
    const card=document.createElement('div');
    card.className='card pacal-card';
    let html='<h2>Pacal 🎯</h2><ul>';
    recent.forEach(b=>{
      const trophy1=b.winner===b.p1?'🏆':'';
      const trophy2=b.winner===b.p2?'🏆':'';
      html+=`<li><span class="team-${state.players[b.p1]}">${b.p1}${trophy1}</span> vs <span class="team-${state.players[b.p2]}">${b.p2}${trophy2}</span> (+${pts})</li>`;
    });
    html+='</ul>';
    card.innerHTML=html;
    container.appendChild(card);
  }
  if(state.attractions.length>0){
    const now=new Date();
    const attractions=[...state.attractions].sort((a,b)=>new Date(a.time)-new Date(b.time));
    const current=attractions.filter(a=>new Date(a.time)<=now).pop();
    const next=attractions.find(a=> new Date(a.time)>now);
    const card=document.createElement('div');
    card.className='card attractions-card';
    let html='<h2>Atrações 🎡</h2>';
    if(current){
      html+=`<div>Agora: <strong>${current.name}</strong></div>`;
    }
    if(next){
      const diff=Math.ceil((new Date(next.time)-now)/60000);
      html+=`<div>Em seguida: ${next.name} <span class="clock">🕒 ${diff} min</span></div>`;
    }
    card.innerHTML=html;
    container.appendChild(card);
  }
  const scoreEntries=Object.entries(state.scores).sort((a,b)=>b[1]-a[1]);
  const maxScore=Math.max(...scoreEntries.map(s=>s[1]),1);
  const card=document.createElement('div');
  card.className='card score-card';
  let html='<h2>Placar 🏆</h2>';
  scoreEntries.forEach(([team,score],i)=>{
    const pct=Math.round(score/maxScore*100);
    html+=`<div class="score-row"><div class="score-bar team-${team}" style="width:${pct}%">${state.teamNames[team]} - ${score}${i==0?' 🏆':''}</div></div>`;
  });
  card.innerHTML=html;
  container.appendChild(card);
}
function updateAndRender(data){
  try{
    const serialized=JSON.stringify(data);
    if(serialized===updateAndRender.lastSerialized) return;
    updateAndRender.lastSerialized=serialized;
    state=data;
    render();
  }catch(e){console.error('Erro ao atualizar',e);}
}
function fetchState(){
  try{
    fetch('/api/state').then(r=>r.json()).then(updateAndRender).catch(e=>console.error('Erro fetch',e));
  }catch(e){console.error('Polling exception',e);}
}
function startPolling(){
  clearInterval(pollTimer);
  fetchState();
  pollTimer=setInterval(fetchState,5000);
}
startPolling();
}
