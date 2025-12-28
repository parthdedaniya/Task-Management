const request = require('supertest');
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.NODE_ENV = 'test';
const app = require('../server');
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

describe('Task Routes', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');

    // Create a test user
    const userResult = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
      ['Test User', 'tasktest@example.com', 'hashedpassword']
    );
    userId = userResult.rows[0].id;
    authToken = jwt.sign({ id: userId, email: 'tasktest@example.com' }, process.env.JWT_SECRET || 'test-secret');
  });

  afterAll(async () => {
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');
    await pool.end();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'Test Description',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', 'Test Task');
      expect(response.body).toHaveProperty('status', 'pending');
    });

    it('should require title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Test Description',
        });

      expect(response.status).toBe(400);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {
    it('should get user tasks with pagination', async () => {
      const response = await request(app)
        .get('/api/tasks?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tasks');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page', 1);
      expect(response.body).toHaveProperty('totalPages');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task to Update',
        });

      const taskId = createResponse.body.id;

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'in_progress',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'in_progress');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      // Create a task first
      const createResponse = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Task to Delete',
        });

      const taskId = createResponse.body.id;

      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });
  });
});

