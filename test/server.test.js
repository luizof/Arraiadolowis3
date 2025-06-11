const request = require('supertest');
const { app } = require('../src/server');

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
});
