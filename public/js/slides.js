"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
if (!document.querySelector) {
  document.body.innerHTML = "<div style=\"padding:20px;font-family:sans-serif;text-align:center\">Seu navegador n\xE3o suporta os recursos necess\xE1rios para exibir esta p\xE1gina.</div>";
  console.warn('Navegador sem suporte: querySelector ausente');
} else {
  var render = function render() {
    clearTimeout(timer);
    slidesEl.innerHTML = '';
    var slides = [];
    if (state.bullTimes.length > 0) {
      var keys = ['bullFirst', 'bullSecond', 'bullThird', 'bullFourth', 'bullFifth'];
      var sorted = _toConsumableArray(state.bullTimes).sort(function (a, b) {
        return b.time - a.time;
      }).slice(0, 10);
      var _html = '<div class="bull-slide">';
      _html += '<div class="bull-title">Touro Mecânico 🐂</div>';
      _html += '<table class="bull-table">';
      for (var row = 0; row < 5; row++) {
        _html += '<tr>';
        var left = sorted[row];
        var right = sorted[row + 5];
        if (left) {
          var pts = row < keys.length ? state.points[keys[row]] || 0 : 0;
          _html += "<td>".concat(row + 1, ". <span class=\"team-").concat(state.players[left.name], "\"> ").concat(left.name, "</span> - <span class=\"mono\"><span class=\"time\">").concat(left.time, "s</span>").concat(row < keys.length ? " (<span class=\"points\">".concat(pts, " pts</span>)") : '', "</span> ").concat(row == 0 ? '🏆' : '', "</td>");
        } else {
          _html += '<td></td>';
        }
        if (right) {
          var _idx = row + 5;
          _html += "<td>".concat(_idx + 1, ". <span class=\"team-").concat(state.players[right.name], "\"> ").concat(right.name, " </span> - <span class=\"time\">").concat(right.time, "s</span></td>");
        } else {
          _html += '<td></td>';
        }
        _html += '</tr>';
      }
      _html += '</table></div>';
      slides.push({
        color: 'darkred',
        image: bgImages.bull,
        html: _html
      });
    }
    if (state.cottonWars.length > 0) {
      var _pts = state.points.cottonWin || 0;
      var recent = state.cottonWars.slice().reverse();
      var _html2 = '<div class="cotton-slide"><h1>Guerra de Cotonete ⚔️</h1><div class="cotton-wrapper">';
      recent.forEach(function (b) {
        var time = b.time ? new Date(b.time).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }) : '';
        var trophy1 = b.winner === b.p1 ? '🏆' : '';
        var trophy2 = b.winner === b.p2 ? '🏆' : '';
        _html2 += "<div class=\"cotton-row\"><span class=\"team-".concat(state.players[b.p1], "\"> ").concat(b.p1).concat(trophy1, "</span><span class=\"vs\">vs</span><span class=\"team-").concat(state.players[b.p2], "\"> ").concat(b.p2).concat(trophy2, "</span> <span class=\"mono\">(<span class=\"points\">+").concat(_pts, "</span>) <span class=\"cotton-time\">").concat(time, "</span></span></div>");
      });
      _html2 += '</div></div>';
      slides.push({
        color: 'green',
        image: bgImages.cotton,
        html: _html2
      });
    }
    if (state.bingoWinners) {
      var _html3 = '<div class="bingo-slide">';
      _html3 += '<div class="bingo-title">Bingo 🎉</div>';
      _html3 += '<table class="bingo-table">';
      var rows = [{
        name: state.bingoWinners.first,
        key: 'bingoFirst',
        trophy: '🏆',
        pos: '1º'
      }, {
        name: state.bingoWinners.second,
        key: 'bingoSecond',
        pos: '2º'
      }, {
        name: state.bingoWinners.third,
        key: 'bingoThird',
        pos: '3º'
      }].filter(function (r) {
        return r.name;
      });
      rows.forEach(function (r, i) {
        var pts = state.points[r.key] || 0;
        var cls = i === 0 ? 'first-place' : i === 1 ? 'second-place' : '';
        _html3 += "<tr class=\"".concat(cls, "\"><td>").concat(r.pos, " <span class=\"team-").concat(state.players[r.name], "\"> ").concat(r.name, " </span> (<span class=\"points\">").concat(pts, "</span> pts) ").concat(r.trophy || '', "</td></tr>");
      });
      _html3 += '</table></div>';
      slides.push({
        color: 'purple',
        image: bgImages.bingo,
        html: _html3
      });
    }
    if (state.beerPongs.length > 0) {
      var _pts2 = state.points.beerWin || 0;
      var _recent = state.beerPongs.slice(-6).reverse();
      var _html4 = '<div class="beer-slide"><h1 class="beer-title">🍺 Beer Pong 🍺</h1><div class="beer-wrapper">';
      _recent.forEach(function (b) {
        var team1Color = state.players[b.team1[0]];
        var team2Color = state.players[b.team2[0]];
        var trophy1 = team1Color === b.winner ? '🏆' : '';
        var trophy2 = team2Color === b.winner ? '🏆' : '';
        _html4 += "<div class=\"beer-row\"><span class=\"team-".concat(team1Color, "\"> ").concat(b.team1[0], " </span> & <span class=\"team-").concat(team1Color, "\"> ").concat(b.team1[1], " </span>").concat(trophy1, "<span class=\"vs\">vs</span><span class=\"team-").concat(team2Color, "\"> ").concat(b.team2[0], " </span> & <span class=\"team-").concat(team2Color, "\"> ").concat(b.team2[1], " </span>").concat(trophy2, " <span class=\"mono\">(<span class=\"points\">+").concat(_pts2, "</span>)</span></div>");
      });
      _html4 += '</div></div>';
      slides.push({
        color: 'orange',
        image: bgImages.beer,
        html: _html4
      });
    }
    if (state.pacalWars.length > 0) {
      var _pts3 = state.points.pacalWin || 0;
      var _recent2 = state.pacalWars.slice().reverse();
      var _html5 = '<div class="pacal-slide"><h1>Pacal 🎯</h1><div class="pacal-wrapper">';
      _recent2.forEach(function (b) {
        var team1Color = state.players[b.team1[0]];
        var team2Color = state.players[b.team2[0]];
        var trophy1 = team1Color === b.winner ? '🏆' : '';
        var trophy2 = team2Color === b.winner ? '🏆' : '';
        _html5 += "<div class=\"pacal-row\"><span class=\"team-".concat(team1Color, "\"> ").concat(b.team1[0], " </span> & <span class=\"team-").concat(team1Color, "\"> ").concat(b.team1[1], " </span>").concat(trophy1, "<span class=\"vs\">vs</span><span class=\"team-").concat(team2Color, "\"> ").concat(b.team2[0], " </span> & <span class=\"team-").concat(team2Color, "\"> ").concat(b.team2[1], " </span>").concat(trophy2, " <span class=\"mono\">(<span class=\"points\">+").concat(_pts3, "</span>)</span></div>");
      });
      _html5 += '</div></div>';
      slides.push({
        color: 'brown',
        image: bgImages.pacal,
        html: _html5
      });
    }
    if (state.attractions.length > 0) {
      var now = new Date();
      var attractions = _toConsumableArray(state.attractions).sort(function (a, b) {
        return new Date(a.time) - new Date(b.time);
      });
      var current = attractions.filter(function (a) {
        return new Date(a.time) <= now;
      }).pop();
      var next = attractions.find(function (a) {
        return new Date(a.time) > now;
      });
      var _html6 = '<div class="attractions-slide">';
      _html6 += '<div class="attractions-title">Atrações 🎪</div>';
      if (current) {
        _html6 += "<div class=\"attractions-now-label\">Agora:</div>";
        _html6 += "<div class=\"attractions-current\"> ".concat(current.name, " </div>");
      }
      if (next) {
        var diff = Math.ceil((new Date(next.time) - now) / 60000);
        _html6 += "<div class=\"attractions-next-label\">Em seguida</div>";
        _html6 += "<div class=\"attractions-next\"> ".concat(next.name, " <span class=\"clock\">\uD83D\uDD52 ").concat(diff, " min</span></div>");
      }
      _html6 += '</div>';
      slides.push({
        color: 'blue',
        image: bgImages.attractions,
        html: _html6
      });
    }
    var scoreEntries = Object.entries(state.scores).sort(function (a, b) {
      return b[1] - a[1];
    });
    var maxScore = Math.max.apply(Math, _toConsumableArray(scoreEntries.map(function (s) {
      return s[1];
    })).concat([1]));
    var html = '<div class="score-slide"><h1>Placar 🎉</h1><div class="score-chart">';
    scoreEntries.forEach(function (_ref, i) {
      var _ref2 = _slicedToArray(_ref, 2),
        team = _ref2[0],
        score = _ref2[1];
      var pct = Math.round(score / maxScore * 100);
      html += "<div class=\"score-row\"><div class=\"score-bar team-".concat(team, "\" style=\"width:").concat(pct, "%\"><span class=\"score-name\"> ").concat(state.teamNames[team], " </span><span class=\"score-value points\"> ").concat(score).concat(i == 0 ? ' 🏆' : '', " </span></div></div>");
    });
    html += '</div></div>';
    slides.push({
      color: 'black',
      image: bgImages.score,
      html: html
    });
    slides.forEach(function (s, i) {
      var div = document.createElement('div');
      div.className = 'slide';
      if (s.color) div.style.backgroundColor = s.color;
      if (s.image) div.style.backgroundImage = "url('".concat(s.image, "')");
      div.innerHTML = s.html;
      slidesEl.appendChild(div);
    });
    var idx = 0;
    function show() {
      slidesEl.querySelectorAll('.slide').forEach(function (el, i) {
        el.classList.toggle('active', i === idx);
      });
      idx = (idx + 1) % slidesEl.children.length;
    }
    function schedule() {
      timer = setTimeout(function () {
        show();
        schedule();
      }, 10000);
    }
    slidesEl.onclick = function () {
      if (slidesEl.children.length) {
        clearTimeout(timer);
        show();
        schedule();
      }
    };
    if (slidesEl.children.length > 0) {
      show();
      schedule();
    }
  };
  var _updateAndRender = function updateAndRender(data) {
    try {
      var serialized = JSON.stringify(data);
      if (serialized === _updateAndRender.lastSerialized) return;
      _updateAndRender.lastSerialized = serialized;
      state = data;
      render();
    } catch (e) {
      console.error('Erro ao atualizar slides', e);
    }
  };
  var fetchState = function fetchState() {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/state');
      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            _updateAndRender(JSON.parse(xhr.responseText));
          } catch (e) {
            console.error('Erro ao analisar state', e);
          }
        }
      };
      xhr.onerror = function (err) {
        console.error('Falha no polling', err);
      };
      xhr.send();
    } catch (e) {
      console.error('Polling exception', e);
    }
  };
  var startPolling = function startPolling() {
    clearInterval(pollTimer);
    fetchState();
    pollTimer = setInterval(fetchState, 5000);
  };
  var slidesEl = document.getElementById('slides');
  var defaultState = {
    players: {},
    bullTimes: [],
    bullFinished: false,
    cottonWars: [],
    beerPongs: [],
    pacalWars: [],
    bingoWinners: null,
    attractions: [],
    teamNames: {
      blue: 'Azul',
      yellow: 'Amarelo'
    },
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
    scores: {
      blue: 0,
      yellow: 0
    }
  };
  var state = _objectSpread({}, defaultState);
  var timer;
  var pollTimer;
  var bgImages = {
    bull: 'backgrounds/bull.jpg',
    cotton: 'backgrounds/cotton.jpg',
    bingo: 'backgrounds/bingo.jpg',
    beer: 'backgrounds/beer.jpg',
    pacal: 'backgrounds/pacal.jpg',
    attractions: 'backgrounds/attractions.jpg',
    score: 'backgrounds/score.jpg'
  };
  render();
  startPolling();
}
