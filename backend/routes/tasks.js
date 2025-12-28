const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { createTask, getUserTasks, getTaskById, updateTask, deleteTask } = require('../models/task');

router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getUserTasks(req.user.id, page, limit);
    res.json(result);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = await createTask(req.user.id, title, description);
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await getTaskById(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (status && !['pending', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be pending, in_progress, or done' });
    }

    const task = await updateTask(req.params.id, req.user.id, { title, description, status });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await deleteTask(req.params.id, req.user.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


