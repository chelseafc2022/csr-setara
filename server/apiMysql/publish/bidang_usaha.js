const express = require('express');
const router = express.Router();
const db = require('../../db/MySql/umum'); // sesuaikan dengan koneksi db kamu

router.post('/view', (req, res) => {
    const sql = `SELECT id, uraian FROM master_bidang_usaha ORDER BY uraian ASC`;
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error query bidang usaha:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ data: results });
    });
  });

module.exports = router;
