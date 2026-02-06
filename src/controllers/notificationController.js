const pool = require('../../config/dbConfig');
const SCHEMA = process.env.DB_SCHEMA || 'public';

exports.createNotification = async (req, res) => {
  try {
    const { id, userId, title, body, scheduledAt, email } = req.body;

    await pool.query(
      `INSERT INTO ${SCHEMA}.notifications
       (id, userid, title, body, email, scheduledat, status)
       VALUES ($1,$2,$3,$4,$5,$6,'PENDING')`,
      [id, userId, title, body, email, scheduledAt]
    );

    res.status(201).json({ message: 'Notification scheduled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

exports.cancelNotification = async (req, res) => {
  try {
    const { id } = req.query;

    const { rowCount } = await pool.query(
      `
      UPDATE ${SCHEMA}.notifications
      SET status = 'CANCELLED'
      WHERE id = $1
      AND status = 'PENDING'
      `,
      [id]
    );

    if (rowCount === 0) {
      return res.status(400).json({
        message: 'Notification cannot be cancelled (already processed or not found)'
      });
    }

    res.json({ message: 'Notification cancelled successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel notification' });
  }
};

