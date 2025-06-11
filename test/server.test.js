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
});
