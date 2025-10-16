const express = require('express');
const router = express.Router();
const db = require('../../db/MySql/umum');  // Pastikan terhubung
const upload = require('../../db/multer/pdf');  // Impor Multer dari file Anda

router.post("/", upload.single('dokumen'), async (req, res) => {
  try {
    const {
      nama,  // PIC
      jabatan,  // PIC  (Catatan: jabatan tidak digunakan di query, pastikan jika dibutuhkan)
      pic_email,  // PIC
      pic_hp,  // PIC
      perusahaan_nama,  // Digunakan sebagai 'nama' di tabel
      bidang_usaha_id,
      perusahaan_email,
      perusahaan_hp,
      alamat
    } = req.body;

    const dokumenFile = req.file;  // File dokumen yang diupload

    if (!dokumenFile) {
      return res.status(400).json({ success: false, message: "Dokumen wajib diupload!" });
    }

    const sqlPending = `
      INSERT INTO perusahaan 
      (users_id, nama, bidang_usaha_id, email, hp, alamat, file_name, status, createdAt)
      VALUES (NULL, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `;  // Sekarang memiliki 7 placeholder, tapi kita sesuaikan array

    // Array parameter: Pastikan sesuai dengan 7 placeholder
    // Asumsi: nama = perusahaan_nama, email = perusahaan_email, hp = perusahaan_hp, file_name = dokumenFile.path
    db.query(
      sqlPending,
      [perusahaan_nama, bidang_usaha_id, perusahaan_email, perusahaan_hp, alamat, dokumenFile.path],  // Array dengan 6 item, tapi SQL awalnya 7—lihat penjelasan
      (err, result) => {
        if (err) {
          console.error("Error insert: ", err);  // Log error untuk debugging
          return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: "Permohonan diterima dan akan diverifikasi." });
      }
    );

  } catch (error) {
    console.error("🔥 Error registrasi:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
