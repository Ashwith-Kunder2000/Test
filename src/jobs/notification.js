const pool = require('../../config/dbConfig');
const { sendEmail } = require('../services/emailService');
const SCHEMA = process.env.DB_SCHEMA || 'public';

(async () => {
  console.log('⏰ Notification job started');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `
      SELECT *
      FROM ${SCHEMA}.notifications
      WHERE scheduledat <= NOW()
      AND status = 'PENDING'
      FOR UPDATE SKIP LOCKED
      `
    );

    for (const n of rows) {
      await sendEmail(n.email, n.title, n.body);

      await client.query(
        `
        UPDATE ${SCHEMA}.notifications
        SET status='SENT', sentat=NOW()
        WHERE id=$1
        `,
        [n.id]
      );

      console.log(`✅ Sent notification ${n.id}`);
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Job failed', err);
  } finally {
    client.release();
    process.exit(0);
  }
})();
