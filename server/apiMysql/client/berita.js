const express = require('express');
var db = require('../../db/MySql/umum');
const path = require("path");


const fs = require('fs');

var multer=require("multer");
var upload = require('../../db/multer/image');

var uniqid = require('uniqid');
const { log } = require('console');
const router = express.Router();

// GETVIEW DATA BERITA
router.post("/getview", (req, res) => {
  try {
    let { data_ke = 1, cari_value = "", page_limit = 10 } = req.body;
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
        SELECT id, judul, sumber, deskripsi, isi, file_name, createdBy, createAt, editeAt
        FROM berita
        ${where}
        ORDER BY createAt DESC
        LIMIT ? OFFSET ?
      `;
      db.query(sqlData, [...values, Number(page_limit), offset], (err, rows) => {
        if (err) {
          console.error("❌ Error getview:", err);
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


// ADD DATA BERITA
router.post("/addData", upload.single("file_name"), (req, res) => {
  try {
    const { judul, sumber, deskripsi, isi } = req.body;
    const createdBy = req.user?.username || "system"; // kalau ada middleware auth
    const file_name = req.file ? req.file.filename : null;

    if (!judul || !deskripsi || !isi) {
      return res.status(400).json({ success: false, message: "Judul, deskripsi, dan isi wajib diisi" });
    }

    const id = "BRT-" + Date.now(); // generate ID unik
    const sql = `
      INSERT INTO berita (id, judul, sumber, deskripsi, isi, file_name, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [id, judul, sumber, deskripsi, isi, file_name, createdBy], (err, result) => {
      if (err) {
        console.error("❌ Error insert:", err);
        return res.status(500).json({ success: false, message: "DB Error insert" });
      }

      res.json({ success: true, message: "Berita berhasil ditambahkan", id });
    });
  } catch (e) {
    console.error("❌ Exception addData:", e);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});
// ================= UPDATE DATA =================
router.post("/updateData", upload.single("file"), (req, res) => {
  const { id, judul, sumber, deskripsi, isi, file_name } = req.body;

  // Cek apakah ada file baru
  let newFile = null;
  if (req.file) {
    newFile = req.file.filename;
  }

  // Ambil dulu data lama (untuk tahu file lama)
  db.query("SELECT file_name FROM berita WHERE id = ?", [id], (err, rows) => {
    if (err) {
      console.error("❌ DB error (select):", err);
      return res.status(500).json({ success: false, message: "DB Error select" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    const oldFile = rows[0].file_name;

    // Query update
    const sql = `
      UPDATE berita 
      SET judul = ?, sumber = ?, deskripsi = ?, isi = ?, file_name = ?, editeAt = NOW()
      WHERE id = ?
    `;

    const finalFile = newFile || file_name || oldFile;

    db.query(sql, [judul, sumber, deskripsi, isi, finalFile, id], (err2, result) => {
      if (err2) {
        console.error("❌ DB error (update):", err2);
        return res.status(500).json({ success: false, message: "DB Error update" });
      }

      // Jika ada file baru → hapus file lama
      if (newFile && oldFile && oldFile !== finalFile) {
        const oldPath = path.join(__dirname, "../uploads/berita", oldFile);
        if (fs.existsSync(oldPath)) {
          fs.unlink(oldPath, (err3) => {
            if (err3) console.error("⚠️ Gagal hapus file lama:", err3);
          });
        }
      }

      res.json({ success: true, message: "✅ Data berhasil diupdate" });
    });
  });
});

// REMOVE DATA BERITA + FILE
router.post('/removeData', (req, res) => {
  const id = req.body.id;

  // 1. Cari dulu file_name berdasarkan ID
  db.query("SELECT file_name FROM berita WHERE id = ?", [id], (err, rows) => {
    if (err) {
      console.error("❌ Error SELECT:", err);
      return res.status(500).json({ success: false, message: "DB Error select" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    const fileName = rows[0].file_name;

    // 2. Hapus data dari DB
    db.query("DELETE FROM berita WHERE id = ?", [id], (err2, result) => {
      if (err2) {
        console.error("❌ Error DELETE:", err2);
        return res.status(500).json({ success: false, message: "DB Error delete" });
      }

      // 3. Kalau ada file → hapus fisik file di folder uploads
      if (fileName) {
        const filePath = path.join(__dirname, "../../uploads", fileName);
        if (fs.existsSync(filePath)) {
          fs.unlink(filePath, (err3) => {
            if (err3) {
              console.error("⚠️ Gagal hapus file:", err3);
            }
          });
        }
      }

      res.json({ success: true, message: "✅ Data & file berhasil dihapus" });
    });
  });
});


module.exports = router;