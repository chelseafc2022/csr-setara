const express = require('express');
const router = express.Router();
const db = require('../../db/MySql/umum');


router.post('/homeCSRview', (req, res) => {
  try {
    const page_limit = 6;
    const offset = 0; // halaman pertama

    const sql = `
      SELECT 
        k.*,
        kc.nama_kecamatan,
        ds.nama_des_kel AS nama_desa,
        b.uraian AS uraian_bidang_csr,
        bs.uraian AS uraian_bidang_sub_csr
      FROM kegiatan_csr k
      LEFT JOIN master_kecamatan kc ON k.kecamatan_id = kc.kecamatan_id
      LEFT JOIN master_des_kel ds ON k.desa_id = ds.des_kel_id
      LEFT JOIN master_bidang_csr b ON k.bidang_csr_id = b.id
      LEFT JOIN master_bidang_sub_csr bs ON k.bidang_sub_csr_id = bs.id
      ORDER BY k.createdAt DESC
      LIMIT ${offset}, ${page_limit}
    `;

    db.query(sql, (err, rows) => {
      if(err) return res.status(500).json({ success: false, message: "DB Error", error: err });
      res.json({ data: rows });
    });

  } catch(error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});

// 3 berita terbaru untuk Home
router.post("/beritaHome", (req, res) => {
  const sql = `
    SELECT id, judul, sumber, deskripsi, isi, file_name, createdBy, createAt
    FROM berita
    ORDER BY createAt DESC
    LIMIT 3
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Error beritaHome:", err);
      return res.status(500).send([]);
    }
    res.send(rows); // langsung array
  });
});

module.exports = router;
