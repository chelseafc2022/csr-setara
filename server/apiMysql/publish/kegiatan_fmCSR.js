const express = require('express');
const router = express.Router();
const db = require('../../db/MySql/umum');

router.post('/forceMajeureView', (req, res) => {
  try {
    const {
      page_limit = 9,       // jumlah data per halaman
      data_ke = 1,          // halaman saat ini
      status,
      kecamatan_id,
      desa_id,
      bidang_force_id,
      cari_value
    } = req.body;

    const offset = (parseInt(data_ke) - 1) * parseInt(page_limit);

    // Bangun kondisi WHERE
    let where = "WHERE 1=1 ";
    if(status) where += ` AND f.status = ${db.escape(status)} `;
    if(kecamatan_id) where += ` AND f.kecamatan_id = ${db.escape(kecamatan_id)} `;
    if(desa_id) where += ` AND f.desa_id = ${db.escape(desa_id)} `;
    if(bidang_force_id) where += ` AND f.bidang_force_id = ${db.escape(bidang_force_id)} `;
    if(cari_value) where += ` AND f.nama_force LIKE ${db.escape('%' + cari_value + '%')} `;

    // Hitung total data
    const countSql = `SELECT COUNT(*) as total FROM force_majeure f ${where}`;
    db.query(countSql, (err, countResult) => {
      if(err) return res.status(500).json({ success: false, message: "DB Error", error: err });

      const total = countResult[0].total;

      // Ambil data sesuai halaman
      const sql = `
        SELECT 
          f.*,
          f.status AS status,
          kc.nama_kecamatan,
          ds.nama_des_kel AS nama_desa,
          bf.uraian AS uraian_bidang_force
        FROM force_majeure f
        LEFT JOIN master_kecamatan kc ON f.kecamatan_id = kc.kecamatan_id
        LEFT JOIN master_des_kel ds ON f.desa_id = ds.des_kel_id
        LEFT JOIN master_force_majeure bf ON f.bidang_force_id = bf.id
        ${where}
        ORDER BY f.createdAt DESC
        LIMIT ${parseInt(offset)}, ${parseInt(page_limit)}
      `;

      db.query(sql, (err, rows) => {
        if(err) return res.status(500).json({ success: false, message: "DB Error", error: err });

        res.json({
          data: rows,
          total,
          page: parseInt(data_ke),
          page_limit: parseInt(page_limit)
        });
      });
    });

  } catch(error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});

// Endpoint detailForceMajeure
router.post('/detailForceMajeure', (req, res) => {
  try {
      const { id } = req.body;

      if (!id) {
          return res.status(400).json({ success: false, message: "ID Force Majeure tidak boleh kosong" });
      }

      const sql = `
          SELECT 
              f.*,
              kc.nama_kecamatan,
              ds.nama_des_kel AS nama_desa,
              mf.uraian AS uraian_bidang_force
          FROM force_majeure f
          LEFT JOIN master_kecamatan kc ON f.kecamatan_id = kc.kecamatan_id
          LEFT JOIN master_des_kel ds ON f.desa_id = ds.des_kel_id
          LEFT JOIN master_force_majeure mf ON f.bidang_force_id = mf.id
          WHERE f.id = ?
          LIMIT 1
      `;

      db.query(sql, [id], (err, rows) => {
          if (err) return res.status(500).json({ success: false, message: "DB Error", error: err });
          if (rows.length === 0) return res.status(404).json({ success: false, message: "Force Majeure tidak ditemukan" });
          res.json({ success: true, data: rows[0] });
      });

  } catch (error) {
      console.error("❌ Server Error:", error);
      res.status(500).json({ success: false, message: "Server Error", error });
  }
});

// Ambil semua kecamatan
router.post('/kecamatan', (req, res) => {
  const sql = `SELECT kecamatan_id, nama_kecamatan FROM master_kecamatan WHERE kabupaten_id = 7405 ORDER BY nama_kecamatan`;
  db.query(sql, (err, rows) => {
    if(err) return res.status(500).json({ success:false, error: err });
    res.json(rows);
  });
});

// Ambil desa berdasarkan kecamatan
router.post('/desa', (req, res) => {
  const { kecamatan_id } = req.body;
  const sql = `SELECT des_kel_id, nama_des_kel FROM master_des_kel WHERE kecamatan_id = ? ORDER BY nama_des_kel`;
  db.query(sql, [kecamatan_id], (err, rows) => {
    if(err) return res.status(500).json({ success:false, error: err });
    res.json(rows);
  });
});

// Ambil semua bidang CSR
// Endpoint bidangForceMajeure
router.get('/bidangForceMajeure', (req, res) => {
  const sql = `SELECT id, uraian FROM master_force_majeure ORDER BY uraian`;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json(rows);
  });
});







module.exports = router;
