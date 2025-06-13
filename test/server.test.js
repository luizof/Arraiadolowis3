const request = require('supertest');
const fs = require('fs');
const path = require('path');

process.env.DATA_FILE = path.join(__dirname, 'test-data.json');
const { app } = require('../src/server');

beforeEach(() => {
  if (fs.existsSync(process.env.DATA_FILE)) {
    fs.unlinkSync(process.env.DATA_FILE);
  }
});

afterAll(() => {
  if (fs.existsSync(process.env.DATA_FILE)) {
    fs.unlinkSync(process.env.DATA_FILE);
  }
});

describe('Express API', () => {
  it('registers a player and returns state', async () => {
    await request(app)
      .post('/api/player')
      .send({ name: 'Alice', team: 'blue' })
      .expect(200);

    const res = await request(app)
      .get('/api/state')
      .expect(200);

    expect(res.body.players.Alice).toBe('blue');
  });

  it('manages attractions', async () => {
    await request(app)
      .post('/api/attraction')
      .send({ name: 'Show', time: '2023-01-01T10:00' })
      .expect(200);

    await request(app)
      .put('/api/attraction/0')
      .send({ name: 'Show 2', time: '2023-01-01T11:00' })
      .expect(200);

    const list = await request(app)
      .get('/api/attractions')
      .expect(200);

    expect(list.body[0]).toEqual({ name: 'Show 2', time: '2023-01-01T11:00' });

    await request(app)
      .delete('/api/attraction/0')
      .expect(200);

    const empty = await request(app)
      .get('/api/attractions')
      .expect(200);

    expect(empty.body).toEqual([]);
  });

  it('updates points configuration', async () => {
    await request(app)
      .post('/api/config/points')
      .send({ bullFirst: 99 })
      .expect(200);

    const res = await request(app)
      .get('/api/state')
      .expect(200);

    expect(res.body.points.bullFirst).toBe(99);
  });

  it('ignores scores for removed players', async () => {
    await request(app).post('/api/player').send({ name: 'Alice', team: 'blue' }).expect(200);
    await request(app).post('/api/player').send({ name: 'Bob', team: 'yellow' }).expect(200);

    await request(app)
      .post('/api/cotton')
      .send({ p1: 'Alice', p2: 'Bob', winner: 'Alice' })
      .expect(200);

    await request(app).delete('/api/player/Alice').expect(200);

    const res = await request(app).get('/api/state').expect(200);

    expect(res.body.players.Alice).toBeUndefined();
    expect(res.body.scores.blue).toBe(0);
    expect(res.body.scores.yellow).toBe(0);
    expect('undefined' in res.body.scores).toBe(false);
  });

  it('only scores bull when finished', async () => {
    await request(app).post('/api/reset').expect(200);
    await request(app).post('/api/player').send({ name: 'Alice', team: 'blue' }).expect(200);
    await request(app).post('/api/bull').send({ name: 'Alice', time: 5 }).expect(200);

    let res = await request(app).get('/api/state').expect(200);
    expect(res.body.scores.blue).toBe(0);

    await request(app).post('/api/bull/finish').expect(200);

    res = await request(app).get('/api/state').expect(200);
    expect(res.body.scores.blue).toBe(res.body.points.bullFirst);
  });

  it('rejects cotton wars between players of the same team', async () => {
    await request(app).post('/api/player').send({ name: 'Alice', team: 'blue' }).expect(200);
    await request(app).post('/api/player').send({ name: 'Bob', team: 'blue' }).expect(200);

    await request(app)
      .post('/api/cotton')
      .send({ p1: 'Alice', p2: 'Bob', winner: 'Alice' })
      .expect(400);
  });

  it('rejects beer pong matches between the same team', async () => {
    await request(app).post('/api/player').send({ name: 'A1', team: 'blue' }).expect(200);
    await request(app).post('/api/player').send({ name: 'A2', team: 'blue' }).expect(200);
    await request(app).post('/api/player').send({ name: 'B1', team: 'blue' }).expect(200);
    await request(app).post('/api/player').send({ name: 'B2', team: 'blue' }).expect(200);

    await request(app)
      .post('/api/beer')
      .send({ team1: ['A1','A2'], team2: ['B1','B2'], winner: 'blue' })
      .expect(400);
  });

  it('rejects pacal duels between players of the same team', async () => {
    await request(app).post('/api/player').send({ name: 'P1', team: 'yellow' }).expect(200);
    await request(app).post('/api/player').send({ name: 'P2', team: 'yellow' }).expect(200);

    await request(app)
      .post('/api/pacal')
      .send({ p1: 'P1', p2: 'P2', winner: 'P1' })
      .expect(400);
  });

  it('renames a player and updates all event references', async () => {
    await request(app).post('/api/reset').expect(200);
    await request(app).post('/api/player').send({ name: 'Old', team: 'blue' }).expect(200);
    await request(app).post('/api/player').send({ name: 'Opp', team: 'yellow' }).expect(200);

    await request(app)
      .post('/api/cotton')
      .send({ p1: 'Old', p2: 'Opp', winner: 'Old' })
      .expect(200);

    await request(app).put('/api/player/Old').send({ name: 'New' }).expect(200);

    const res = await request(app).get('/api/state').expect(200);
    expect(res.body.players.Old).toBeUndefined();
    expect(res.body.players.New).toBe('blue');
    expect(res.body.cottonWars[0].p1).toBe('New');
    expect(res.body.cottonWars[0].winner).toBe('New');
    expect(res.body.scores.blue).toBe(res.body.points.cottonWin);
  });
});
