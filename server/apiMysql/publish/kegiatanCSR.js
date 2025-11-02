const express = require('express');
const router = express.Router();
const db = require('../../db/MySql/umum');

router.post('/kegiatanCSRview', (req, res) => {
  try {
    const {
      page_limit = 9,       // jumlah data per halaman
      data_ke = 1,          // halaman saat ini
      status,
      kecamatan_id,
      desa_id,
      bidang_csr_id,
      bidang_sub_csr_id,
      cari_value
    } = req.body;

    const offset = (parseInt(data_ke) - 1) * parseInt(page_limit);

    // Bangun kondisi WHERE
    let where = "WHERE 1=1 ";
    if(status) where += ` AND k.status = ${db.escape(status)} `;
    if(kecamatan_id) where += ` AND k.kecamatan_id = ${db.escape(kecamatan_id)} `;
    if(desa_id) where += ` AND k.desa_id = ${db.escape(desa_id)} `;
    if(bidang_csr_id) where += ` AND k.bidang_csr_id = ${db.escape(bidang_csr_id)} `;
    if(bidang_sub_csr_id) where += ` AND k.bidang_sub_csr_id = ${db.escape(bidang_sub_csr_id)} `;
    if(cari_value) where += ` AND k.nama_csr LIKE ${db.escape('%' + cari_value + '%')} `;

    // Hitung total data
    const countSql = `SELECT COUNT(*) as total FROM kegiatan_csr k ${where}`;
    db.query(countSql, (err, countResult) => {
      if(err) return res.status(500).json({ success: false, message: "DB Error", error: err });

      const total = countResult[0].total;

      // Ambil data sesuai halaman
      const sql = `
        SELECT 
          k.*,
          k.status AS status,
          kc.nama_kecamatan,
          ds.nama_des_kel AS nama_desa,
          b.uraian AS uraian_bidang_csr,
          bs.uraian AS uraian_bidang_sub_csr
        FROM kegiatan_csr k
        LEFT JOIN master_kecamatan kc ON k.kecamatan_id = kc.kecamatan_id
        LEFT JOIN master_des_kel ds ON k.desa_id = ds.des_kel_id
        LEFT JOIN master_bidang_csr b ON k.bidang_csr_id = b.id
        LEFT JOIN master_bidang_sub_csr bs ON k.bidang_sub_csr_id = bs.id
        ${where}
        ORDER BY k.createdAt DESC
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

// Endpoint detailCSR
router.post('/detailCSR', (req, res) => {
  try {
      const { id } = req.body;

      if (!id) {
          return res.status(400).json({ success: false, message: "ID CSR tidak boleh kosong" });
      }

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
          WHERE k.id = ?
          LIMIT 1
      `;

      db.query(sql, [id], (err, rows) => {
          if (err) return res.status(500).json({ success: false, message: "DB Error", error: err });
          if (rows.length === 0) return res.status(404).json({ success: false, message: "CSR tidak ditemukan" });
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
router.get('/bidangCSR', (req, res) => {
  const sql = `SELECT id, uraian FROM master_bidang_csr ORDER BY uraian`;
  db.query(sql, (err, rows) => {
    if(err) return res.status(500).json({ success:false, error: err });
    res.json(rows);
  });
});



router.get('/subBidangCSR', (req, res) => {
  const bidang_id = req.query.bidang_id;
  const sql = `SELECT id, uraian FROM master_bidang_sub_csr WHERE master_bidang_csr_id = ? ORDER BY uraian`;
  db.query(sql, [bidang_id], (err, rows) => {
    if(err) return res.status(500).json({ success:false, error: err });
    res.json(rows);
  });
});

router.get('/lihatmitra', (req, res) => {
  try {
    const { id: kegiatan_id } = req.query;
    console.log('Received kegiatan_id:', kegiatan_id);  // Debug log

    if (!kegiatan_id) {
      return res.status(400).json({ success: false, message: "ID kegiatan tidak boleh kosong" });
    }

    const checkStatusSql = `SELECT status FROM kegiatan_csr WHERE id = ? LIMIT 1`;
    db.query(checkStatusSql, [kegiatan_id], (err, statusResult) => {
      if (err) {
        console.error('DB Error in checkStatusSql:', err);  // Debug log
        return res.status(500).json({ success: false, message: "DB Error", error: err });
      }
      if (statusResult.length === 0) {
        console.log('No kegiatan found for id:', kegiatan_id);  // Debug log
        return res.status(404).json({ success: false, message: "Kegiatan tidak ditemukan" });
      }
      if (![2, 3, 4].includes(statusResult[0].status)) {
        return res.status(403).json({ success: false, message: "Status kegiatan tidak memungkinkan melihat mitra" });
      }

      const sql = `
        SELECT 
          km.jumlah_ambil,
          p.nama AS nama_mitra, satuan, nilai
        FROM kegiatan_mitra km
        LEFT JOIN perusahaan p ON km.perusahaan_id = p.users_id
        LEFT JOIN kegiatan_csr kc ON km.kegiatan_id = kc.id
        WHERE km.kegiatan_id = ? AND km.status_pengajuan = 2
        ORDER BY km.createdAt DESC
      `;
      db.query(sql, [kegiatan_id], (err, rows) => {
        if (err) {
          console.error('DB Error in mitra query:', err);  // Debug log
          return res.status(500).json({ success: false, message: "DB Error", error: err });
        }
        console.log('Mitra data:', rows);  // Debug log
        res.json({ success: true, data: rows });
      });
    });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});

module.exports = router;

