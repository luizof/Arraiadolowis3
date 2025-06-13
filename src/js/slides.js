if(!document.querySelector){
  document.body.innerHTML='<div style="padding:20px;font-family:sans-serif;text-align:center">Seu navegador n\u00E3o suporta os recursos necess\u00E1rios para exibir esta p\u00E1gina.</div>';
  console.warn('Navegador sem suporte: querySelector ausente');
}else{
const slidesEl=document.getElementById('slides');
let state={};
let timer;
let pollTimer;
const bgImages={
  bull:'backgrounds/bull.jpg',
  cotton:'backgrounds/cotton.jpg',
  bingo:'backgrounds/bingo.jpg',
  beer:'backgrounds/beer.jpg',
  pacal:'backgrounds/pacal.jpg',
  attractions:'backgrounds/attractions.jpg',
  score:'backgrounds/score.jpg'
};
function render(){
  clearTimeout(timer);
  slidesEl.innerHTML='';
  const slides=[];
    if(state.bullTimes.length>0){
      const keys=['bullFirst','bullSecond','bullThird','bullFourth','bullFifth'];
      const sorted=[...state.bullTimes].sort((a,b)=>a.time-b.time).slice(0,10);
      let html='<div class="bull-slide">';
      html+='<div class="bull-title">Top Touro 🐂</div>';
      html+='<table class="bull-table">';
      for(let row=0; row<5; row++){
        html+='<tr>';
        const left=sorted[row];
        const right=sorted[row+5];
        if(left){
          const pts=row<keys.length?state.points[keys[row]]||0:0;
          html+=`<td>${row+1}. <span class="team-${state.players[left.name]}">${left.name}</span> - ${left.time}s${row<keys.length?` (${pts} pts)`:''} ${row==0?'🏆':''}</td>`;
        }else{html+='<td></td>';}
        if(right){
          const idx=row+5;
          html+=`<td>${idx+1}. <span class="team-${state.players[right.name]}">${right.name}</span> - ${right.time}s</td>`;
        }else{html+='<td></td>';}
        html+='</tr>';
      }
      html+='</table></div>';
      slides.push({color:'darkred',image:bgImages.bull,html});
    }
  if(state.cottonWars.length>0){
    const pts = state.points.cottonWin || 0;
    const recent = state.cottonWars.slice().reverse();
    let html='<div class="cotton-slide"><h1>Guerra de Cotonete ⚔️</h1><div class="cotton-wrapper">';
    recent.forEach(b=>{
      const time=b.time?new Date(b.time).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}):'';
      const trophy1=b.winner===b.p1?'🏆':'';
      const trophy2=b.winner===b.p2?'🏆':'';
      html+=`<div class="cotton-row"><span class="team-${state.players[b.p1]}">${b.p1}${trophy1}</span> vs <span class="team-${state.players[b.p2]}">${b.p2}${trophy2}</span> (+${pts}) <span class="cotton-time">${time}</span></div>`;
    });
    html+='</div></div>';
    slides.push({color:'green',image:bgImages.cotton,html});
  }
  if(state.bingoWinners){
    let html='<div class="bingo-slide">';
    html+='<div class="bingo-title">Bingo 🎉</div>';
    html+='<table class="bingo-table">';
    const rows=[
      {name:state.bingoWinners.first,key:'bingoFirst',trophy:'🏆',pos:'1º'},
      {name:state.bingoWinners.second,key:'bingoSecond',pos:'2º'},
      {name:state.bingoWinners.third,key:'bingoThird',pos:'3º'}
    ];
    rows.forEach((r,i)=>{
      const pts=state.points[r.key]||0;
      const cls=i===0?'first-place':i===1?'second-place':'';
      html+=`<tr class="${cls}"><td>${r.pos} <span class="team-${state.players[r.name]}">${r.name||''}</span> (${pts} pts) ${r.trophy||''}</td></tr>`;
    });
    html+='</table></div>';
    slides.push({color:'purple',image:bgImages.bingo,html});
  }
  if(state.beerPongs.length>0){
    let html='<div class="beer-slide">';
    html+='<div class="beer-title">🍺 Beer Pong 🍺</div>';
    html+='<table class="beer-table">';
    state.beerPongs.slice(-5).forEach(b=>{
      html+=`<tr><td><span class="team-${state.players[b.team1[0]]}">${b.team1[0]}</span></td><td><span class="team-${state.players[b.team2[0]]}">${b.team2[0]}</span></td><td rowspan="2">🏆 <span class="team-${b.winner}">${state.teamNames[b.winner]}</span></td></tr>`;
      html+=`<tr><td><span class="team-${state.players[b.team1[1]]}">${b.team1[1]}</span></td><td><span class="team-${state.players[b.team2[1]]}">${b.team2[1]}</span></td></tr>`;
    });
    html+='</table></div>';
    slides.push({color:'orange',image:bgImages.beer,html});
  }
  if(state.pacalWars.length>0){
    let html='<h1>Pacal 🎯</h1><ul>';
    state.pacalWars.slice(-5).forEach(b=>{html+=`<li><span class="team-${state.players[b.p1]}">${b.p1}</span> vs <span class="team-${state.players[b.p2]}">${b.p2}</span> 🏆 <span class="team-${state.players[b.winner]}">${b.winner}</span></li>`});
    html+='</ul>';
    slides.push({color:'brown',image:bgImages.pacal,html});
  }
  if(state.attractions.length>0){
    const now=new Date();
    const attractions=[...state.attractions].sort((a,b)=>new Date(a.time)-new Date(b.time));
    const current=attractions.filter(a=>new Date(a.time)<=now).pop();
    const next=attractions.find(a=> new Date(a.time)>now);
    let html='<div class="attractions-slide">';
    html+='<div class="attractions-title">Atrações 🎪</div>';
    if(current){
      html+=`<div class="attractions-now-label">Agora:</div>`;
      html+=`<div class="attractions-current">${current.name}</div>`;
    }
    if(next){
      const diff=Math.ceil((new Date(next.time)-now)/60000);
      html+=`<div class="attractions-next-label">Em seguida</div>`;
      html+=`<div class="attractions-next">${next.name} <span class="clock">🕒 ${diff} min</span></div>`;
    }
    html+='</div>';
    slides.push({color:'blue',image:bgImages.attractions,html});
  }
  const scoreEntries=Object.entries(state.scores).sort((a,b)=>b[1]-a[1]);
  let html='<h1>Placar 🏆</h1><ul>';
  scoreEntries.forEach(([team,score],i)=>{html+=`<li>${state.teamNames[team]} - ${score} ${i==0?'🏆':''}</li>`});
  html+='</ul>';
  slides.push({color:'black',image:bgImages.score,html});

  slides.forEach((s,i)=>{
    const div=document.createElement('div');
    div.className='slide';
    if(s.color) div.style.backgroundColor=s.color;
    if(s.image) div.style.backgroundImage=`url('${s.image}')`;
    div.innerHTML=s.html;
    slidesEl.appendChild(div);
  });
  let idx=0;
  function show(){
    slidesEl.querySelectorAll('.slide').forEach((el,i)=>{el.classList.toggle('active',i===idx);});
    idx=(idx+1)%slidesEl.children.length;
  }
  function schedule(){
    timer=setTimeout(()=>{show();schedule();},10000);
  }
  slidesEl.onclick=()=>{if(slidesEl.children.length){clearTimeout(timer);show();schedule();}};
  if(slidesEl.children.length>0){show();schedule();}
}

function updateAndRender(data){
  state=data;
  render();
}

function fetchState(){
  var doFetch = window.fetch ? window.fetch : function(url){
    return new Promise(function(resolve,reject){
      try{
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function(){
          resolve({ json: function(){ return Promise.resolve(JSON.parse(xhr.responseText)); } });
        };
        xhr.onerror = reject;
        xhr.send();
      }catch(e){reject(e);}
    });
  };
  doFetch('/api/state')
    .then(function(r){ return r.json(); })
    .then(updateAndRender)
    .catch(function(err){ return console.error('Polling failed', err); });
}

function startPolling(){
  clearInterval(pollTimer);
  fetchState();
  pollTimer=setInterval(fetchState,5000);
}

function startWebSocket(){
  if(!window.WebSocket){
    console.warn('WebSocket indispon\u00EDvel, iniciando polling');
    startPolling();
    return;
  }
  const proto=location.protocol==='https:'?'wss':'ws';
  const ws=new WebSocket(`${proto}://${location.host}`);
  ws.onmessage=e=>{updateAndRender(JSON.parse(e.data));};
  ws.onerror=()=>{console.warn('WebSocket erro, alternando para polling');startPolling();};
  ws.onclose=()=>{console.warn('WebSocket fechado, alternando para polling');startPolling();};
}

startWebSocket();
}
