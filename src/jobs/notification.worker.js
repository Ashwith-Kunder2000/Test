const pool = require('../../config/dbConfig');
const Mustache = require('mustache');
const { sendEmail } = require('../services/emailService');

async function runWorker() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(`
      SELECT n.*, t.subject, t.body
      FROM notifications n
      JOIN email_templates t ON n.template_code = t.code
      WHERE n.status='PENDING'
      AND n.scheduledat <= NOW()
      FOR UPDATE SKIP LOCKED
      LIMIT 10
    `);

    for (const n of rows) {
      try {
        const subject = Mustache.render(n.subject, n.metadata);
        const body = Mustache.render(n.body, n.metadata);

        await sendEmail(n.email, subject, body);

        await client.query(`
          UPDATE notifications
          SET status='SENT', sentat=NOW()
          WHERE id=$1
        `, [n.id]);

      } catch (err) {
        await client.query(`
          UPDATE notifications
          SET status='FAILED'
          WHERE id=$1
        `, [n.id]);
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}

setInterval(runWorker, 5000);