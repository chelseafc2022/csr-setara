const express = require('express');
const router = express.Router();
const db = require('../../db/MySql/umum');

// apiMysql/publish/beritaCSR.js
router.post("/getview", (req, res) => {
  try {
    let { data_ke = 1, page_limit = 6, cari_value = "" } = req.body;
    const offset = (data_ke - 1) * page_limit;

    let where = "";
    let values = [];

    if (cari_value.trim() !== "") {
      where = "WHERE judul LIKE ? OR deskripsi LIKE ? OR sumber LIKE ?";
      values = [`%${cari_value}%`, `%${cari_value}%`, `%${cari_value}%`];
    }

    const sqlCount = `SELECT COUNT(*) as total FROM berita ${where}`;
    db.query(sqlCount, values, (err, countResult) => {
      if (err) {
        console.error("❌ Error count:", err);
        return res.status(500).json({ success: false, message: "DB Error count" });
      }

      const total = countResult[0].total;

      const sqlData = `
        SELECT id, judul, sumber, deskripsi, isi, file_name, createdBy, createAt
        FROM berita
        ${where}
        ORDER BY createAt DESC
        LIMIT ? OFFSET ?
      `;
      db.query(sqlData, [...values, Number(page_limit), offset], (err2, rows) => {
        if (err2) {
          console.error("❌ Error getview:", err2);
          return res.status(500).json({ success: false, message: "DB Error getview" });
        }

        res.json({
          success: true,
          total,
          data: rows,
        });
      });
    });
  } catch (e) {
    console.error("❌ Exception getview:", e);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.post("/detilBerita", (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "ID berita tidak boleh kosong" });
    }

    const sql = `
      SELECT 
        b.id,
        b.judul,
        b.sumber,
        b.deskripsi,
        b.isi,
        b.file_name,
        b.createdBy,
        b.createAt
      FROM berita b
      WHERE b.id = ?
      LIMIT 1
    `;

    db.query(sql, [id], (err, rows) => {
      if (err) {
        console.error("❌ DB Error detail berita:", err);
        return res.status(500).json({ success: false, message: "DB Error", error: err });
      }

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Berita tidak ditemukan" });
      }

      res.json({ success: true, data: rows[0] });
    });

  } catch (error) {
    console.error("❌ Exception detail berita:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
});



module.exports = router;
