const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

exports.createToken = async (req, res) => {
  const { vendorName, assigneeEmail } = req.body;

  const result = await pool.query(`
    INSERT INTO token_requests (vendor_name, assignee_email, status)
    VALUES ($1,$2,'PENDING') RETURNING *
  `, [vendorName, assigneeEmail]);

  const r = result.rows[0];

  await pool.query(`
    INSERT INTO notifications
    (id,email,template_code,metadata,scheduledat,status)
    VALUES ($1,$2,'TOKEN_CREATED',$3,NOW(),'PENDING')
  `, [
    uuidv4(),
    'purchase@test.com',
    {
      vendorName,
      requestId: r.id,
      createdAt: r.created_at
    }
  ]);

  res.json({ message: 'Token created', id: r.id });
};

exports.approveToken = async (req, res) => {
  const { requestId } = req.body;

  await pool.query(
    `UPDATE token_requests SET status = 'APPROVED' WHERE id = $1`,
    [requestId]
  );

  res.json({ message: 'Token approved' });
};