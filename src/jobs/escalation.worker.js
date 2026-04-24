const pool = require('../../config/dbConfig');

async function escalationJob() {
  const { rows } = await pool.query(`
    SELECT *
    FROM token_requests
    WHERE status='PENDING'
    AND created_at <= NOW() - INTERVAL '1 hour'
  `);

  for (const r of rows) {
    await pool.query(`
      INSERT INTO notifications
      (id,email,template_code,metadata,scheduledat,status)
      VALUES (gen_random_uuid(),$1,'ESCALATION',$2,NOW(),'PENDING')
    `, [
      r.assignee_email,
      JSON.stringify({ requestId: r.id })
    ]);
  }
}

setInterval(escalationJob, 60000);