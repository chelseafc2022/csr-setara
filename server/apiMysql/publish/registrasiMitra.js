const express = require('express');
const router = express.Router();
const db = require('../../db/MySql/umum');  // Pastikan koneksi database benar
const upload = require('../../db/multer/pdf');  // Impor Multer (pastikan path benar)

router.post("/", upload.single('dokumen'), async (req, res) => {
  try {
    const {
      nama,  // PIC (tidak digunakan di query ini, tapi bisa ditambahkan jika perlu)
      jabatan,  // PIC (tidak digunakan, hapus jika tidak diperlukan)
      pic_email,  // PIC (tidak digunakan, hapus jika tidak diperlukan)
      pic_hp,  // PIC (tidak digunakan, hapus jika tidak diperlukan)
      perusahaan_nama,  // Digunakan sebagai 'nama' di tabel
      bidang_usaha_id,
      perusahaan_email,
      perusahaan_hp,
      alamat
    } = req.body;

    const dokumenFile = req.file;  // File dokumen yang diupload

    // Validasi: Pastikan file diupload
    if (!dokumenFile) {
      return res.status(400).json({ success: false, message: "Dokumen wajib diupload!" });
    }

    // Gunakan filename dari Multer (asumsi nama file yang disimpan, misalnya 'dokumen.pdf')
    // Jika Multer menyimpan path lengkap, ganti dengan dokumenFile.path
    const fileName = dokumenFile.filename;  // Atau dokumenFile.path jika path lengkap

    // Query INSERT: Sesuaikan dengan struktur database
    // Kolom: users_id, nama, bidang_usaha_id, email, hp, alamat, file_name, status, catatan_admin, createdAt
    const sqlPending = `
      INSERT INTO perusahaan 
      (users_id, nama, bidang_usaha_id, email, hp, alamat, file_name, status, catatan_admin, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'Menunggu Verifikasi Admin', NOW())
    `;

    // Array parameter: Sesuaikan dengan 7 placeholder (?)
    // [users_id, nama, bidang_usaha_id, email, hp, alamat, file_name]
    const params = [
      null,  // users_id (null, bisa diisi dari session jika ada user login)
      perusahaan_nama,
      bidang_usaha_id,
      perusahaan_email,
      perusahaan_hp,
      alamat,
      fileName  // file_name dari Multer
    ];

    // Eksekusi query
    db.query(sqlPending, params, (err, result) => {
      if (err) {
        console.error("Error inserting data: ", err);  // Log error untuk debugging
        return res.status(500).json({ success: false, error: "Gagal menyimpan data: " + err.message });
      }
      console.log("Data berhasil disimpan, ID:", result.insertId);  // Log sukses
      res.json({ success: true, message: "Permohonan diterima dan akan diverifikasi.", id: result.insertId });
    });

  } catch (error) {
    console.error("🔥 Error registrasi:", error);
    res.status(500).json({ success: false, error: "Terjadi kesalahan server: " + error.message });
  }
});

module.exports = router;