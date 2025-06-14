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
  document.body.innerHTML = '<div style="padding:20px;font-family:sans-serif;text-align:center">Seu navegador não suporta os recursos necessários para exibir esta página.</div>';
  console.warn('Navegador sem suporte: querySelector ausente');
} else {
  var render = function render() {
    container.innerHTML = '';
    attractionsEl.innerHTML = '';
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
      var html = '';
      if (current) {
        html += "<div class=\"attractions-label\">Agora:</div><div class=\"attractions-current\"> ".concat(current.name, " </div>");
      }
      if (next) {
        var diff = Math.ceil((new Date(next.time) - now) / 60000);
        html += "<div class=\"attractions-label\">Em seguida:</div><div class=\"attractions-next\"> ".concat(next.name, " <span class=\"clock\">\uD83D\uDD52 ").concat(diff, " min</span></div>");
      }
      attractionsEl.innerHTML = html;
    }
    var scoreEntries = Object.entries(state.scores).sort(function (a, b) {
      return b[1] - a[1];
    });
    var maxScore = Math.max.apply(Math, _toConsumableArray(scoreEntries.map(function (s) {
      return s[1];
    })).concat([1]));
    var scoreCard = document.createElement('div');
    scoreCard.className = 'card score-card';
    var scoreHtml = '<h2>Placar 🏆</h2>';
    scoreEntries.forEach(function (_ref, i) {
      var _ref2 = _slicedToArray(_ref, 2),
        team = _ref2[0],
        score = _ref2[1];
      var pct = Math.round(score / maxScore * 100);
      scoreHtml += "<div class=\"score-row\"><div class=\"score-bar team-".concat(team, "\" style=\"width:").concat(pct, "%\"> ").concat(state.teamNames[team], " - ").concat(score).concat(i == 0 ? ' 🏆' : '', " </div></div>");
    });
    scoreCard.innerHTML = scoreHtml;
    container.appendChild(scoreCard);
    if (state.bullTimes.length > 0) {
      var keys = ['bullFirst', 'bullSecond', 'bullThird', 'bullFourth', 'bullFifth'];
      var sorted = _toConsumableArray(state.bullTimes).sort(function (a, b) {
        return b.time - a.time;
      });
      var card = document.createElement('div');
      card.className = 'card bull-card';
      var _html = '<h2>Touro Mecânico 🐂</h2><ol>';
      sorted.forEach(function (r, i) {
        var pts = i < keys.length ? state.points[keys[i]] || 0 : 0;
        _html += "<li><span class=\"team-".concat(state.players[r.name], "\"> ").concat(r.name, " </span> - ").concat(r.time, "s (").concat(pts, " pts)").concat(i == 0 ? ' 🏆' : '', "</li>");
      });
      _html += '</ol>';
      card.innerHTML = _html;
      container.appendChild(card);
    }
    if (state.cottonWars.length > 0) {
      var pts = state.points.cottonWin || 0;
      var recent = state.cottonWars.slice().reverse();
      var _card = document.createElement('div');
      _card.className = 'card cotton-card';
      var _html2 = '<h2>Guerra de Cotonete ⚔️</h2>';
      _html2 += '<ul>';
      recent.forEach(function (b) {
        var trophy1 = b.winner === b.p1 ? '🏆' : '';
        var trophy2 = b.winner === b.p2 ? '🏆' : '';
        var time = b.time ? new Date(b.time).toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        }) : '';
        _html2 += "<li><span class=\"team-".concat(state.players[b.p1], "\"> ").concat(b.p1).concat(trophy1, " </span> vs <span class=\"team-").concat(state.players[b.p2], "\"> ").concat(b.p2).concat(trophy2, " </span> (+").concat(pts, ") <small>").concat(time, "</small></li>");
      });
      _html2 += '</ul>';
      _card.innerHTML = _html2;
      container.appendChild(_card);
    }
    if (state.bingoWinners) {
      var _card2 = document.createElement('div');
      _card2.className = 'card bingo-card';
      var _html3 = '<h2>Bingo 🎉</h2><ol>';
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
        _html3 += "<li>".concat(r.pos, " <span class=\"team-").concat(state.players[r.name], "\"> ").concat(r.name, " </span> (").concat(pts, " pts) ").concat(r.trophy || '', "</li>");
      });
      _html3 += '</ol>';
      _card2.innerHTML = _html3;
      container.appendChild(_card2);
    }
    if (state.beerPongs.length > 0) {
      var _pts = state.points.beerWin || 0;
      var _recent = state.beerPongs.slice().reverse();
      var _card3 = document.createElement('div');
      _card3.className = 'card beer-card';
      var _html4 = '<h2>Beer Pong 🍺</h2><ul>';
      _recent.forEach(function (b) {
        var team1Color = state.players[b.team1[0]];
        var team2Color = state.players[b.team2[0]];
        var trophy1 = b.winner === team1Color ? '🏆' : '';
        var trophy2 = b.winner === team2Color ? '🏆' : '';
        _html4 += "<li><span class=\"team-".concat(team1Color, "\"> ").concat(b.team1[0], " </span> & <span class=\"team-").concat(team1Color, "\"> ").concat(b.team1[1], " </span>").concat(trophy1, " vs <span class=\"team-").concat(team2Color, "\"> ").concat(b.team2[0], " </span> & <span class=\"team-").concat(team2Color, "\"> ").concat(b.team2[1], " </span>").concat(trophy2, " (+").concat(_pts, ")</li>");
      });
      _html4 += '</ul>';
      _card3.innerHTML = _html4;
      container.appendChild(_card3);
    }
    if (state.pacalWars.length > 0) {
      var _pts2 = state.points.pacalWin || 0;
      var _recent2 = state.pacalWars.slice().reverse();
      var _card4 = document.createElement('div');
      _card4.className = 'card pacal-card';
      var _html5 = '<h2>Pacal 🎯</h2><ul>';
      _recent2.forEach(function (b) {
        var trophy1 = b.winner === b.p1 ? '🏆' : '';
        var trophy2 = b.winner === b.p2 ? '🏆' : '';
        _html5 += "<li><span class=\"team-".concat(state.players[b.p1], "\"> ").concat(b.p1).concat(trophy1, " </span> vs <span class=\"team-").concat(state.players[b.p2], "\"> ").concat(b.p2).concat(trophy2, " </span> (+").concat(_pts2, ")</li>");
      });
      _html5 += '</ul>';
      _card4.innerHTML = _html5;
      container.appendChild(_card4);
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
      console.error('Erro ao atualizar', e);
    }
  };
  var fetchState = function fetchState() {
    try {
      fetch('/api/state').then(function (r) {
        return r.json();
      }).then(_updateAndRender)["catch"](function (e) {
        return console.error('Erro fetch', e);
      });
    } catch (e) {
      console.error('Polling exception', e);
    }
  };
  var startPolling = function startPolling() {
    clearInterval(pollTimer);
    fetchState();
    pollTimer = setInterval(fetchState, 5000);
  };
  var container = document.getElementById('cards');
  var attractionsEl = document.getElementById('attractions-info');
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
  var pollTimer;
  startPolling();
  // Force a full page reload every 20 seconds on mobile
  setInterval(function () {
    try {
      window.location.reload();
    } catch (e) {
      console.error('Reload failed', e);
    }
  }, 20000);
}
