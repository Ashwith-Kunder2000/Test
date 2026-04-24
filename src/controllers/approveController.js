exports.approveToken = async (req, res) => {
  const { id } = req.body;

  await pool.query(`
    UPDATE token_requests SET status='APPROVED' WHERE id=$1
  `, [id]);

  await pool.query(`
    INSERT INTO notifications
    (id,email,template_code,metadata,scheduledat,status)
    VALUES (gen_random_uuid(),$1,'TOKEN_APPROVED',$2,NOW(),'PENDING')
  `, [
    'admin@test.com',
    JSON.stringify({ requestId: id, approvedBy: 'Manager' })
  ]);

  res.json({ message: 'Approved' });
};