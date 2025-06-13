"use strict";

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
        return a.time - b.time;
      }).slice(0, 10);
      var _html = '<div class="bull-slide">';
      _html += '<div class="bull-title">Top Touro 🐂</div>';
      _html += '<table class="bull-table">';
      for (var row = 0; row < 5; row++) {
        _html += '<tr>';
        var left = sorted[row];
        var right = sorted[row + 5];
        if (left) {
          var pts = row < keys.length ? state.points[keys[row]] || 0 : 0;
          _html += "<td>".concat(row + 1, ". <span class=\"team-").concat(state.players[left.name], "\">").concat(left.name, "</span> - ").concat(left.time, "s").concat(row < keys.length ? " (".concat(pts, " pts)") : '', " ").concat(row == 0 ? '🏆' : '', "</td>");
        } else {
          _html += '<td></td>';
        }
        if (right) {
          var _idx = row + 5;
          _html += "<td>".concat(_idx + 1, ". <span class=\"team-").concat(state.players[right.name], "\">").concat(right.name, "</span> - ").concat(right.time, "s</td>");
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
        _html2 += "<div class=\"cotton-row\"><span class=\"team-".concat(state.players[b.p1], "\">").concat(b.p1).concat(trophy1, "</span> vs <span class=\"team-").concat(state.players[b.p2], "\">").concat(b.p2).concat(trophy2, "</span> (+").concat(_pts, ") <span class=\"cotton-time\">").concat(time, "</span></div>");
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
      }];
      rows.forEach(function (r, i) {
        var pts = state.points[r.key] || 0;
        var cls = i === 0 ? 'first-place' : i === 1 ? 'second-place' : '';
        _html3 += "<tr class=\"".concat(cls, "\"><td>").concat(r.pos, " <span class=\"team-").concat(state.players[r.name], "\">").concat(r.name || '', "</span> (").concat(pts, " pts) ").concat(r.trophy || '', "</td></tr>");
      });
      _html3 += '</table></div>';
      slides.push({
        color: 'purple',
        image: bgImages.bingo,
        html: _html3
      });
    }
    if (state.beerPongs.length > 0) {
      var _html4 = '<div class="beer-slide">';
      _html4 += '<div class="beer-title">🍺 Beer Pong 🍺</div>';
      _html4 += '<table class="beer-table">';
      state.beerPongs.slice(-5).forEach(function (b) {
        _html4 += "<tr><td><span class=\"team-".concat(state.players[b.team1[0]], "\">").concat(b.team1[0], "</span></td><td><span class=\"team-").concat(state.players[b.team2[0]], "\">").concat(b.team2[0], "</span></td><td rowspan=\"2\">\uD83C\uDFC6 <span class=\"team-").concat(b.winner, "\">").concat(state.teamNames[b.winner], "</span></td></tr>");
        _html4 += "<tr><td><span class=\"team-".concat(state.players[b.team1[1]], "\">").concat(b.team1[1], "</span></td><td><span class=\"team-").concat(state.players[b.team2[1]], "\">").concat(b.team2[1], "</span></td></tr>");
      });
      _html4 += '</table></div>';
      slides.push({
        color: 'orange',
        image: bgImages.beer,
        html: _html4
      });
    }
    if (state.pacalWars.length > 0) {
      var _html5 = '<h1>Pacal 🎯</h1><ul>';
      state.pacalWars.slice(-5).forEach(function (b) {
        _html5 += "<li><span class=\"team-".concat(state.players[b.p1], "\">").concat(b.p1, "</span> vs <span class=\"team-").concat(state.players[b.p2], "\">").concat(b.p2, "</span> \uD83C\uDFC6 <span class=\"team-").concat(state.players[b.winner], "\">").concat(b.winner, "</span></li>");
      });
      _html5 += '</ul>';
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
        _html6 += "<div class=\"attractions-current\">".concat(current.name, "</div>");
      }
      if (next) {
        var diff = Math.ceil((new Date(next.time) - now) / 60000);
        _html6 += "<div class=\"attractions-next-label\">Em seguida</div>";
        _html6 += "<div class=\"attractions-next\">".concat(next.name, " <span class=\"clock\">\uD83D\uDD52 ").concat(diff, " min</span></div>");
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
    var html = '<h1>Placar 🏆</h1><ul>';
    scoreEntries.forEach(function (_ref, i) {
      var _ref2 = _slicedToArray(_ref, 2),
        team = _ref2[0],
        score = _ref2[1];
      html += "<li>".concat(state.teamNames[team], " - ").concat(score, " ").concat(i == 0 ? '🏆' : '', "</li>");
    });
    html += '</ul>';
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
  var updateAndRender = function updateAndRender(data) {
    state = data;
    render();
  };
  var fetchState = function fetchState() {
    fetch('/api/state').then(function (r) {
      return r.json();
    }).then(updateAndRender)["catch"](function (err) {
      return console.error('Polling failed', err);
    });
  };
  var startPolling = function startPolling() {
    clearInterval(pollTimer);
    fetchState();
    pollTimer = setInterval(fetchState, 5000);
  };
  var startWebSocket = function startWebSocket() {
    if (!window.WebSocket) {
      console.warn("WebSocket indispon\xEDvel, iniciando polling");
      startPolling();
      return;
    }
    var proto = location.protocol === 'https:' ? 'wss' : 'ws';
    var ws = new WebSocket("".concat(proto, "://").concat(location.host));
    ws.onmessage = function (e) {
      updateAndRender(JSON.parse(e.data));
    };
    ws.onerror = function () {
      console.warn('WebSocket erro, alternando para polling');
      startPolling();
    };
    ws.onclose = function () {
      console.warn('WebSocket fechado, alternando para polling');
      startPolling();
    };
  };
  var slidesEl = document.getElementById('slides');
  var state = {};
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
  startWebSocket();
}
