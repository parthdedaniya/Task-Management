const pool = require('../config/database');

const createTask = async (userId, title, description) => {
  const result = await pool.query(
    'INSERT INTO tasks (user_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, title, description || null, 'pending']
  );
  return result.rows[0];
};

const getUserTasks = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
    [userId, limit, offset]
  );
  const countResult = await pool.query('SELECT COUNT(*) FROM tasks WHERE user_id = $1', [userId]);
  return {
    tasks: result.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(countResult.rows[0].count / limit),
  };
};

const getTaskById = async (taskId, userId) => {
  const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
  return result.rows[0];
};

const updateTask = async (taskId, userId, updates) => {
  const { title, description, status } = updates;
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (title !== undefined) {
    fields.push(`title = $${paramCount++}`);
    values.push(title);
  }
  if (description !== undefined) {
    fields.push(`description = $${paramCount++}`);
    values.push(description);
  }
  if (status !== undefined) {
    fields.push(`status = $${paramCount++}`);
    values.push(status);
  }

  if (fields.length === 0) {
    return getTaskById(taskId, userId);
  }

  values.push(taskId, userId);
  const result = await pool.query(
    `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${paramCount} AND user_id = $${paramCount + 1} RETURNING *`,
    values
  );
  return result.rows[0];
};

const deleteTask = async (taskId, userId) => {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', [taskId, userId]);
  return result.rows[0];
};

module.exports = {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
};


